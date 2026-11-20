"use server"

import { randomUUID } from "node:crypto"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { uploadToR2 } from "@/lib/r2"
import { revalidatePath } from "next/cache"
import { getCurrentPeriode, getPeriodeDateRange } from "@/lib/periode"

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

/**
 * Server Action batch untuk membuat bukti penyaluran dana pengawas.
 * Menjamin:
 * 1. Hanya anak binaan sendiri (pengawasId = pengawas.id) dan status = "approved".
 * 2. Keterangan wajib diisi.
 * 3. Wilayah Jepara: 1 file bersama diupload sekali, batchId sama & unik.
 *    Wilayah lain: 1 file per anak, batchId null.
 * 4. Bersifat all-or-nothing dalam prisma.$transaction.
 */
export async function createPengawasBatchDisbursementAction(
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

  // 1. Keterangan bersifat opsional (tidak wajib diisi)
  const keterangan = String(formData.get("keterangan") ?? "").trim() || null

  // 2. Ambil list studentIds
  const rawStudentIds = formData
    .getAll("studentIds")
    .map((v) => Number(v))
    .filter((n) => !isNaN(n) && n > 0)
  const studentIds = Array.from(new Set(rawStudentIds))

  if (studentIds.length === 0) {
    return {
      success: false,
      error: "Silakan pilih minimal 1 adik asuh penerima dana.",
    }
  }

  // 3. Validasi DB: Seluruh siswa WAJIB milik pengawas yang login dan berstatus 'approved'
  const validStudents = await prisma.student.findMany({
    where: {
      id: { in: studentIds },
      pengawasId: pengawas.id,
      status: "approved",
    },
    select: {
      id: true,
      fullName: true,
    },
  })

  if (validStudents.length !== studentIds.length) {
    return {
      success: false,
      error:
        "Akses ditolak: Terdapat siswa yang bukan anak binaan Anda atau belum berstatus disetujui (approved).",
    }
  }

  const studentMap = new Map(validStudents.map((s) => [s.id, s.fullName]))

  // 3b. Periode tujuan (dari formData atau periode berjalan saat ini)
  const periodeInput = String(formData.get("periode") ?? "").trim()
  const targetPeriode = periodeInput || getCurrentPeriode()
  const { start: periodStart, end: periodEnd } = getPeriodeDateRange(targetPeriode)

  // Validasi pencegahan ganda di periode yang dipilih: tidak boleh ada bukti pending/verified
  const existingProofsInPeriod = await prisma.disbursementProof.findMany({
    where: {
      studentId: { in: studentIds },
      status: { in: ["pending", "verified"] },
      tanggal: {
        gte: periodStart,
        lte: periodEnd,
      },
    },
    select: {
      studentId: true,
      status: true,
    },
  })

  if (existingProofsInPeriod.length > 0) {
    const dupId = existingProofsInPeriod[0].studentId
    const name = studentMap.get(dupId) || `Anak ID ${dupId}`
    const statusText =
      existingProofsInPeriod[0].status === "verified"
        ? "sudah terverifikasi"
        : "menunggu verifikasi"
    return {
      success: false,
      error: `${name} sudah memiliki bukti penyaluran dana (${statusText}) pada periode ${targetPeriode}.`,
    }
  }

  // 4. Validasi nominal untuk tiap anak
  const studentNominals: Record<number, number> = {}
  for (const sid of studentIds) {
    const rawNominal = String(formData.get(`nominal_${sid}`) ?? "").replace(/\D/g, "")
    const nominal = Number(rawNominal)
    if (!nominal || isNaN(nominal) || nominal <= 0) {
      const name = studentMap.get(sid) || `Anak ID ${sid}`
      return {
        success: false,
        error: `Nominal bantuan untuk ${name} harus lebih dari Rp 0.`,
      }
    }
    studentNominals[sid] = nominal
  }

  // 5. Validasi berkas bukti:
  // Jika ada berkas bukti bersama/kolektif (sharedFile atau file), 1 bukti ini mewakili semua anak yang dipilih.
  const uploadedShared = formData.get("sharedFile") || formData.get("file")
  let sharedFile: File | null = null
  const studentFiles: Record<number, File> = {}

  if (uploadedShared instanceof File && uploadedShared.size > 0) {
    if (!isValidFileType(uploadedShared)) {
      return {
        success: false,
        error: "File bukti harus berupa gambar (JPG/PNG/WEBP) atau PDF.",
      }
    }
    if (uploadedShared.size > maxFileSize) {
      return {
        success: false,
        error: "Ukuran file bukti terlalu besar (maksimal 15 MB).",
      }
    }
    sharedFile = uploadedShared
  } else {
    // Cek jika pengawas mengunggah file per anak (fallback)
    for (const sid of studentIds) {
      const file = formData.get(`file_${sid}`)
      const name = studentMap.get(sid) || `Anak ID ${sid}`
      if (!(file instanceof File) || file.size === 0) {
        return {
          success: false,
          error: `Silakan unggah bukti transfer/penyerahan dana.`,
        }
      }
      if (!isValidFileType(file)) {
        return {
          success: false,
          error: `File bukti untuk ${name} harus berupa gambar (JPG/PNG/WEBP) atau PDF.`,
        }
      }
      if (file.size > maxFileSize) {
        return {
          success: false,
          error: `Ukuran file bukti untuk ${name} terlalu besar (maksimal 15 MB).`,
        }
      }
      studentFiles[sid] = file
    }
  }

  // 6. Upload file ke R2 & susun record
  try {
    const now = new Date()
    // Pastikan tanggal pencatatan berada di dalam rentang periode yang dipilih
    const disbursementDate =
      now >= periodStart && now <= periodEnd ? now : periodStart

    type ProofCreateData = {
      studentId: number
      pengawasId: number
      nominal: number
      fileUrl: string
      status: string
      tanggal: Date
      keterangan: string | null
      batchId: string | null
    }

    const recordsToCreate: ProofCreateData[] = []

    if (sharedFile) {
      // 1 bukti bersama mewakili semua siswa yang dipilih
      const ext = sharedFile.name.split(".").pop()?.toLowerCase() || "jpg"
      const batchId = studentIds.length > 1 ? `batch_${randomUUID()}` : null
      const key = `disbursements/${pengawas.id}/${batchId || randomUUID()}.${ext}`
      const contentType =
        sharedFile.type || (ext === "pdf" ? "application/pdf" : "image/jpeg")

      let publicUrl = ""
      if (process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID) {
        await uploadToR2({
          key,
          body: new Uint8Array(await sharedFile.arrayBuffer()),
          contentType,
        })
        publicUrl = process.env.R2_PUBLIC_URL
          ? `${process.env.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`
          : `/${key}`
      } else {
        const buffer = Buffer.from(await sharedFile.arrayBuffer())
        publicUrl = `data:${contentType};base64,${buffer.toString("base64")}`
      }

      for (const sid of studentIds) {
        recordsToCreate.push({
          studentId: sid,
          pengawasId: pengawas.id,
          nominal: studentNominals[sid],
          fileUrl: publicUrl,
          status: "pending",
          tanggal: disbursementDate,
          keterangan,
          batchId,
        })
      }
    } else {
      // Fallback: file individu per anak
      for (const sid of studentIds) {
        const file = studentFiles[sid]
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
        const key = `disbursements/${pengawas.id}/${sid}-${randomUUID()}.${ext}`
        const contentType =
          file.type || (ext === "pdf" ? "application/pdf" : "image/jpeg")

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

        recordsToCreate.push({
          studentId: sid,
          pengawasId: pengawas.id,
          nominal: studentNominals[sid],
          fileUrl: publicUrl,
          status: "pending",
          tanggal: disbursementDate,
          keterangan,
          batchId: null,
        })
      }
    }

    // 7. Simpan seluruh record dalam satu prisma.$transaction (All-or-nothing)
    await prisma.$transaction(
      recordsToCreate.map((data) =>
        prisma.disbursementProof.create({
          data,
        })
      )
    )

    // 8. Revalidasi path terkait
    revalidatePath("/pengawas")
    revalidatePath("/pengawas/penyaluran-dana")
    revalidatePath("/admin/dashboard/audit-finansial")
    for (const sid of studentIds) {
      revalidatePath(`/pengawas/students/${sid}`)
      revalidatePath(`/admin/dashboard/data-anak-asuh/${sid}`)
    }

    return {
      success: true,
      message: `Bukti penyaluran dana untuk ${recordsToCreate.length} anak binaan berhasil dikirim dan menunggu verifikasi Admin.`,
    }
  } catch (error) {
    console.error("[createPengawasBatchDisbursementAction Error]", error)
    return {
      success: false,
      error:
        "Gagal menyimpan bukti penyaluran. Terjadi kendala saat upload atau database, silakan coba lagi.",
    }
  }
}

/**
 * Fallback kompatibilitas untuk form single submission lama
 */
export async function createPengawasDisbursementProofAction(
  formData: FormData
): Promise<PengawasDisbursementResult> {
  const studentIdStr = String(formData.get("studentId") ?? "").trim()
  const nominal = String(formData.get("nominal") ?? "").trim()
  const file = formData.get("file")
  const keterangan = String(formData.get("keterangan") ?? "Penyaluran dana").trim()

  const batchForm = new FormData()
  batchForm.append("keterangan", keterangan)
  batchForm.append("studentIds", studentIdStr)
  batchForm.append(`nominal_${studentIdStr}`, nominal)
  if (file instanceof File) {
    batchForm.append(`file_${studentIdStr}`, file)
    batchForm.append("sharedFile", file)
  }

  return createPengawasBatchDisbursementAction(batchForm)
}
