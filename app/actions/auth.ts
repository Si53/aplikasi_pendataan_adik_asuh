"use server"

import { prisma } from "@/lib/prisma"
import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { getClientIp } from "@/lib/ip"

export type LoginState = { error?: string }

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const identifier = String(formData.get("identifier") ?? "").trim()
  if (!identifier) return { error: "Silakan isi username atau NIK kamu terlebih dahulu." }

  // 1 & 2. Cek rate limit IP Address dalam 15 menit terakhir
  const ipAddress = await getClientIp()
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)

  const recentFailedAttempts = await prisma.loginAttempt.count({
    where: {
      ipAddress,
      createdAt: { gte: fifteenMinutesAgo },
    },
  })

  // 3. Jika sudah mencapai 7 percobaan gagal atau lebih, tolak login
  if (recentFailedAttempts >= 7) {
    return {
      error: "Terlalu banyak percobaan dari perangkat ini. Coba lagi dalam beberapa menit.",
    }
  }

  // 4. Proses pencarian Student berdasarkan identifier
  const student = await prisma.student.findFirst({
    where: {
      OR: [{ username: identifier }, { nik: identifier }],
    },
  })

  // Setiap kali identifier TIDAK DITEMUKAN, catat 1 record ke login_attempts
  if (!student) {
    await prisma.loginAttempt.create({
      data: { ipAddress },
    })
    const attemptCount = recentFailedAttempts + 1
    if (attemptCount >= 7) {
      return {
        error: "Username atau NIK tidak ditemukan. Batas percobaan gagal tercapai (7/7). Coba lagi dalam 15 menit.",
      }
    }
    return {
      error: `Username atau NIK belum terdaftar. Yuk daftar dulu. (Percobaan ke-${attemptCount} dari 7)`,
    }
  }

  // 5. JIKA identifier DITEMUKAN, tidak perlu mencatat LoginAttempt
  if (student.status === "pending") {
    redirect(
      `/daftar/sukses?name=${encodeURIComponent(student.fullName)}&username=${encodeURIComponent(student.username)}`
    )
  }

  if (student.status === "perlu_revisi") {
    redirect(
      `/cek-status?identifier=${encodeURIComponent(student.username)}`
    )
  }

  if (student.status === "rejected") {
    return {
      error: "Pendaftaran kamu belum bisa diterima. Silakan hubungi Kakak Asuh atau Pengawas untuk informasi lebih lanjut.",
    }
  }

  if (student.status === "nonaktif") {
    return {
      error: "Akun kamu sedang dinonaktifkan. Silakan hubungi Kakak Asuh atau Pengawas.",
    }
  }

  if (student.status === "alumni") {
    return {
      error: "Akun kamu telah terdaftar sebagai Alumni program Adik Asuh. Silakan hubungi Pengawas untuk informasi lebih lanjut.",
    }
  }

  try {
    await signIn("credentials-student", {
      identifier,
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      const causeMessage =
        (error.cause as any)?.err?.message ||
        (error.cause as any)?.message ||
        (error as any).message ||
        ""
      if (causeMessage.includes("Terlalu banyak percobaan")) {
        return { error: causeMessage }
      }
      return { error: "Gagal masuk. Silakan periksa kembali data kamu." }
    }
    const errString = String(error)
    if (errString.includes("Terlalu banyak percobaan")) {
      return { error: errString.replace(/^Error:\s*/, "") }
    }
    throw error
  }
  return {}
}

export async function loginPengawasAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim()
  const password = String(formData.get("password") ?? "").trim()
  if (!username || !password) return { error: "Silakan isi username dan password pengawas." }

  try {
    await signIn("credentials-pengawas", {
      username,
      password,
      redirectTo: "/pengawas",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      const causeMessage =
        (error.cause as any)?.err?.message ||
        (error.cause as any)?.message ||
        (error as any).message ||
        ""
      if (causeMessage.includes("dinonaktifkan")) {
        return { error: "Akun Anda sedang dinonaktifkan, silakan hubungi Admin" }
      }
      if (causeMessage.includes("Terlalu banyak percobaan gagal")) {
        return { error: causeMessage }
      }
      return { error: "Username atau password pengawas salah." }
    }
    const errString = String(error)
    if (errString.includes("dinonaktifkan")) {
      return { error: "Akun Anda sedang dinonaktifkan, silakan hubungi Admin" }
    }
    if (errString.includes("Terlalu banyak percobaan gagal")) {
      return { error: errString.replace(/^Error:\s*/, "") }
    }
    throw error
  }
  return {}
}

export type CheckStatusResult = {
  found: boolean
  status?: string
  student?: {
    id: number
    fullName: string
    username: string
    wilayah: string
    schoolName: string
    createdAt: Date
    revisionNote?: string | null
  }
  error?: string
}

export async function checkRegistrationStatusAction(identifier: string): Promise<CheckStatusResult> {
  const clean = String(identifier ?? "").trim()
  if (!clean) {
    return { found: false, error: "Silakan masukkan username atau NIK kamu." }
  }

  const student = await prisma.student.findFirst({
    where: {
      OR: [
        { username: clean },
        { nik: clean },
      ],
    },
    select: {
      id: true,
      fullName: true,
      username: true,
      status: true,
      wilayah: true,
      schoolName: true,
      createdAt: true,
      adminNotes: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          note: true,
          createdAt: true,
        },
      },
    },
  })

  if (!student) {
    return {
      found: false,
      error: "Username/NIK tidak ditemukan. Pastikan kamu sudah mendaftar, atau coba periksa kembali penulisannya.",
    }
  }

  const latestNote = student.adminNotes?.[0]?.note || null

  return {
    found: true,
    status: student.status,
    student: {
      id: student.id,
      fullName: student.fullName,
      username: student.username,
      wilayah: student.wilayah,
      schoolName: student.schoolName,
      createdAt: student.createdAt,
      revisionNote: latestNote,
    },
  }
}

export async function loginAdminGoogleAction() {
  await signIn("google", {
    redirectTo: "/admin/dashboard",
  })
}

export async function logoutAction() {
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()
  for (const c of allCookies) {
    if (
      c.name.includes("authjs") ||
      c.name.includes("next-auth") ||
      c.name.includes("adik_asuh") ||
      c.name.includes("session")
    ) {
      cookieStore.delete(c.name)
    }
  }
  try {
    await signOut({ redirect: false })
  } catch {
    // ignore
  }
  redirect("/login")
}

export async function logoutAdminAction() {
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()
  for (const c of allCookies) {
    if (
      c.name.includes("authjs") ||
      c.name.includes("next-auth") ||
      c.name.includes("adik_asuh") ||
      c.name.includes("session")
    ) {
      cookieStore.delete(c.name)
    }
  }
  try {
    await signOut({ redirect: false })
  } catch {
    // ignore
  }
  redirect("/admin/login")
}

type FamilyInput = {
  name: string
  status: string
  occupation: string
  incomePerMonth: string
  address: string
  phone: string
  medicalHistory: string
}

export type RegisterState = { error?: string }
export type EducationCostInput = { label: string; amount: number }
export type RegisterPayload = {
  username: string
  nik: string
  fullName: string
  dateOfBirth: string
  gender: string
  citaCita: string
  wilayah: string
  pengawasName?: string
  pengawasId?: number
  alamatLengkap: string
  noHp: string
  riwayatPenyakit: string
  schoolName: string
  jenjang?: string | null
  gradeLevel: string
  nilaiRataRata: string
  jumlahSaudara: number
  educationCosts: EducationCostInput[]
  documents?: { type: string; fileUrl: string }[]
  father: FamilyInput
  mother: FamilyInput
  guardian: FamilyInput
}

function hasFamilyData(f: FamilyInput) {
  return Boolean(f.name.trim() || f.occupation.trim() || f.medicalHistory.trim())
}

export async function registerAction(payload: RegisterPayload): Promise<RegisterState> {
  const required = [
    payload.username,
    payload.nik,
    payload.fullName,
    payload.dateOfBirth,
    payload.gender,
    payload.wilayah,
    payload.schoolName,
    payload.gradeLevel,
  ]
  if (required.some((value) => !String(value).trim())) return { error: "Beberapa data wajib belum lengkap." }
  if (!/^\d{16}$/.test(payload.nik.trim())) return { error: "NIK harus terdiri dari 16 angka." }

  const existing = await prisma.student.findFirst({
    where: {
      OR: [{ username: payload.username.trim() }, { nik: payload.nik.trim() }],
    },
  })
  if (existing) return { error: "Username atau NIK sudah terdaftar." }

  let pengawas = null
  if (payload.pengawasId) {
    pengawas = await prisma.pengawas.findUnique({ where: { id: payload.pengawasId } })
  } else if (payload.pengawasName) {
    pengawas = await prisma.pengawas.findFirst({
      where: {
        name: payload.pengawasName.trim(),
        wilayah: payload.wilayah.trim(),
      },
    })
  }

  if (!pengawas) {
    pengawas = await prisma.pengawas.findFirst({
      where: { wilayah: payload.wilayah.trim() },
    })
  }
  if (!pengawas) return { error: "Wilayah belum memiliki Pengawas." }

  const createdStudent = await prisma.student.create({
    data: {
      username: payload.username.trim(),
      nik: payload.nik.trim(),
      fullName: payload.fullName.trim(),
      dateOfBirth: new Date(payload.dateOfBirth),
      gender: payload.gender,
      citaCita: payload.citaCita.trim(),
      wilayah: payload.wilayah.trim(),
      pengawasId: pengawas.id,
      alamatLengkap: payload.alamatLengkap.trim(),
      noHp: payload.noHp.trim(),
      riwayatPenyakit: payload.riwayatPenyakit.trim() || "-",
      schoolName: payload.schoolName.trim(),
      jenjang: payload.jenjang ? payload.jenjang.trim() : null,
      gradeLevel: payload.gradeLevel.trim(),
      nilaiRataRata: payload.nilaiRataRata.trim(),
      jumlahSaudara: Number.isFinite(payload.jumlahSaudara) ? payload.jumlahSaudara : 0,
      educationCosts: {
        create: payload.educationCosts.filter((item) => item.label.trim() && item.amount > 0),
      },
      father: {
        create: { ...payload.father, name: payload.father.name.trim(), status: payload.father.status || "Sehat" },
      },
      mother: {
        create: { ...payload.mother, name: payload.mother.name.trim(), status: payload.mother.status || "Sehat" },
      },
      ...(hasFamilyData(payload.guardian)
        ? {
            guardian: {
              create: {
                ...payload.guardian,
                name: payload.guardian.name.trim(),
                status: payload.guardian.status || "Sehat",
              },
            },
          }
        : {}),
      ...(payload.documents && payload.documents.length > 0
        ? {
            documents: {
              create: payload.documents.map((doc) => ({
                type: doc.type,
                fileUrl: doc.fileUrl,
              })),
            },
          }
        : {}),
    },
  })

  return {}
}

export type UpdateRegisterPayload = RegisterPayload & {
  studentId?: number
  originalIdentifier?: string
}

export async function updateStudentRegistrationAction(
  payload: UpdateRegisterPayload
): Promise<RegisterState> {
  const required = [
    payload.username,
    payload.nik,
    payload.fullName,
    payload.dateOfBirth,
    payload.gender,
    payload.wilayah,
    payload.schoolName,
    payload.gradeLevel,
  ]
  if (required.some((value) => !String(value).trim())) return { error: "Beberapa data wajib belum lengkap." }
  if (!/^\d{16}$/.test(payload.nik.trim())) return { error: "NIK harus terdiri dari 16 angka." }

  // 1. Cari student yang mau diupdate
  const existing = await prisma.student.findFirst({
    where: {
      OR: [
        ...(payload.studentId ? [{ id: payload.studentId }] : []),
        ...(payload.originalIdentifier
          ? [{ username: payload.originalIdentifier.trim() }, { nik: payload.originalIdentifier.trim() }]
          : [{ username: payload.username.trim() }, { nik: payload.nik.trim() }]),
      ],
    },
  })

  if (!existing) {
    return { error: "Data pendaftaran tidak ditemukan." }
  }

  if (existing.status !== "perlu_revisi") {
    return { error: "Pendaftaran ini tidak dalam status perlu revisi." }
  }

  // 2. Jika username atau NIK diganti, cek duplikat dengan akun siswa lain
  if (payload.username.trim() !== existing.username || payload.nik.trim() !== existing.nik) {
    const duplicate = await prisma.student.findFirst({
      where: {
        id: { not: existing.id },
        OR: [{ username: payload.username.trim() }, { nik: payload.nik.trim() }],
      },
    })
    if (duplicate) {
      return { error: "Username atau NIK baru sudah digunakan oleh akun lain." }
    }
  }

  // 3. Tentukan pengawas
  let pengawas = null
  if (payload.pengawasId) {
    pengawas = await prisma.pengawas.findUnique({ where: { id: payload.pengawasId } })
  } else if (payload.pengawasName) {
    pengawas = await prisma.pengawas.findFirst({
      where: {
        name: payload.pengawasName.trim(),
        wilayah: payload.wilayah.trim(),
      },
    })
  }

  if (!pengawas) {
    pengawas = await prisma.pengawas.findFirst({
      where: { wilayah: payload.wilayah.trim() },
    })
  }
  if (!pengawas) return { error: "Wilayah belum memiliki Pengawas." }

  // 4. Update dalam transaction: Student, Father, Mother, Guardian, EducationCost, Documents
  await prisma.$transaction(async (tx) => {
    // Update student & reset status to pending
    await tx.student.update({
      where: { id: existing.id },
      data: {
        username: payload.username.trim(),
        nik: payload.nik.trim(),
        fullName: payload.fullName.trim(),
        dateOfBirth: new Date(payload.dateOfBirth),
        gender: payload.gender,
        citaCita: payload.citaCita.trim(),
        wilayah: payload.wilayah.trim(),
        pengawasId: pengawas.id,
        alamatLengkap: payload.alamatLengkap.trim(),
        noHp: payload.noHp.trim(),
        riwayatPenyakit: payload.riwayatPenyakit.trim() || "-",
        schoolName: payload.schoolName.trim(),
        jenjang: payload.jenjang ? payload.jenjang.trim() : null,
        gradeLevel: payload.gradeLevel.trim(),
        nilaiRataRata: payload.nilaiRataRata.trim(),
        jumlahSaudara: Number.isFinite(payload.jumlahSaudara) ? payload.jumlahSaudara : 0,
        status: "pending",
      },
    })

    // Upsert father
    await tx.father.upsert({
      where: { studentId: existing.id },
      create: {
        studentId: existing.id,
        name: payload.father.name.trim(),
        status: payload.father.status || "Sehat",
        occupation: payload.father.occupation.trim() || "-",
        incomePerMonth: payload.father.incomePerMonth.trim() || "-",
        address: payload.father.address.trim() || "-",
        phone: payload.father.phone.trim() || "-",
        medicalHistory: payload.father.medicalHistory.trim() || "-",
      },
      update: {
        name: payload.father.name.trim(),
        status: payload.father.status || "Sehat",
        occupation: payload.father.occupation.trim() || "-",
        incomePerMonth: payload.father.incomePerMonth.trim() || "-",
        address: payload.father.address.trim() || "-",
        phone: payload.father.phone.trim() || "-",
        medicalHistory: payload.father.medicalHistory.trim() || "-",
      },
    })

    // Upsert mother
    await tx.mother.upsert({
      where: { studentId: existing.id },
      create: {
        studentId: existing.id,
        name: payload.mother.name.trim(),
        status: payload.mother.status || "Sehat",
        occupation: payload.mother.occupation.trim() || "-",
        incomePerMonth: payload.mother.incomePerMonth.trim() || "-",
        address: payload.mother.address.trim() || "-",
        phone: payload.mother.phone.trim() || "-",
        medicalHistory: payload.mother.medicalHistory.trim() || "-",
      },
      update: {
        name: payload.mother.name.trim(),
        status: payload.mother.status || "Sehat",
        occupation: payload.mother.occupation.trim() || "-",
        incomePerMonth: payload.mother.incomePerMonth.trim() || "-",
        address: payload.mother.address.trim() || "-",
        phone: payload.mother.phone.trim() || "-",
        medicalHistory: payload.mother.medicalHistory.trim() || "-",
      },
    })

    // Upsert or delete guardian
    if (hasFamilyData(payload.guardian)) {
      await tx.guardian.upsert({
        where: { studentId: existing.id },
        create: {
          studentId: existing.id,
          name: payload.guardian.name.trim(),
          status: payload.guardian.status || "Sehat",
          occupation: payload.guardian.occupation.trim() || "-",
          incomePerMonth: payload.guardian.incomePerMonth.trim() || "-",
          address: payload.guardian.address.trim() || "-",
          phone: payload.guardian.phone.trim() || "-",
          medicalHistory: payload.guardian.medicalHistory.trim() || "-",
        },
        update: {
          name: payload.guardian.name.trim(),
          status: payload.guardian.status || "Sehat",
          occupation: payload.guardian.occupation.trim() || "-",
          incomePerMonth: payload.guardian.incomePerMonth.trim() || "-",
          address: payload.guardian.address.trim() || "-",
          phone: payload.guardian.phone.trim() || "-",
          medicalHistory: payload.guardian.medicalHistory.trim() || "-",
        },
      })
    } else {
      await tx.guardian.deleteMany({
        where: { studentId: existing.id },
      })
    }

    // Replace education costs
    await tx.educationCost.deleteMany({
      where: { studentId: existing.id },
    })
    const validCosts = payload.educationCosts.filter((item) => item.label.trim() && item.amount > 0)
    if (validCosts.length > 0) {
      await tx.educationCost.createMany({
        data: validCosts.map((item) => ({
          studentId: existing.id,
          label: item.label.trim(),
          amount: item.amount,
        })),
      })
    }

    // Replace documents if provided
    if (payload.documents && payload.documents.length > 0) {
      await tx.document.deleteMany({
        where: { studentId: existing.id },
      })
      await tx.document.createMany({
        data: payload.documents.map((doc) => ({
          studentId: existing.id,
          type: doc.type,
          fileUrl: doc.fileUrl,
        })),
      })
    }
  })

  revalidatePath("/cek-status")
  revalidatePath("/admin/kontrol-status")
  revalidatePath("/admin/dashboard")

  return {}
}
