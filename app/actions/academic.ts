"use server"

import { randomUUID } from "node:crypto"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { uploadToR2 } from "@/lib/r2"
import { revalidatePath } from "next/cache"

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
  })
  if (!student) {
    return { success: false, error: "Data adik asuh tidak ditemukan." }
  }

  const kelasSaatItu = String(formData.get("kelasSaatItu") ?? "").trim()
  const nilaiRataRata = String(formData.get("nilaiRataRata") ?? "").trim()
  const isPindahJenjang =
    formData.get("isPindahJenjang") === "true" || formData.get("isPindahJenjang") === "on"
  const namaSekolahBaru = isPindahJenjang
    ? String(formData.get("namaSekolahBaru") ?? "").trim()
    : null
  const file = formData.get("file")

  // Validasi wajib
  if (!kelasSaatItu) {
    return { success: false, error: "Kelas / Tingkat Saat Ini wajib diisi." }
  }
  if (!nilaiRataRata) {
    return { success: false, error: "Nilai Rata-Rata / IPK Terbaru wajib diisi." }
  }
  if (isPindahJenjang && !namaSekolahBaru) {
    return {
      success: false,
      error: "Nama Sekolah / Kampus Baru wajib diisi jika Anda memilih pindah jenjang.",
    }
  }

  let publicUrl: string | null = null

  // Validasi dan proses upload dokumen rapor (opsional)
  if (file instanceof File && file.size > 0) {
    if (!isValidFileType(file)) {
      return {
        success: false,
        error: "File rapor harus berupa gambar (JPG/PNG/WEBP) atau dokumen PDF.",
      }
    }

    if (file.size > maxFileSize) {
      return {
        success: false,
        error: "Ukuran file rapor terlalu besar (maksimal 15 MB). Silakan kompres berkas terlebih dahulu.",
      }
    }

    try {
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
      const key = `academic/${student.id}/rapor-${randomUUID()}.${extension}`
      const contentType = file.type || (extension === "pdf" ? "application/pdf" : "image/jpeg")

      if (process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID) {
        await uploadToR2({
          key,
          body: new Uint8Array(await file.arrayBuffer()),
          contentType,
        })
        publicUrl = process.env.R2_PUBLIC_URL
          ? `${process.env.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`
          : `/${key}`
      } else {
        const buffer = Buffer.from(await file.arrayBuffer())
        publicUrl = `data:${contentType};base64,${buffer.toString("base64")}`
      }
    } catch (uploadError) {
      console.error("[createStudentAcademicUpdateAction upload error]", uploadError)
      return {
        success: false,
        error: "Gagal mengunggah file rapor ke server. Silakan periksa koneksi internet Anda.",
      }
    }
  }

  try {
    // 1. Buat record AcademicUpdate baru
    await prisma.academicUpdate.create({
      data: {
        studentId: student.id,
        tanggalInput: new Date(),
        kelasSaatItu,
        nilaiRataRata,
        namaSekolahBaru: namaSekolahBaru || null,
        dokumenRapor: publicUrl,
      },
    })

    // 2. Perbarui data master Student dengan nilai dan kelas terbaru
    await prisma.student.update({
      where: { id: student.id },
      data: {
        gradeLevel: kelasSaatItu,
        nilaiRataRata: nilaiRataRata,
        ...(namaSekolahBaru ? { schoolName: namaSekolahBaru } : {}),
      },
    })

    revalidatePath("/dashboard")
    revalidatePath("/pengawas")
    revalidatePath(`/pengawas/students/${student.id}`)
    revalidatePath(`/admin/dashboard/data-anak-asuh/${student.id}`)

    return {
      success: true,
      message: "Pembaruan nilai dan rapor berhasil disimpan!",
    }
  } catch (dbError) {
    console.error("[createStudentAcademicUpdateAction database error]", dbError)
    return {
      success: false,
      error: "Gagal menyimpan data pembaruan akademik ke database. Silakan coba lagi.",
    }
  }
}
