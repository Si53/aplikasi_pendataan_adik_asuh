import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import {
  AdminDashboardOverview,
  type WilayahDistributionItem,
  type QuickAuditPendingItem,
} from "@/components/admin-dashboard-overview"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  const adminName = session.user.name || "Administrator"

  // 1. Fetch seluruh data analitik dashboard secara paralel
  const [
    allStudentsRaw,
    allPengawasRaw,
    pendingAuditCount,
    pendingProofsRaw,
    allVerifiedDisbursementsRaw,
  ] = await Promise.all([
    // Ambil seluruh siswa dengan update akademik terbaru
    prisma.student.findMany({
      include: {
        academicUpdates: {
          orderBy: { tanggalInput: "desc" },
          take: 1,
          select: {
            nilaiRataRata: true,
            tanggalInput: true,
          },
        },
      },
    }),

    // Ambil seluruh pengawas
    prisma.pengawas.findMany({
      select: {
        id: true,
        name: true,
        wilayah: true,
        status: true,
      },
    }),

    // Hitung total bukti pending
    prisma.disbursementProof.count({
      where: { status: "pending" },
    }),

    // Ambil 3 berkas pending terbaru untuk widget Audit Cepat
    prisma.disbursementProof.findMany({
      where: { status: "pending" },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            schoolName: true,
            wilayah: true,
          },
        },
        pengawas: {
          select: {
            id: true,
            name: true,
            wilayah: true,
          },
        },
      },
      orderBy: { tanggal: "desc" },
      take: 3,
    }),

    // Ambil seluruh nominal bukti terverifikasi beserta wilayah siswa
    prisma.disbursementProof.findMany({
      where: { status: "verified" },
      select: {
        nominal: true,
        student: {
          select: {
            wilayah: true,
          },
        },
      },
    }),
  ])

  // 2. Hitung 4 Kartu Statistik Utama
  const totalStudents = allStudentsRaw.length
  const approvedStudents = allStudentsRaw.filter((s) => s.status === "approved").length
  const pendingStudents = allStudentsRaw.filter((s) => s.status === "pending").length
  const activePercentage =
    totalStudents > 0 ? Math.round((approvedStudents / totalStudents) * 100) : 0

  const totalPengawas = allPengawasRaw.length

  const distinctWilayahSet = new Set<string>()
  allPengawasRaw.forEach((p) => {
    if (p.wilayah) distinctWilayahSet.add(p.wilayah.trim())
  })
  allStudentsRaw.forEach((s) => {
    if (s.wilayah) distinctWilayahSet.add(s.wilayah.trim())
  })
  const distinctWilayahCount = distinctWilayahSet.size

  const totalDanaVerifiedAll = allVerifiedDisbursementsRaw.reduce(
    (acc, d) => acc + (d.nominal || 0),
    0
  )

  // 3. Hitung Kondisi & Status Binaan (2 Kategori)
  let raporBelumDiunggahCount = 0
  let perluPerhatianAcademicCount = 0

  allStudentsRaw.forEach((s) => {
    if (!s.academicUpdates || s.academicUpdates.length === 0) {
      raporBelumDiunggahCount++
    } else {
      const latest = s.academicUpdates[0]
      const rawVal = (latest.nilaiRataRata || "").replace(",", ".").trim()
      const num = parseFloat(rawVal)
      if (!isNaN(num)) {
        if (num <= 4.0) {
          // Skala IPK (0-4): di bawah 2.75 = Perlu Perhatian
          if (num < 2.75) {
            perluPerhatianAcademicCount++
          }
        } else {
          // Skala Rapor (0-100): di bawah 75 = Perlu Perhatian
          if (num < 75.0) {
            perluPerhatianAcademicCount++
          }
        }
      }
    }
  })

  // 4. Hitung Distribusi Bantuan per Wilayah
  const defaultWilayahList = [
    "Pati",
    "Jepara",
    "Ampel",
    "Wonosobo",
    "Sukabumi",
    "Bandung",
  ]
  const allWilayahSet = new Set<string>(defaultWilayahList)
  allStudentsRaw.forEach((s) => {
    if (s.wilayah) allWilayahSet.add(s.wilayah.trim())
  })

  const wilayahDistributions: WilayahDistributionItem[] = Array.from(
    allWilayahSet
  )
    .map((wilayahName) => {
      const studentCount = allStudentsRaw.filter(
        (s) => s.wilayah?.toLowerCase().trim() === wilayahName.toLowerCase().trim()
      ).length

      const totalNominal = allVerifiedDisbursementsRaw
        .filter(
          (d) =>
            d.student?.wilayah?.toLowerCase().trim() ===
            wilayahName.toLowerCase().trim()
        )
        .reduce((acc, curr) => acc + (curr.nominal || 0), 0)

      return {
        wilayah: wilayahName,
        studentCount,
        totalNominal,
      }
    })
    .sort((a, b) => b.studentCount - a.studentCount || b.totalNominal - a.totalNominal)

  // 5. Format 3 Berkas Pending untuk Widget Audit Cepat
  const quickAuditItems: QuickAuditPendingItem[] = pendingProofsRaw.map((p) => ({
    id: p.id,
    tanggal: p.tanggal.toISOString(),
    nominal: p.nominal,
    student: {
      id: p.student.id,
      fullName: p.student.fullName,
      schoolName: p.student.schoolName,
      wilayah: p.student.wilayah,
    },
    pengawas: {
      id: p.pengawas.id,
      name: p.pengawas.name,
      wilayah: p.pengawas.wilayah,
    },
  }))

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <AdminDashboardOverview
        adminName={adminName}
        stats={{
          totalStudents,
          approvedStudents,
          activePercentage,
          pendingStudents,
          totalPengawas,
          distinctWilayahCount,
          pendingAuditCount,
          totalDanaVerifiedAll,
          raporBelumDiunggahCount,
          perluPerhatianAcademicCount,
        }}
        wilayahDistributions={wilayahDistributions}
        quickAuditItems={quickAuditItems}
      />
    </div>
  )
}
