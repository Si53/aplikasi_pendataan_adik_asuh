import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import {
  AdminKontrolStatusView,
  type StudentStatusItem,
  type PengawasStatusItem,
} from "@/components/admin-kontrol-status-view"

export const dynamic = "force-dynamic"

export default async function KontrolStatusDashboardPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  // 1. Fetch data Adik Asuh dan Pengawas Lapangan secara paralel
  const [studentsRaw, pengawasRaw] = await Promise.all([
    prisma.student.findMany({
      include: {
        pengawas: {
          select: {
            id: true,
            name: true,
            wilayah: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.pengawas.findMany({
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    }),
  ])

  // 2. Format Data Adik Asuh
  const students: StudentStatusItem[] = studentsRaw.map((st) => ({
    id: st.id,
    username: st.username,
    nik: st.nik,
    fullName: st.fullName,
    schoolName: st.schoolName,
    gradeLevel: st.gradeLevel,
    wilayah: st.wilayah,
    createdAt: st.createdAt.toISOString(),
    status: st.status,
    pengawasName: st.pengawas?.name || "Belum Ditugaskan",
  }))

  // 3. Format Data Pengawas
  const pengawas: PengawasStatusItem[] = pengawasRaw.map((p) => ({
    id: p.id,
    username: p.username,
    name: p.name,
    wilayah: p.wilayah,
    noHp: p.noHp,
    status: p.status,
    totalBinaanCount: p._count.students,
  }))

  // 4. Ekstrak Daftar Wilayah Unik
  const wilayahSet = new Set<string>()
  ;["Pati", "Jepara", "Ampel", "Wonosobo", "Sukabumi", "Bandung"].forEach((w) =>
    wilayahSet.add(w)
  )
  studentsRaw.forEach((s) => {
    if (s.wilayah) wilayahSet.add(s.wilayah)
  })
  pengawasRaw.forEach((p) => {
    if (p.wilayah) wilayahSet.add(p.wilayah)
  })
  const wilayahList = Array.from(wilayahSet).sort()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <AdminKontrolStatusView
        students={students}
        pengawas={pengawas}
        wilayahList={wilayahList}
      />
    </div>
  )
}
