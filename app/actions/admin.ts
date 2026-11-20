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

/**
 * Memperbarui tarif standar beasiswa per jenjang (SD, SMP, SMA, SMK, Kuliah)
 */
export async function updateScholarshipRatesAction(
  rates: { jenjang: string; nominal: number }[]
): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Akses ditolak. Anda bukan Administrator." }
  }

  if (!rates || rates.length === 0) {
    return { success: false, error: "Data tarif tidak boleh kosong." }
  }

  try {
    for (const item of rates) {
      if (!item.jenjang || typeof item.nominal !== "number" || item.nominal < 0) {
        continue
      }
      await prisma.scholarshipRate.upsert({
        where: { jenjang: item.jenjang },
        update: { nominal: item.nominal },
        create: { jenjang: item.jenjang, nominal: item.nominal },
      })
    }

    revalidatePath("/admin/dashboard/alokasi-dana")
    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/dashboard/kontrol-status")
    revalidatePath("/pengawas/penyaluran-dana")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("[updateScholarshipRatesAction Error]", error)
    return { success: false, error: "Gagal memperbarui tarif beasiswa." }
  }
}

/**
 * Membuat akun pengawas baru dari dashboard admin
 */
export async function createPengawasAction(data: {
  name: string
  username: string
  password?: string
  wilayah: string
  noHp?: string
}): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Akses ditolak. Anda bukan Administrator." }
  }

  const cleanName = (data.name || "").trim()
  const cleanUsername = (data.username || "").toLowerCase().trim()
  const cleanWilayah = (data.wilayah || "").trim()
  const cleanNoHp = (data.noHp || "").trim()
  const rawPassword = (data.password || "").trim() || "hidupadikasuh"

  if (!cleanName) {
    return { success: false, error: "Nama pengawas wajib diisi." }
  }
  if (!cleanUsername) {
    return { success: false, error: "Username wajib diisi." }
  }
  if (!cleanWilayah) {
    return { success: false, error: "Wilayah penugasan wajib dipilih." }
  }

  // Cek keunikan username
  const existingPengawas = await prisma.pengawas.findUnique({
    where: { username: cleanUsername },
  })
  if (existingPengawas) {
    return { success: false, error: "Username sudah digunakan oleh pengawas lain." }
  }

  const existingStudent = await prisma.student.findUnique({
    where: { username: cleanUsername },
  })
  if (existingStudent) {
    return { success: false, error: "Username sudah terdaftar sebagai adik asuh." }
  }

  try {
    const bcrypt = await import("bcryptjs")
    const hashedPassword = await bcrypt.hash(rawPassword, 12)

    await prisma.pengawas.create({
      data: {
        name: cleanName,
        username: cleanUsername,
        password: hashedPassword,
        wilayah: cleanWilayah,
        noHp: cleanNoHp || null,
        status: "aktif",
      },
    })

    revalidatePath("/admin/dashboard/kontrol-status")
    revalidatePath("/admin/dashboard/alokasi-dana")
    revalidatePath("/admin/dashboard/data-anak-asuh")
    revalidatePath("/daftar")

    return { success: true }
  } catch (error) {
    console.error("[createPengawasAction Error]", error)
    return { success: false, error: "Gagal membuat akun pengawas baru." }
  }
}

/**
 * Menambahkan wilayah operasional baru
 */
export async function createRegionAction(
  name: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Akses ditolak. Anda bukan Administrator." }
  }

  const cleanName = (name || "").trim()
  if (!cleanName) {
    return { success: false, error: "Nama wilayah wajib diisi." }
  }

  try {
    const existing = await prisma.region.findFirst({
      where: {
        name: { equals: cleanName, mode: "insensitive" },
      },
    })
    if (existing) {
      return { success: false, error: `Wilayah "${cleanName}" sudah terdaftar.` }
    }

    await prisma.region.create({
      data: { name: cleanName },
    })

    revalidatePath("/admin/dashboard/kontrol-status")
    revalidatePath("/admin/dashboard/alokasi-dana")
    revalidatePath("/admin/dashboard/data-anak-asuh")
    revalidatePath("/daftar")

    return { success: true }
  } catch (error) {
    console.error("[createRegionAction Error]", error)
    return { success: false, error: "Gagal menambahkan wilayah baru." }
  }
}

/**
 * Menghapus akun pengawas yang berstatus nonaktif
 */
export async function deletePengawasAction(
  id: number
): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Akses ditolak. Anda bukan Administrator." }
  }

  try {
    const pengawas = await prisma.pengawas.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            students: true,
            disbursements: true,
          },
        },
      },
    })

    if (!pengawas) {
      return { success: false, error: "Pengawas tidak ditemukan." }
    }

    if (pengawas.status !== "nonaktif") {
      return {
        success: false,
        error: "Hanya akun pengawas yang berstatus nonaktif yang dapat dihapus. Silakan nonaktifkan akun terlebih dahulu.",
      }
    }

    if (pengawas._count.students > 0) {
      return {
        success: false,
        error: `Pengawas "${pengawas.name}" masih memiliki ${pengawas._count.students} adik asuh binaan. Silakan pindahkan adik asuh binaan ke pengawas lain sebelum menghapus akun ini.`,
      }
    }

    if (pengawas._count.disbursements > 0) {
      return {
        success: false,
        error: `Pengawas "${pengawas.name}" memiliki ${pengawas._count.disbursements} riwayat bukti penyaluran dana. Akun tidak dapat dihapus demi integritas data audit keuangan.`,
      }
    }

    // Bersihkan relasi opsional jika ada
    await prisma.adminNote.updateMany({
      where: { pengawasId: id },
      data: { pengawasId: null },
    })
    await prisma.visitLog.updateMany({
      where: { pengawasId: id },
      data: { pengawasId: null },
    })

    await prisma.pengawas.delete({
      where: { id },
    })

    revalidatePath("/admin/dashboard/kontrol-status")
    revalidatePath("/admin/dashboard/alokasi-dana")
    revalidatePath("/admin/dashboard/data-anak-asuh")
    revalidatePath("/daftar")

    return { success: true }
  } catch (error) {
    console.error("[deletePengawasAction Error]", error)
    return { success: false, error: "Gagal menghapus akun pengawas." }
  }
}

/**
 * Menghapus wilayah (jika daerah/wilayah tidak memiliki pengawas)
 */
export async function deleteRegionAction(
  id: number
): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Akses ditolak. Anda bukan Administrator." }
  }

  try {
    const region = await prisma.region.findUnique({
      where: { id },
    })
    if (!region) {
      return { success: false, error: "Wilayah tidak ditemukan." }
    }

    // Cek apakah masih ada pengawas di wilayah ini
    const pengawasCount = await prisma.pengawas.count({
      where: { wilayah: region.name },
    })

    if (pengawasCount > 0) {
      return {
        success: false,
        error: `Wilayah "${region.name}" tidak dapat dihapus karena masih memiliki ${pengawasCount} pengawas yang bertugas. Pindahkan atau hapus pengawas di wilayah ini terlebih dahulu.`,
      }
    }

    await prisma.region.delete({
      where: { id },
    })

    revalidatePath("/admin/dashboard/kontrol-status")
    revalidatePath("/admin/dashboard/alokasi-dana")
    revalidatePath("/admin/dashboard/data-anak-asuh")
    revalidatePath("/daftar")

    return { success: true }
  } catch (error) {
    console.error("[deleteRegionAction Error]", error)
    return { success: false, error: "Gagal menghapus wilayah." }
  }
}


