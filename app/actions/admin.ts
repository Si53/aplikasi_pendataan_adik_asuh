"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createAdminNoteAction(
  studentId: number,
  note: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Akses ditolak. Anda bukan Administrator." }
  }

  const cleanNote = note.trim()
  if (!cleanNote) {
    return { success: false, error: "Catatan evaluasi tidak boleh kosong." }
  }

  try {
    let adminId = Number(session.user.id)
    if (isNaN(adminId) || !adminId) {
      if (session.user.email) {
        const admin = await prisma.admin.findUnique({
          where: { email: session.user.email.toLowerCase().trim() },
        })
        if (admin) {
          adminId = admin.id
        }
      }
    }

    if (!adminId || isNaN(adminId)) {
      // Fallback first admin
      const fallbackAdmin = await prisma.admin.findFirst()
      if (fallbackAdmin) {
        adminId = fallbackAdmin.id
      } else {
        return { success: false, error: "Akun admin tidak ditemukan di database." }
      }
    }

    await prisma.adminNote.create({
      data: {
        studentId,
        adminId,
        note: cleanNote,
      },
    })

    revalidatePath(`/admin/dashboard/data-anak-asuh/${studentId}`)
    return { success: true }
  } catch (error) {
    console.error("[createAdminNoteAction Error]", error)
    return { success: false, error: "Gagal menyimpan catatan evaluasi." }
  }
}

export async function verifyDisbursementAction(
  proofId: number,
  studentId: number
): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Akses ditolak. Anda bukan Administrator." }
  }

  try {
    await prisma.disbursementProof.update({
      where: { id: proofId },
      data: {
        status: "verified",
        processedAt: new Date(),
      },
    })

    revalidatePath(`/admin/dashboard/data-anak-asuh/${studentId}`)
    revalidatePath("/admin/dashboard/audit-finansial")
    return { success: true }
  } catch (error) {
    console.error("[verifyDisbursementAction Error]", error)
    return { success: false, error: "Gagal memverifikasi bukti penyaluran." }
  }
}

export async function processDisbursementAction(
  proofId: number,
  status: "verified" | "rejected"
): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Akses ditolak. Anda bukan Administrator." }
  }

  try {
    const updated = await prisma.disbursementProof.update({
      where: { id: proofId },
      data: {
        status,
        processedAt: new Date(),
      },
      select: {
        studentId: true,
      },
    })

    revalidatePath("/admin/dashboard/audit-finansial")
    if (updated.studentId) {
      revalidatePath(`/admin/dashboard/data-anak-asuh/${updated.studentId}`)
    }
    return { success: true }
  } catch (error) {
    console.error("[processDisbursementAction Error]", error)
    return {
      success: false,
      error: `Gagal memperbarui status menjadi ${status}.`,
    }
  }
}

export async function createBantuanAdjustmentAction(
  studentId: number,
  nominalLama: number,
  nominalBaru: number,
  catatan: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Akses ditolak. Anda bukan Administrator." }
  }

  const cleanCatatan = catatan.trim()

  try {
    let adminId = Number(session.user.id)
    if (isNaN(adminId) || !adminId) {
      if (session.user.email) {
        const admin = await prisma.admin.findUnique({
          where: { email: session.user.email.toLowerCase().trim() },
        })
        if (admin) {
          adminId = admin.id
        }
      }
    }

    if (!adminId || isNaN(adminId)) {
      const fallbackAdmin = await prisma.admin.findFirst()
      if (fallbackAdmin) {
        adminId = fallbackAdmin.id
      } else {
        return { success: false, error: "Akun admin tidak ditemukan di database." }
      }
    }

    await prisma.bantuanAdjustment.create({
      data: {
        studentId,
        adminId,
        nominalLama,
        nominalBaru,
        catatan: cleanCatatan || null,
      },
    })

    revalidatePath("/admin/dashboard/alokasi-dana")
    revalidatePath(`/admin/dashboard/data-anak-asuh/${studentId}`)
    revalidatePath("/admin/dashboard/audit-finansial")

    return { success: true }
  } catch (error) {
    console.error("[createBantuanAdjustmentAction Error]", error)
    return { success: false, error: "Gagal menyimpan riwayat penyesuaian dana." }
  }
}

export async function updateStudentStatusAction(
  studentId: number,
  newStatus: "approved" | "nonaktif" | "rejected" | string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Akses ditolak. Anda bukan Administrator." }
  }

  const cleanReason = reason.trim()
  if (!cleanReason) {
    return { success: false, error: "Alasan perubahan status wajib diisi." }
  }

  try {
    let adminId = Number(session.user.id)
    if (isNaN(adminId) || !adminId) {
      if (session.user.email) {
        const admin = await prisma.admin.findUnique({
          where: { email: session.user.email.toLowerCase().trim() },
        })
        if (admin) {
          adminId = admin.id
        }
      }
    }

    if (!adminId || isNaN(adminId)) {
      const fallbackAdmin = await prisma.admin.findFirst()
      if (fallbackAdmin) {
        adminId = fallbackAdmin.id
      } else {
        return { success: false, error: "Akun admin tidak ditemukan di database." }
      }
    }

    const noteText =
      newStatus === "perlu_revisi"
        ? cleanReason
        : `Perubahan status ke ${newStatus.toUpperCase()}: ${cleanReason}`

    await prisma.$transaction([
      prisma.student.update({
        where: { id: studentId },
        data: { status: newStatus },
      }),
      prisma.adminNote.create({
        data: {
          studentId,
          adminId,
          note: noteText,
        },
      }),
    ])

    revalidatePath("/admin/dashboard/kontrol-status")
    revalidatePath("/admin/dashboard/data-anak-asuh")
    revalidatePath(`/admin/dashboard/data-anak-asuh/${studentId}`)
    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/dashboard/audit-finansial")
    revalidatePath("/admin/dashboard/alokasi-dana")

    return { success: true }
  } catch (error) {
    console.error("[updateStudentStatusAction Error]", error)
    return { success: false, error: "Gagal memperbarui status adik asuh." }
  }
}

export async function updatePengawasStatusAction(
  pengawasId: number,
  newStatus: "aktif" | "nonaktif" | string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Akses ditolak. Anda bukan Administrator." }
  }

  const cleanReason = reason.trim()
  if (!cleanReason) {
    return { success: false, error: "Alasan perubahan status wajib diisi." }
  }

  try {
    let adminId = Number(session.user.id)
    if (isNaN(adminId) || !adminId) {
      if (session.user.email) {
        const admin = await prisma.admin.findUnique({
          where: { email: session.user.email.toLowerCase().trim() },
        })
        if (admin) {
          adminId = admin.id
        }
      }
    }

    if (!adminId || isNaN(adminId)) {
      const fallbackAdmin = await prisma.admin.findFirst()
      if (fallbackAdmin) {
        adminId = fallbackAdmin.id
      } else {
        return { success: false, error: "Akun admin tidak ditemukan di database." }
      }
    }

    const noteText = `Perubahan status ke ${newStatus.toUpperCase()}: ${cleanReason}`

    await prisma.$transaction([
      prisma.pengawas.update({
        where: { id: pengawasId },
        data: { status: newStatus },
      }),
      prisma.adminNote.create({
        data: {
          pengawasId,
          adminId,
          note: noteText,
        },
      }),
    ])

    revalidatePath("/admin/dashboard/kontrol-status")
    revalidatePath("/admin/dashboard/data-anak-asuh")
    revalidatePath("/admin/dashboard")

    return { success: true }
  } catch (error) {
    console.error("[updatePengawasStatusAction Error]", error)
    return { success: false, error: "Gagal memperbarui status pengawas." }
  }
}


