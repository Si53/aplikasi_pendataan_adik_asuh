import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ShieldCheck } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { getPresignedR2Url } from "@/lib/r2"
import { LogoutButton } from "@/components/logout-button"
import { getCurrentPeriode, isDateInPeriode } from "@/lib/periode"
import { formatGradeWithJenjang } from "@/lib/academic"
import {
  PengawasPenyaluranForm,
  type PengawasStudentRow,
  type PengawasProofHistoryItem,
} from "@/components/pengawas-penyaluran-form"

export default async function PengawasPenyaluranDanaPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "PENGAWAS" || !session.user.username) {
    redirect("/login")
  }

  const pengawas = await prisma.pengawas.findUnique({
    where: { username: session.user.username },
  })
  if (!pengawas) redirect("/login")

  // Periode berjalan saat ini berdasarkan tanggal hari ini
  const currentPeriode = getCurrentPeriode()

  // Ambil HANYA siswa binaan pengawas ini sendiri dengan status approved
  const studentsRaw = await prisma.student.findMany({
    where: {
      pengawasId: pengawas.id,
      status: "approved",
    },
    select: {
      id: true,
      fullName: true,
      schoolName: true,
      jenjang: true,
      gradeLevel: true,
      wilayah: true,
      disbursements: {
        select: {
          id: true,
          tanggal: true,
          nominal: true,
          status: true,
        },
        orderBy: { tanggal: "desc" },
      },
    },
    orderBy: { fullName: "asc" },
  })

  // Format siswa beserta riwayat pencatatannya untuk perhitungan periode dinamis
  const students: PengawasStudentRow[] = studentsRaw.map((s) => {
    const periodProofs = s.disbursements.filter((d) =>
      isDateInPeriode(d.tanggal, currentPeriode)
    )
    const hasVerified = periodProofs.some((d) => d.status === "verified")
    const hasPending = periodProofs.some((d) => d.status === "pending")
    const hasRejected = periodProofs.some((d) => d.status === "rejected")

    let statusPeriode: "Belum menerima" | "Menunggu verifikasi" | "Terverifikasi" =
      "Belum menerima"
    if (hasVerified) {
      statusPeriode = "Terverifikasi"
    } else if (hasPending) {
      statusPeriode = "Menunggu verifikasi"
    }

    return {
      id: s.id,
      fullName: s.fullName,
      schoolName: s.schoolName,
      jenjang: s.jenjang,
      gradeLevel: s.gradeLevel,
      formattedGrade: formatGradeWithJenjang(s.gradeLevel, s.jenjang),
      wilayah: s.wilayah,
      statusPeriode,
      hasRejectedPrevious: statusPeriode === "Belum menerima" && hasRejected,
      disbursements: s.disbursements.map((d) => ({
        id: d.id,
        tanggal: d.tanggal.toISOString(),
        nominal: d.nominal,
        status: d.status,
      })),
    }
  })

  // Ambil seluruh riwayat bukti penyaluran milik anak binaan pengawas ini
  const historyRaw = await prisma.disbursementProof.findMany({
    where: {
      student: {
        pengawasId: pengawas.id,
      },
    },
    include: {
      student: {
        select: {
          id: true,
          fullName: true,
          schoolName: true,
          jenjang: true,
          gradeLevel: true,
          wilayah: true,
        },
      },
    },
    orderBy: {
      tanggal: "desc",
    },
  })

  // Format presigned URLs untuk berkas bukti riwayat
  const history: PengawasProofHistoryItem[] = await Promise.all(
    historyRaw.map(async (item) => {
      const presigned = await getPresignedR2Url(item.fileUrl)
      return {
        id: item.id,
        tanggal: item.tanggal.toISOString(),
        fileUrl: presigned,
        nominal: item.nominal,
        status: item.status,
        keterangan: item.keterangan || null,
        batchId: item.batchId || null,
        processedAt: item.processedAt ? item.processedAt.toISOString() : null,
        student: {
          id: item.student.id,
          fullName: item.student.fullName,
          schoolName: item.student.schoolName,
          gradeLevel: formatGradeWithJenjang(item.student.gradeLevel, item.student.jenjang),
          wilayah: item.student.wilayah,
        },
      }
    })
  )

  return (
    <div className="relative min-h-dvh w-full">
      {/* Background: Gradient Cream/Oranye Muda dengan motif Dharma Wheel dan Lotus Subtil */}
      <div
        className="fixed inset-0 -z-10 bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-amber-50/60 pointer-events-none"
        aria-hidden="true"
      >
        <svg
          className="h-full w-full opacity-10 text-orange-600 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="pengawas-lotus-dharma-pattern"
              width="120"
              height="120"
              patternUnits="userSpaceOnUse"
            >
              {/* Dharmachakra */}
              <g transform="translate(30, 30)">
                <circle cx="0" cy="0" r="14" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="0" cy="0" r="4.5" fill="currentColor" />
                <line x1="0" y1="-14" x2="0" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="-14" y1="0" x2="14" y2="0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="-10" y1="-10" x2="10" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="-10" y1="10" x2="10" y2="-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* Bunga Teratai (Lotus) */}
              <g transform="translate(90, 90)">
                <path d="M0,6 C-3.5,-1 -3.5,-11 0,-15 C3.5,-11 3.5,-1 0,6" />
                <path d="M-1.5,5 C-8,1 -11,-7 -8,-12 C-5,-13 -2.5,-6 -1.5,5" />
                <path d="M1.5,5 C8,1 11,-7 8,-12 C5,-13 2.5,-6 1.5,5" />
                <path d="M-3,6 C-12,4 -15,-1 -13,-6 C-9,-7 -5,-1 -3,6" />
                <path d="M3,6 C12,4 15,-1 13,-6 C9,-7 5,-1 3,6" />
                <path d="M-7,7 Q0,11 7,7 Q0,9 -7,7" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pengawas-lotus-dharma-pattern)" />
        </svg>
      </div>

      <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* HEADER */}
        <header className="flex items-center justify-between gap-4 rounded-3xl bg-white/85 px-5 py-3.5 shadow-sm backdrop-blur-md border border-orange-100/80">
          <div className="flex items-center gap-3">
            <div className="relative size-10 overflow-hidden rounded-full border border-orange-200 shadow-sm">
              <Image
                src="/logo-kakak-asuh-pvvd.png"
                alt="Logo PVVD"
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <div>
              <Link
                href="/pengawas"
                className="text-xl sm:text-2xl font-extrabold text-orange-600 tracking-tight hover:underline flex items-center gap-1.5"
              >
                <span>Dashboard Pengawas</span>
              </Link>
              <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="size-3 text-orange-500" /> Vihara Vimala Dharma
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <LogoutButton />
          </div>
        </header>

        {/* FORM & HISTORY */}
        <PengawasPenyaluranForm
          students={students}
          history={history}
          pengawasName={pengawas.name}
          wilayah={pengawas.wilayah}
          currentPeriode={currentPeriode}
        />
      </main>
    </div>
  )
}
