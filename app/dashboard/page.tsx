import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { LogoutButton } from "@/components/logout-button"
import { prisma } from "@/lib/prisma"
import { getPresignedR2Url } from "@/lib/r2"
import { Heart, MapPin } from "lucide-react"
import { StudentDashboard, type StudentData } from "@/components/student-dashboard"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "STUDENT" || !session.user.username) {
    redirect("/login")
  }

  const student = await prisma.student.findUnique({
    where: { username: session.user.username },
    include: {
      pengawas: true,
      father: true,
      mother: true,
      guardian: true,
      educationCosts: true,
      documents: true,
    },
  })
  if (!student) redirect("/login")

  const fotoDoc = student.documents.find((d) => d.type === "FOTO_ANAK")
  const presignedFotoUrl = fotoDoc?.fileUrl ? await getPresignedR2Url(fotoDoc.fileUrl) : null

  const presignedDocuments = await Promise.all(
    student.documents.map(async (d) => ({
      id: d.id,
      type: d.type,
      fileUrl: await getPresignedR2Url(d.fileUrl),
    }))
  )

  // Inisial avatar fallback
  const initials = student.fullName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  const mappedStudent: StudentData = {
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
    nilaiRataRata: student.nilaiRataRata,
    citaCita: student.citaCita,
    wilayah: student.wilayah,
    riwayatPenyakit: student.riwayatPenyakit,
    jumlahSaudara: student.jumlahSaudara,
    pengawasName: student.pengawas?.name ?? "Pengawas Wilayah",
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
    documents: presignedDocuments,
  }

  return (
    <div className="relative min-h-dvh w-full pb-28">
      {/* 1. Background: Gradient oranye hangat dengan motif lotus & dharma wheel subtil */}
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
              id="student-lotus-dharma-pattern"
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

              {/* Lotus */}
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
          <rect width="100%" height="100%" fill="url(#student-lotus-dharma-pattern)" />
        </svg>
      </div>

      <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* 2. Judul Besar di Atas */}
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600">
              <Heart className="size-3.5 fill-orange-500 text-orange-500" />
              Vihara Vimala Dharma
            </p>
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Dashboard Adik Asuh
            </h1>
          </div>
        </header>

        {/* 3. Kartu Profil (Cream/Putih, Rounded Besar, Tombol Keluar Oranye Pill-Shape) */}
        <div className="flex items-center justify-between gap-4 rounded-3xl bg-white/90 p-4 sm:p-5 shadow-md backdrop-blur-md border border-orange-100/80">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Avatar dengan Foto Asli Presigned / Fallback Inisial */}
            <div className="relative size-12 sm:size-14 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white font-extrabold text-base sm:text-lg flex items-center justify-center shadow-md shadow-orange-500/20 border-2 border-white">
              {presignedFotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={presignedFotoUrl}
                  alt={student.fullName}
                  className="size-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            {/* Nama & Wilayah */}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-muted-foreground">Selamat Datang</span>
              <h2 className="text-base sm:text-lg font-black text-foreground truncate">
                Halo, {student.fullName}
              </h2>
              <span className="text-[11px] font-bold text-orange-700 flex items-center gap-1">
                <MapPin className="size-3" /> Wilayah {student.wilayah}
              </span>
            </div>
          </div>

          {/* Tombol Keluar Oranye Pill-Shape */}
          <LogoutButton className="flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-500/20 active:scale-[0.98] transition cursor-pointer disabled:opacity-50" />
        </div>

        {/* Konten Dashboard Interaktif (Beranda / Profil / Dokumen) dengan Bottom Nav Berwarna */}
        <StudentDashboard student={mappedStudent} />
      </main>
    </div>
  )
}
