"use server"

import { prisma } from "@/lib/prisma"
import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

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
    fullName: string
    username: string
    wilayah: string
    schoolName: string
    createdAt: Date
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
      fullName: true,
      username: true,
      status: true,
      wilayah: true,
      schoolName: true,
      createdAt: true,
    },
  })

  if (!student) {
    return {
      found: false,
      error: "Username/NIK tidak ditemukan. Pastikan kamu sudah mendaftar, atau coba periksa kembali penulisannya.",
    }
  }

  return {
    found: true,
    status: student.status,
    student: {
      fullName: student.fullName,
      username: student.username,
      wilayah: student.wilayah,
      schoolName: student.schoolName,
      createdAt: student.createdAt,
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
