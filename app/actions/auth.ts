"use server"

import { prisma } from "@/lib/prisma"
import { setSession, clearSession } from "@/lib/session"
import { redirect } from "next/navigation"

export type LoginState = { error?: string }

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim()

  if (!username) {
    return { error: "Silakan isi username kamu terlebih dahulu." }
  }

  const student = await prisma.student.findUnique({ where: { username } })

  if (!student) {
    return {
      error: `Username "${username}" belum terdaftar. Yuk daftar dulu dengan menekan tombol Daftar.`,
    }
  }

  await setSession(student.username)
  redirect("/dashboard")
}

export async function logoutAction() {
  await clearSession()
  redirect("/")
}

type FamilyInput = {
  name: string
  status: string
  occupation: string
  medicalHistory: string
}

export type RegisterState = { error?: string }

export type RegisterPayload = {
  username: string
  fullName: string
  dateOfBirth: string
  gender: string
  city: string
  medicalHistory: string
  schoolName: string
  grade: string
  tuitionCost: string
  father: FamilyInput
  mother: FamilyInput
  guardian: FamilyInput
}

function hasFamilyData(f: FamilyInput) {
  return Boolean(f.name.trim() || f.occupation.trim() || f.medicalHistory.trim())
}

export async function registerAction(payload: RegisterPayload): Promise<RegisterState> {
  const username = payload.username.trim()

  if (!username || !payload.fullName.trim() || !payload.dateOfBirth || !payload.gender) {
    return { error: "Beberapa data wajib belum lengkap. Silakan periksa kembali." }
  }

  const existing = await prisma.student.findUnique({ where: { username } })
  if (existing) {
    return { error: `Username "${username}" sudah dipakai. Silakan pilih username lain.` }
  }

  await prisma.student.create({
    data: {
      username,
      fullName: payload.fullName.trim(),
      dateOfBirth: new Date(payload.dateOfBirth),
      gender: payload.gender,
      city: payload.city.trim(),
      medicalHistory: payload.medicalHistory.trim() || "-",
      schoolName: payload.schoolName.trim(),
      grade: payload.grade.trim(),
      tuitionCost: payload.tuitionCost.trim(),
      status: "active",
      father: {
        create: {
          name: payload.father.name.trim(),
          status: payload.father.status || "Hidup",
          occupation: payload.father.occupation.trim(),
          medicalHistory: payload.father.medicalHistory.trim(),
        },
      },
      mother: {
        create: {
          name: payload.mother.name.trim(),
          status: payload.mother.status || "Hidup",
          occupation: payload.mother.occupation.trim(),
          medicalHistory: payload.mother.medicalHistory.trim(),
        },
      },
      ...(hasFamilyData(payload.guardian)
        ? {
            guardian: {
              create: {
                name: payload.guardian.name.trim(),
                status: payload.guardian.status || "Hidup",
                occupation: payload.guardian.occupation.trim(),
                medicalHistory: payload.guardian.medicalHistory.trim(),
              },
            },
          }
        : {}),
    },
  })

  return {}
}
