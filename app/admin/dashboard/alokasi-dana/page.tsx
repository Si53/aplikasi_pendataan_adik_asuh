import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getPresignedR2Url } from "@/lib/r2"
import {
  AdminAlokasiDanaView,
  type AlokasiStudentItem,
  type AlokasiYearlySummary,
} from "@/components/admin-alokasi-dana-view"

export const dynamic = "force-dynamic"

export default async function AlokasiDanaDashboardPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  // 1. Batas waktu 6 bulan terakhir untuk statistik semester berjalan
  const now = new Date()
  const sixMonthsAgo = new Date(now)
  sixMonthsAgo.setMonth(now.getMonth() - 6)

  // 2. Fetch data dari database secara paralel
  const [recentVerifiedRaw, studentsRaw] = await Promise.all([
    // Ambil semua bukti terverifikasi dalam 6 bulan terakhir
    prisma.disbursementProof.findMany({
      where: {
        status: "verified",
        tanggal: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        id: true,
        studentId: true,
        nominal: true,
        tanggal: true,
      },
    }),

    // Ambil semua adik asuh beserta riwayat penyaluran terverifikasi & penyesuaian koreksi manual
    prisma.student.findMany({
      include: {
        pengawas: {
          select: {
            id: true,
            name: true,
            wilayah: true,
          },
        },
        disbursements: {
          where: {
            status: "verified",
          },
          include: {
            pengawas: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            tanggal: "desc",
          },
        },
        bantuanAdjustments: {
          include: {
            admin: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        fullName: "asc",
      },
    }),
  ])

  // 3. Hitung 2 Kartu Statistik (6 Bulan Terakhir)
  const totalTersalurkan6Bulan = recentVerifiedRaw.reduce(
    (acc, curr) => acc + (curr.nominal || 0),
    0
  )

  const distinctStudentIds6Bulan = new Set(
    recentVerifiedRaw.map((item) => item.studentId)
  )
  const adikAsuhMenerimaCount = distinctStudentIds6Bulan.size

  // 4. Format data siswa untuk tabel & modal riwayat
  const students: AlokasiStudentItem[] = await Promise.all(
    studentsRaw.map(async (st) => {
      // Hitung total dana terverifikasi sepanjang waktu
      const totalVerifiedNominal = st.disbursements.reduce(
        (acc, d) => acc + (d.nominal || 0),
        0
      )

      // Ambil tanggal verifikasi terbaru
      const latestProof = st.disbursements[0]
      const lastVerifiedDate = latestProof
        ? (latestProof.processedAt || latestProof.tanggal).toISOString()
        : null

      // Breakdown per tahun
      const yearMap = new Map<number, { totalNominal: number; count: number }>()
      st.disbursements.forEach((d) => {
        const year = new Date(d.tanggal).getFullYear()
        const current = yearMap.get(year) || { totalNominal: 0, count: 0 }
        current.totalNominal += d.nominal || 0
        current.count += 1
        yearMap.set(year, current)
      })

      const yearlySummaries: AlokasiYearlySummary[] = Array.from(
        yearMap.entries()
      )
        .map(([year, data]) => ({
          year,
          totalNominal: data.totalNominal,
          count: data.count,
        }))
        .sort((a, b) => b.year - a.year)

      // Resolve presigned URLs untuk bukti berkas
      const formattedDisbursements = await Promise.all(
        st.disbursements.map(async (d) => ({
          id: d.id,
          tanggal: d.tanggal.toISOString(),
          nominal: d.nominal,
          fileUrl: d.fileUrl ? await getPresignedR2Url(d.fileUrl) : "",
          processedAt: d.processedAt ? d.processedAt.toISOString() : null,
          pengawasName: d.pengawas?.name || "Pengawas Wilayah",
        }))
      )

      const formattedAdjustments = st.bantuanAdjustments.map((adj) => ({
        id: adj.id,
        createdAt: adj.createdAt.toISOString(),
        nominalLama: adj.nominalLama,
        nominalBaru: adj.nominalBaru,
        catatan: adj.catatan,
        adminName: adj.admin?.name || "Administrator",
      }))

      return {
        id: st.id,
        fullName: st.fullName,
        nik: st.nik,
        schoolName: st.schoolName,
        gradeLevel: st.gradeLevel,
        wilayah: st.wilayah,
        gender: st.gender,
        pengawasName: st.pengawas?.name || "Belum Ditugaskan",
        totalVerifiedNominal,
        disbursementCount: st.disbursements.length,
        lastVerifiedDate,
        yearlySummaries,
        disbursements: formattedDisbursements,
        adjustments: formattedAdjustments,
      }
    })
  )

  // 5. Ekstrak daftar wilayah unik
  const wilayahSet = new Set<string>()
  ;["Pati", "Jepara", "Ampel", "Wonosobo", "Sukabumi", "Bandung"].forEach((w) =>
    wilayahSet.add(w)
  )
  studentsRaw.forEach((s) => {
    if (s.wilayah) wilayahSet.add(s.wilayah)
  })
  const wilayahList = Array.from(wilayahSet).sort()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <AdminAlokasiDanaView
        stats={{
          totalTersalurkan6Bulan,
          adikAsuhMenerimaCount,
        }}
        students={students}
        wilayahList={wilayahList}
      />
    </div>
  )
}
