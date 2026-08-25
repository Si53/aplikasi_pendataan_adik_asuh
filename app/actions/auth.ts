"use server"

import { prisma } from "@/lib/prisma"
import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export type LoginState = { error?: string }

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const identifier = String(formData.get("identifier") ?? "").trim()
  if (!identifier) return { error: "Silakan isi username atau NIK kamu terlebih dahulu." }

  try {
    await signIn("credentials-student", {
      identifier,
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Username atau NIK belum terdaftar. Yuk daftar dulu." }
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
      return { error: "Username atau password pengawas salah." }
    }
    throw error
  }
  return {}
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
