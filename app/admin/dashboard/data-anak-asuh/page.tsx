import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import {
  Users,
  GraduationCap,
  AlertCircle,
  UserCheck,
  Sparkles,
} from "lucide-react"
import { AdminStudentTable, StudentTableItem } from "@/components/admin-student-table"
import { AdminDataHeaderActions } from "@/components/admin-data-header-actions"

export const dynamic = "force-dynamic"

export default async function DataAnakAsuhPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  // 1. Fetch Real Database Statistics
  const [totalStudents, activeStudents, needsAttentionCount, totalPengawas, studentsRaw] =
    await Promise.all([
      prisma.student.count().catch(() => 0),
      prisma.student
        .count({
          where: { status: "approved" },
        })
        .catch(() => 0),
      prisma.student
        .count({
          where: {
            academicUpdates: {
              none: {},
            },
          },
        })
        .catch(() => 0),
      prisma.pengawas.count().catch(() => 0),
      prisma.student.findMany({
        include: {
          pengawas: {
            select: {
              id: true,
              name: true,
              wilayah: true,
            },
          },
          academicUpdates: {
            orderBy: {
              tanggalInput: "desc",
            },
            take: 1,
            select: {
              id: true,
              nilaiRataRata: true,
              kelasSaatItu: true,
              tanggalInput: true,
            },
          },
        },
        orderBy: {
          id: "desc",
        },
      }),
    ])

  // 2. Extract Unique Wilayah List
  const wilayahSet = new Set<string>()
  ;["Pati", "Jepara", "Ampel", "Wonosobo", "Sukabumi", "Bandung"].forEach((w) =>
    wilayahSet.add(w)
  )
  studentsRaw.forEach((s) => {
    if (s.wilayah) wilayahSet.add(s.wilayah)
  })
  const wilayahList = Array.from(wilayahSet).sort()

  // 3. Format Data for the Table
  const tableData: StudentTableItem[] = studentsRaw.map((s) => {
    const latestAcademic = s.academicUpdates?.[0]
    const hasUpdate = Boolean(latestAcademic)
    const displayNilai = latestAcademic?.nilaiRataRata || s.nilaiRataRata || "-"

    return {
      id: s.id,
      username: s.username,
      nik: s.nik,
      fullName: s.fullName,
      schoolName: s.schoolName,
      gradeLevel: s.gradeLevel,
      wilayah: s.wilayah,
      status: s.status,
      initialNilai: s.nilaiRataRata,
      latestNilai: displayNilai,
      hasAcademicUpdate: hasUpdate,
      latestAcademicDate: latestAcademic?.tanggalInput
        ? latestAcademic.tanggalInput.toISOString()
        : null,
      pengawasName: s.pengawas?.name || "Belum Ditugaskan",
      createdAt: s.createdAt.toISOString(),
    }
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-700">
              <Sparkles className="size-3 text-orange-600" />
              AKSES HOLISTIK
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Data Anak Asuh
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl">
            Kelola, pantau perkembangan akademis, dan verifikasi status anak
            asuh secara holistik di seluruh wilayah.
          </p>
        </div>

        <AdminDataHeaderActions />
      </div>

      {/* 2. 4 Real Database Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Anak Asuh */}
        <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs transition hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Total Anak Asuh
            </span>
            <div className="flex size-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <Users className="size-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-stone-900">
              {totalStudents}
            </span>
            <span className="text-xs text-stone-400">Anak terdaftar</span>
          </div>
          <p className="mt-1 text-[11px] text-stone-500">
            Database seluruh calon & penerima beasiswa
          </p>
        </div>

        {/* Card 2: Aktif Beasiswa */}
        <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs transition hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Aktif Beasiswa
            </span>
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <GraduationCap className="size-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-stone-900">
              {activeStudents}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              Approved
            </span>
          </div>
          <p className="mt-1 text-[11px] text-stone-500">
            Anak asuh aktif menerima alokasi beasiswa
          </p>
        </div>

        {/* Card 3: Perlu Perhatian */}
        <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs transition hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Perlu Perhatian
            </span>
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <AlertCircle className="size-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-stone-900">
              {needsAttentionCount}
            </span>
            <span className="text-xs font-semibold text-amber-600">
              Belum Rapor
            </span>
          </div>
          <p className="mt-1 text-[11px] text-stone-500">
            Belum pernah ada riwayat update rapor
          </p>
        </div>

        {/* Card 4: Pengawas Aktif */}
        <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs transition hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Pengawas Aktif
            </span>
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <UserCheck className="size-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-stone-900">
              {totalPengawas}
            </span>
            <span className="text-xs text-stone-400">Pengawas</span>
          </div>
          <p className="mt-1 text-[11px] text-stone-500">
            Penanggung jawab lapangan terdaftar
          </p>
        </div>
      </div>

      {/* 3. Search, Filter & Interactive Table */}
      <AdminStudentTable students={tableData} wilayahList={wilayahList} />
    </div>
  )
}
