import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getPresignedR2Url } from "@/lib/r2"
import { ArrowLeft, MapPin } from "lucide-react"
import {
  PengawasStudentDetailTabs,
  type StudentDetailFull,
} from "@/components/pengawas-student-detail-tabs"

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== "PENGAWAS" || !session.user.username) {
    redirect("/login")
  }

  const { id } = await params
  const studentId = Number(id)
  if (isNaN(studentId)) {
    notFound()
  }

  const pengawas = await prisma.pengawas.findUnique({
    where: { username: session.user.username },
  })
  if (!pengawas) redirect("/login")

  const student = await prisma.student.findFirst({
    where: {
      id: studentId,
      status: "approved",
      OR: [{ pengawasId: pengawas.id }, { wilayah: pengawas.wilayah }],
    },
    include: {
      pengawas: true,
      father: true,
      mother: true,
      guardian: true,
      educationCosts: true,
      documents: true,
      academicUpdates: {
        orderBy: {
          tanggalInput: "desc",
        },
      },
      disbursements: {
        where: {
          pengawasId: pengawas.id,
        },
        orderBy: {
          tanggal: "desc",
        },
      },
    },
  })

  if (!student) {
    notFound()
  }

  const isBinaan = student.pengawasId === pengawas.id
  const fotoDoc = student.documents.find((d) => d.type === "FOTO_ANAK")
  const presignedFotoUrl = fotoDoc?.fileUrl ? await getPresignedR2Url(fotoDoc.fileUrl) : null

  // Presign academic updates rapor URLs
  const academicUpdates = await Promise.all(
    student.academicUpdates.map(async (u) => {
      const presigned = u.dokumenRapor ? await getPresignedR2Url(u.dokumenRapor) : null
      return {
        id: u.id,
        tanggalInput: u.tanggalInput.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        kelasSaatItu: u.kelasSaatItu,
        nilaiRataRata: u.nilaiRataRata,
        namaSekolahBaru: u.namaSekolahBaru,
        dokumenRaporUrl: presigned,
      }
    })
  )

  // Presign disbursement proof URLs
  const disbursementHistory = await Promise.all(
    student.disbursements.map(async (item) => {
      const presigned = await getPresignedR2Url(item.fileUrl)
      return {
        id: item.id,
        tanggal: item.tanggal.toISOString(),
        fileUrl: presigned,
        nominal: item.nominal,
        status: item.status,
        processedAt: item.processedAt ? item.processedAt.toISOString() : null,
      }
    })
  )

  // Inisial untuk avatar fallback
  const initials = student.fullName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  const studentData: StudentDetailFull = {
    id: student.id,
    fullName: student.fullName,
    nik: student.nik,
    gender: student.gender,
    dateOfBirth: student.dateOfBirth.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    alamatLengkap: student.alamatLengkap,
    noHp: student.noHp,
    schoolName: student.schoolName,
    gradeLevel: student.gradeLevel,
    nilaiAwal: student.nilaiRataRata,
    citaCita: student.citaCita,
    wilayah: student.wilayah,
    riwayatPenyakit: student.riwayatPenyakit,
    jumlahSaudara: student.jumlahSaudara,
    isBinaan,
    pengawasName: student.pengawas?.name || pengawas.name,
    fotoUrl: presignedFotoUrl,
    father: student.father
      ? {
          name: student.father.name,
          status: student.father.status,
          occupation: student.father.occupation,
          incomePerMonth: student.father.incomePerMonth,
          phone: student.father.phone,
          address: student.father.address,
          medicalHistory: student.father.medicalHistory,
        }
      : null,
    mother: student.mother
      ? {
          name: student.mother.name,
          status: student.mother.status,
          occupation: student.mother.occupation,
          incomePerMonth: student.mother.incomePerMonth,
          phone: student.mother.phone,
          address: student.mother.address,
          medicalHistory: student.mother.medicalHistory,
        }
      : null,
    guardian: student.guardian
      ? {
          name: student.guardian.name,
          status: student.guardian.status,
          occupation: student.guardian.occupation,
          incomePerMonth: student.guardian.incomePerMonth,
          phone: student.guardian.phone,
          address: student.guardian.address,
          medicalHistory: student.guardian.medicalHistory,
        }
      : null,
    educationCosts: student.educationCosts.map((c) => ({
      id: c.id,
      label: c.label,
      amount: c.amount,
    })),
    academicUpdates,
    disbursementHistory,
  }

  return (
    <div className="relative min-h-dvh w-full">
      {/* Background subtil dengan gradient & dharma wheel + lotus */}
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
              id="detail-dharma-lotus-bg"
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
          <rect width="100%" height="100%" fill="url(#detail-dharma-lotus-bg)" />
        </svg>
      </div>

      <main className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* Header Navigasi */}
        <header className="flex items-center justify-between gap-4">
          <Link
            href="/pengawas"
            className="flex items-center gap-2 rounded-2xl bg-white/90 px-4 py-2.5 text-sm font-bold text-orange-950 shadow-sm border border-orange-200/80 backdrop-blur-md transition hover:bg-white hover:border-orange-300"
          >
            <ArrowLeft className="size-4" />
            <span>Kembali ke Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3.5 py-1 text-xs font-extrabold ${
                isBinaan
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/20"
                  : "bg-white/90 text-orange-900 border border-orange-200 shadow-2xs"
              }`}
            >
              {isBinaan ? "Binaan Langsung Saya" : `Wilayah: ${student.wilayah}`}
            </span>
          </div>
        </header>

        {/* Banner Profil Siswa */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 rounded-3xl bg-white/90 p-6 shadow-md backdrop-blur-md border border-orange-100/80">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 border-2 border-orange-200 shadow-sm">
            {presignedFotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={presignedFotoUrl}
                alt={student.fullName}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center font-extrabold text-2xl text-orange-600">
                {initials}
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col items-center sm:items-start text-center sm:text-left gap-1">
            <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
              {student.fullName}
            </h1>
            <p className="text-sm font-semibold text-orange-700 flex items-center gap-1.5">
              <MapPin className="size-4" />
              Wilayah {student.wilayah} • Pengawas: {student.pengawas?.name || pengawas.name}
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-800 border border-orange-200">
                NIK: {student.nik}
              </span>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
                Cita-cita: {student.citaCita || "-"}
              </span>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
                {student.schoolName} ({student.gradeLevel})
              </span>
            </div>
          </div>
        </div>

        {/* 2 TAB DETAIL: PEMANTAUAN AKADEMIK & INPUT PENYALURAN DANA */}
        <PengawasStudentDetailTabs
          student={studentData}
          pengawasName={pengawas.name}
          wilayah={pengawas.wilayah}
        />
      </main>
    </div>
  )
}
