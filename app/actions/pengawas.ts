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

export type PengawasDisbursementResult =
  | { success: true; message: string }
  | { success: false; error: string }

export async function createPengawasDisbursementProofAction(
  formData: FormData
): Promise<PengawasDisbursementResult> {
  const session = await auth()
  if (!session?.user || session.user.role !== "PENGAWAS" || !session.user.username) {
    return { success: false, error: "Akses ditolak. Sesi pengawas tidak valid." }
  }

  const pengawas = await prisma.pengawas.findUnique({
    where: { username: session.user.username },
  })
  if (!pengawas) {
    return { success: false, error: "Akun pengawas tidak ditemukan." }
  }

  const studentIdStr = String(formData.get("studentId") ?? "").trim()
  const nominalRaw = String(formData.get("nominal") ?? "").replace(/\D/g, "")
  const file = formData.get("file")

  const studentId = Number(studentIdStr)
  if (!studentId || isNaN(studentId)) {
    return { success: false, error: "Silakan pilih adik asuh penerima dana." }
  }

  const nominal = Number(nominalRaw)
  if (!nominal || isNaN(nominal) || nominal <= 0) {
    return { success: false, error: "Nominal bantuan wajib diisi dan harus lebih dari 0." }
  }

  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Silakan unggah foto atau file bukti transfer/penyerahan." }
  }

  if (!isValidFileType(file)) {
    return {
      success: false,
      error: "File bukti harus berupa gambar (JPG/PNG/WEBP) atau PDF.",
    }
  }

  if (file.size > maxFileSize) {
    return {
      success: false,
      error: "Ukuran file terlalu besar (maksimal 15 MB). Silakan kompres berkas terlebih dahulu.",
    }
  }

  // Verifikasi siswa berada di bawah pengawas ini atau satu wilayah dan berstatus approved
  const student = await prisma.student.findFirst({
    where: {
      id: studentId,
      status: "approved",
      OR: [{ pengawasId: pengawas.id }, { wilayah: pengawas.wilayah }],
    },
  })
  if (!student) {
    return { success: false, error: "Data adik asuh tidak ditemukan atau belum disetujui (approved) pada wilayah tugas Anda." }
  }

  try {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const key = `disbursements/${pengawas.id}/${studentId}-${randomUUID()}.${extension}`
    const contentType = file.type || (extension === "pdf" ? "application/pdf" : "image/jpeg")

    let publicUrl = ""

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

    await prisma.disbursementProof.create({
      data: {
        studentId,
        pengawasId: pengawas.id,
        nominal,
        fileUrl: publicUrl,
        status: "pending",
        tanggal: new Date(),
      },
    })

    revalidatePath("/pengawas")
    revalidatePath("/pengawas/penyaluran-dana")
    revalidatePath("/admin/dashboard/audit-finansial")
    revalidatePath(`/admin/dashboard/data-anak-asuh/${studentId}`)

    return {
      success: true,
      message: `Bukti penyaluran dana sebesar Rp ${nominal.toLocaleString("id-ID")} untuk ${student.fullName} berhasil dikirim dan menunggu verifikasi Admin.`,
    }
  } catch (error) {
    console.error("[createPengawasDisbursementProofAction Error]", error)
    return {
      success: false,
      error: "Gagal menyimpan bukti penyaluran. Periksa koneksi internet Anda dan coba lagi.",
    }
  }
}
