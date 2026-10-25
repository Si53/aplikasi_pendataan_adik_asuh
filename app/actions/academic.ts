"use server"

import { randomUUID } from "node:crypto"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { uploadToR2 } from "@/lib/r2"
import { revalidatePath } from "next/cache"
import {
  determineCurrentEducationPosition,
  getAllowedJenjang,
  isNaikJenjang,
  isValidJenjangTransition,
} from "@/lib/academic"

const allowedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/pjpeg",
  "application/octet-stream",
])

const allowedExtensions = new Set([
  "pdf",
  "jpg",
  "jpeg",
  "png",
  "webp",
  "heic",
  "heif",
])

const maxFileSize = 15 * 1024 * 1024 // 15 MB

function isValidFileType(file: File): boolean {
  const extension = file.name.split(".").pop()?.toLowerCase() || ""
  if (allowedExtensions.has(extension)) return true
  if (allowedMimeTypes.has(file.type)) return true
  if (file.type.startsWith("image/")) return true
  return false
}

export type AcademicUpdateResult =
  | { success: true; message: string }
  | { success: false; error: string }

export async function createStudentAcademicUpdateAction(
  formData: FormData
): Promise<AcademicUpdateResult> {
  const session = await auth()
  if (!session?.user || session.user.role !== "STUDENT" || !session.user.username) {
    return { success: false, error: "Akses ditolak. Sesi adik asuh tidak valid." }
  }

  const student = await prisma.student.findUnique({
    where: { username: session.user.username },
    include: {
      academicUpdates: {
        orderBy: {
          tanggalInput: "desc",
        },
        take: 1,
      },
    },
  })
  if (!student) {
    return { success: false, error: "Data adik asuh tidak ditemukan." }
  }

  const latestUpdate =
    student.academicUpdates && student.academicUpdates.length > 0
      ? student.academicUpdates[0]
      : null
  const currentPos = determineCurrentEducationPosition(student, latestUpdate)

  const kategoriPendidikan = String(formData.get("kategoriPendidikan") ?? "").trim() // "Sekolah" | "Kuliah"
  const jenjangInput = String(formData.get("jenjang") ?? "").trim() // "SD" | "SMP" | "SMA" | "Kuliah"
  const gradeLevelInput = String(formData.get("gradeLevel") ?? "").trim() // "1".."6" or "Semester 1".."Semester 10"
  const semesterInput = String(formData.get("semester") ?? "").trim() // "Ganjil" | "Genap"
  const kelasSaatItuInput = String(formData.get("kelasSaatItu") ?? "").trim()
  const nilaiRataRata = String(formData.get("nilaiRataRata") ?? "").trim()

  const targetJenjang = kategoriPendidikan === "Kuliah" ? "Kuliah" : jenjangInput

  // Validasi posisi & batasan jenjang (Requirement 3 & 5)
  // Kecuali jika jenjang tidak dapat ditentukan sama sekali (siswa lama, Requirement 6)
  if (currentPos && currentPos.isKnown) {
    if (currentPos.jenjang === "Kuliah" && kategoriPendidikan === "Sekolah") {
      return {
        success: false,
        error: "Adik asuh di jenjang Kuliah tidak dapat kembali memilih jenjang Sekolah.",
      }
    }
    if (["SD", "SMP"].includes(currentPos.jenjang) && kategoriPendidikan === "Kuliah") {
      return {
        success: false,
        error: `Adik asuh di jenjang ${currentPos.jenjang} belum dapat memilih jenjang Kuliah.`,
      }
    }

    if (!isValidJenjangTransition(currentPos.jenjang, targetJenjang)) {
      const allowed = getAllowedJenjang(currentPos.jenjang)
      return {
        success: false,
        error: `Pilihan jenjang tidak valid. Data terakhir kamu adalah ${currentPos.labelDisplay}. Pilihan yang diperbolehkan hanya ${allowed.join(" atau ")}.`,
      }
    }
  }

  const movingUp = Boolean(
    currentPos?.isKnown && isNaikJenjang(currentPos.jenjang, targetJenjang)
  )
  const isPindahJenjang =
    movingUp ||
    formData.get("isPindahJenjang") === "true" ||
    formData.get("isPindahJenjang") === "on"

  const namaSekolahBaru = isPindahJenjang
    ? String(formData.get("namaSekolahBaru") ?? "").trim()
    : null
  const programAkselerasiInput =
    formData.get("programAkselerasi") === "true" || formData.get("programAkselerasi") === "on"

  // Tentukan jenjang & gradeLevel baru
  let newJenjang: string = student.jenjang || "SD"
  let newGradeLevel: string = student.gradeLevel || "1"
  let kelasSaatItu: string = kelasSaatItuInput
  let semesterValue: string | null = null

  if (kategoriPendidikan === "Kuliah") {
    newJenjang = "Kuliah"
    newGradeLevel = gradeLevelInput || kelasSaatItuInput || "Semester 1"
    kelasSaatItu = newGradeLevel
    semesterValue = null
  } else {
    newJenjang = ["SD", "SMP", "SMA", "SMK"].includes(jenjangInput)
      ? jenjangInput
      : student.jenjang || "SD"
    newGradeLevel = gradeLevelInput || "1"
    if (!kelasSaatItu) {
      kelasSaatItu = `Kelas ${newGradeLevel} ${newJenjang}`
    }
    semesterValue = semesterInput || null
  }

  // Validasi wajib
  if (kategoriPendidikan === "Sekolah") {
    if (!jenjangInput) {
      return {
        success: false,
        error: "Jenjang sekolah wajib dipilih (SD, SMP, atau SMA).",
      }
    }
    if (!gradeLevelInput) {
      return {
        success: false,
        error: "Kelas saat ini wajib dipilih.",
      }
    }
    if (!semesterInput || !["Ganjil", "Genap"].includes(semesterInput)) {
      return {
        success: false,
        error: "Semester (Ganjil atau Genap) wajib dipilih.",
      }
    }
  } else {
    if (!gradeLevelInput && !kelasSaatItuInput) {
      return {
        success: false,
        error: "Semester saat ini wajib dipilih.",
      }
    }
  }
  if (!nilaiRataRata) {
    return {
      success: false,
      error: kategoriPendidikan === "Kuliah" ? "IPK Terbaru wajib diisi." : "Nilai Rata-Rata Terbaru wajib diisi.",
    }
  }

  // Normalisasi koma ke titik dan validasi numerik sisi server
  const normalizedNilai = nilaiRataRata.replace(",", ".").trim()
  const parsedNilai = parseFloat(normalizedNilai)

  if (isNaN(parsedNilai) || !/^\d+(\.\d{1,2})?$/.test(normalizedNilai)) {
    return {
      success: false,
      error:
        kategoriPendidikan === "Kuliah"
          ? "IPK harus berupa angka numerik yang valid (maksimal 2 angka desimal)."
          : "Nilai Rata-rata harus berupa angka numerik yang valid (maksimal 2 angka desimal).",
    }
  }

  if (kategoriPendidikan === "Kuliah") {
    if (parsedNilai < 0 || parsedNilai > 4.0) {
      return {
        success: false,
        error: "IPK harus antara 0 sampai 4,00.",
      }
    }
  } else {
    if (parsedNilai < 0 || parsedNilai > 100) {
      return {
        success: false,
        error: "Nilai Rata-rata harus antara 0 sampai 100.",
      }
    }
  }

  if (isPindahJenjang && !namaSekolahBaru) {
    return {
      success: false,
      error:
        targetJenjang === "Kuliah"
          ? "Nama Universitas Baru wajib diisi jika Anda naik jenjang."
          : "Nama Sekolah Baru wajib diisi jika Anda naik jenjang.",
    }
  }

  // Kumpulkan seluruh file rapor yang diunggah
  const rawFiles = formData.getAll("files").concat(formData.getAll("file"))
  const files: File[] = rawFiles.filter(
    (f): f is File => f instanceof File && f.size > 0 && f.name !== "undefined"
  )

  // Validasi wajib dokumen rapor (minimal 1 berkas)
  if (files.length === 0) {
    return {
      success: false,
      error: "Dokumen rapor wajib diunggah (minimal 1 berkas).",
    }
  }

  // Validasi tipe dan ukuran setiap berkas rapor
  for (const file of files) {
    if (!isValidFileType(file)) {
      return {
        success: false,
        error: `File "${file.name}" tidak valid. Dokumen rapor harus berupa gambar (JPG/PNG/WEBP) atau PDF.`,
      }
    }
    if (file.size > maxFileSize) {
      return {
        success: false,
        error: `Ukuran file "${file.name}" terlalu besar (maksimal 15 MB). Silakan kompres berkas terlebih dahulu.`,
      }
    }
  }

  // Kumpulkan berkas prestasi (opsional)
  const rawPrestasiFiles = formData.getAll("prestasiFiles").concat(formData.getAll("prestasi"))
  const prestasiFiles: File[] = rawPrestasiFiles.filter(
    (f): f is File => f instanceof File && f.size > 0 && f.name !== "undefined"
  )

  // Validasi tipe dan ukuran setiap berkas prestasi (jika ada)
  for (const file of prestasiFiles) {
    if (!isValidFileType(file)) {
      return {
        success: false,
        error: `File prestasi "${file.name}" tidak valid. Berkas harus berupa gambar (JPG/PNG/WEBP) atau PDF.`,
      }
    }
    if (file.size > maxFileSize) {
      return {
        success: false,
        error: `Ukuran file prestasi "${file.name}" terlalu besar (maksimal 15 MB). Silakan kompres berkas terlebih dahulu.`,
      }
    }
  }

  // Upload seluruh berkas rapor ke R2 / Data URL
  const uploadedUrls: string[] = []
  try {
    for (const file of files) {
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
      const key = `academic/${student.id}/rapor-${randomUUID()}.${extension}`
      const contentType = file.type || (extension === "pdf" ? "application/pdf" : "image/jpeg")

      if (process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID) {
        await uploadToR2({
          key,
          body: new Uint8Array(await file.arrayBuffer()),
          contentType,
        })
        const publicUrl = process.env.R2_PUBLIC_URL
          ? `${process.env.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`
          : `/${key}`
        uploadedUrls.push(publicUrl)
      } else {
        const buffer = Buffer.from(await file.arrayBuffer())
        uploadedUrls.push(`data:${contentType};base64,${buffer.toString("base64")}`)
      }
    }
  } catch (uploadError) {
    console.error("[createStudentAcademicUpdateAction upload error]", uploadError)
    return {
      success: false,
      error: "Gagal mengunggah file rapor ke server. Silakan periksa koneksi internet Anda.",
    }
  }

  // Upload berkas prestasi (jika ada) ke R2 / Data URL
  const uploadedPrestasiUrls: string[] = []
  try {
    for (const file of prestasiFiles) {
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
      const key = `academic/${student.id}/prestasi-${randomUUID()}.${extension}`
      const contentType = file.type || (extension === "pdf" ? "application/pdf" : "image/jpeg")

      if (process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID) {
        await uploadToR2({
          key,
          body: new Uint8Array(await file.arrayBuffer()),
          contentType,
        })
        const publicUrl = process.env.R2_PUBLIC_URL
          ? `${process.env.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`
          : `/${key}`
        uploadedPrestasiUrls.push(publicUrl)
      } else {
        const buffer = Buffer.from(await file.arrayBuffer())
        uploadedPrestasiUrls.push(`data:${contentType};base64,${buffer.toString("base64")}`)
      }
    }
  } catch (uploadPrestasiError) {
    console.error("[createStudentAcademicUpdateAction upload prestasi error]", uploadPrestasiError)
    return {
      success: false,
      error: "Gagal mengunggah berkas prestasi ke server. Silakan periksa koneksi internet Anda.",
    }
  }

  const docRaporPayload =
    uploadedUrls.length === 1 ? uploadedUrls[0] : JSON.stringify(uploadedUrls)

  try {
    // 1. Buat record AcademicUpdate baru
    await prisma.academicUpdate.create({
      data: {
        studentId: student.id,
        tanggalInput: new Date(),
        kelasSaatItu,
        semester: semesterValue,
        nilaiRataRata: normalizedNilai,
        namaSekolahBaru: namaSekolahBaru || null,
        dokumenRapor: docRaporPayload,
      },
    })

    // 2. Simpan juga ke model Document dengan tipe "RAPOR"
    if (uploadedUrls.length > 0) {
      await prisma.document.createMany({
        data: uploadedUrls.map((url) => ({
          studentId: student.id,
          type: "RAPOR",
          fileUrl: url,
          uploadedAt: new Date(),
        })),
      })
    }

    // 2b. Simpan berkas prestasi ke model Document dengan tipe "PRESTASI"
    if (uploadedPrestasiUrls.length > 0) {
      await prisma.document.createMany({
        data: uploadedPrestasiUrls.map((url) => ({
          studentId: student.id,
          type: "PRESTASI",
          fileUrl: url,
          uploadedAt: new Date(),
        })),
      })
    }

    // 3. Perbarui data master Student (gradeLevel, jenjang, nilaiRataRata, programAkselerasi, schoolName)
    const updatedAkselerasi =
      kategoriPendidikan === "Kuliah" || newJenjang === "Kuliah"
        ? programAkselerasiInput
        : student.programAkselerasi

    await prisma.student.update({
      where: { id: student.id },
      data: {
        gradeLevel: newGradeLevel,
        jenjang: newJenjang,
        nilaiRataRata: normalizedNilai,
        programAkselerasi: updatedAkselerasi,
        ...(namaSekolahBaru ? { schoolName: namaSekolahBaru } : {}),
      },
    })

    revalidatePath("/dashboard")
    revalidatePath("/pengawas")
    revalidatePath(`/pengawas/students/${student.id}`)
    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/dashboard/data-anak-asuh")
    revalidatePath(`/admin/dashboard/data-anak-asuh/${student.id}`)
    revalidatePath("/admin/dashboard/alokasi-dana")

    return {
      success: true,
      message: "Pembaruan nilai dan dokumen rapor berhasil disimpan!",
    }
  } catch (dbError) {
    console.error("[createStudentAcademicUpdateAction database error]", dbError)
    return {
      success: false,
      error: "Gagal menyimpan data pembaruan akademik ke database. Silakan coba lagi.",
    }
  }
}
