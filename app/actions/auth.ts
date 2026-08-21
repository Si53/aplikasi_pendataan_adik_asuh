"use server"

import { prisma } from "@/lib/prisma"
import { clearSession, setSession } from "@/lib/session"
import { redirect } from "next/navigation"

export type LoginState = { error?: string }

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim()
  if (!username) return { error: "Silakan isi username kamu terlebih dahulu." }
  const student = await prisma.student.findUnique({ where: { username } })
  if (!student) return { error: `Username "${username}" belum terdaftar. Yuk daftar dulu.` }
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
  alamatLengkap: string
  noHp: string
  riwayatPenyakit: string
  schoolName: string
  gradeLevel: string
  nilaiRataRata: string
  jumlahSaudara: number
  educationCosts: EducationCostInput[]
  father: FamilyInput
  mother: FamilyInput
  guardian: FamilyInput
}

function hasFamilyData(f: FamilyInput) {
  return Boolean(f.name.trim() || f.occupation.trim() || f.medicalHistory.trim())
}

export async function registerAction(payload: RegisterPayload): Promise<RegisterState> {
  const required = [payload.username, payload.nik, payload.fullName, payload.dateOfBirth, payload.gender, payload.wilayah, payload.schoolName, payload.gradeLevel]
  if (required.some((value) => !String(value).trim())) return { error: "Beberapa data wajib belum lengkap." }
  if (!/^\d{16}$/.test(payload.nik.trim())) return { error: "NIK harus terdiri dari 16 angka." }

  const existing = await prisma.student.findFirst({ where: { OR: [{ username: payload.username.trim() }, { nik: payload.nik.trim() }] } })
  if (existing) return { error: "Username atau NIK sudah terdaftar." }

  const pengawas = await prisma.pengawas.findFirst({ where: { wilayah: payload.wilayah.trim() } })
  if (!pengawas) return { error: "Wilayah belum memiliki Pengawas." }

  await prisma.student.create({
    data: {
      username: payload.username.trim(), nik: payload.nik.trim(), fullName: payload.fullName.trim(),
      dateOfBirth: new Date(payload.dateOfBirth), gender: payload.gender, citaCita: payload.citaCita.trim(),
      wilayah: payload.wilayah.trim(), pengawasId: pengawas.id, alamatLengkap: payload.alamatLengkap.trim(),
      noHp: payload.noHp.trim(), riwayatPenyakit: payload.riwayatPenyakit.trim() || "-",
      schoolName: payload.schoolName.trim(), gradeLevel: payload.gradeLevel.trim(), nilaiRataRata: payload.nilaiRataRata.trim(),
      jumlahSaudara: Number.isFinite(payload.jumlahSaudara) ? payload.jumlahSaudara : 0,
      educationCosts: { create: payload.educationCosts.filter((item) => item.label.trim() && item.amount > 0) },
      father: { create: { ...payload.father, name: payload.father.name.trim(), status: payload.father.status || "Sehat" } },
      mother: { create: { ...payload.mother, name: payload.mother.name.trim(), status: payload.mother.status || "Sehat" } },
      ...(hasFamilyData(payload.guardian) ? { guardian: { create: { ...payload.guardian, name: payload.guardian.name.trim(), status: payload.guardian.status || "Sehat" } } } : {}),
    },
  })
  return {}
}
