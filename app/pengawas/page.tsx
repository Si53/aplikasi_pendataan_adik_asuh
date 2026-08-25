import { redirect } from "next/navigation"
import Image from "next/image"
import { Bell, MapPin, ShieldCheck, User } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { LogoutButton } from "@/components/logout-button"
import { PengawasDashboard, type StudentDetail } from "@/components/pengawas-dashboard"

export default async function PengawasPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "PENGAWAS" || !session.user.username) {
    redirect("/login")
  }

  const pengawas = await prisma.pengawas.findUnique({
    where: { username: session.user.username },
  })
  if (!pengawas) redirect("/login")

  // Query Data Asli Prisma:
  // Section 1: Adik Asuh Binaan (pengawasId = pengawas.id)
  // Section 2: Adik Asuh di Wilayah (wilayah = pengawas.wilayah, mencakup semua siswa di wilayah ini)
  const [binaanStudentsRaw, allWilayahStudentsRaw] = await Promise.all([
    prisma.student.findMany({
      where: { pengawasId: pengawas.id },
      include: {
        father: true,
        mother: true,
        guardian: true,
        educationCosts: true,
        documents: true,
        pengawas: { select: { name: true } },
      },
      orderBy: { fullName: "asc" },
    }),
    prisma.student.findMany({
      where: {
        wilayah: pengawas.wilayah,
      },
      include: {
        father: true,
        mother: true,
        guardian: true,
        educationCosts: true,
        documents: true,
        pengawas: { select: { name: true } },
      },
      orderBy: { fullName: "asc" },
    }),
  ])

  const mapStudent = (s: typeof binaanStudentsRaw[number]): StudentDetail => {
    const fotoDoc = s.documents.find((d) => d.type === "FOTO_ANAK")
    return {
      id: s.id,
      fullName: s.fullName,
      nik: s.nik,
      gender: s.gender,
      dateOfBirth: s.dateOfBirth.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      alamatLengkap: s.alamatLengkap,
      noHp: s.noHp,
      schoolName: s.schoolName,
      gradeLevel: s.gradeLevel,
      nilaiRataRata: s.nilaiRataRata,
      citaCita: s.citaCita,
      wilayah: s.wilayah,
      riwayatPenyakit: s.riwayatPenyakit,
      jumlahSaudara: s.jumlahSaudara,
      pengawasId: s.pengawasId,
      pengawasName: s.pengawas?.name ?? pengawas.name,
      fotoUrl: fotoDoc?.fileUrl || null,
      father: s.father
        ? {
            name: s.father.name,
            status: s.father.status,
            occupation: s.father.occupation,
            incomePerMonth: s.father.incomePerMonth,
            phone: s.father.phone,
            address: s.father.address,
            medicalHistory: s.father.medicalHistory,
          }
        : null,
      mother: s.mother
        ? {
            name: s.mother.name,
            status: s.mother.status,
            occupation: s.mother.occupation,
            incomePerMonth: s.mother.incomePerMonth,
            phone: s.mother.phone,
            address: s.mother.address,
            medicalHistory: s.mother.medicalHistory,
          }
        : null,
      guardian: s.guardian
        ? {
            name: s.guardian.name,
            status: s.guardian.status,
            occupation: s.guardian.occupation,
            incomePerMonth: s.guardian.incomePerMonth,
            phone: s.guardian.phone,
            address: s.guardian.address,
            medicalHistory: s.guardian.medicalHistory,
          }
        : null,
      educationCosts: s.educationCosts.map((c) => ({
        id: c.id,
        label: c.label,
        amount: c.amount,
      })),
      documents: s.documents.map((d) => ({
        id: d.id,
        type: d.type,
        fileUrl: d.fileUrl,
      })),
    }
  }

  const binaanStudents = binaanStudentsRaw.map(mapStudent)
  const allWilayahStudents = allWilayahStudentsRaw.map(mapStudent)

  // Inisial untuk avatar pengawas
  const pengawasInitials = pengawas.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  return (
    <div className="relative min-h-dvh w-full">
      {/* 7. Background: Gradient Cream/Oranye Muda dengan motif Dharma Wheel dan Lotus Subtil */}
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

      <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* 1. HEADER (Logo Kecil di Kiri, Judul Oranye Bold, Ikon Bell Notifikasi + Logout) */}
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
              <h1 className="text-lg sm:text-xl font-extrabold text-orange-600 tracking-tight">
                Dashboard Pengawas
              </h1>
              <p className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="size-3 text-orange-500" /> Vihara Vimala Dharma
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Bell Notifikasi dengan Badge Kecil */}
            <div className="relative">
              <button
                type="button"
                className="flex size-10 items-center justify-center rounded-2xl bg-orange-50 text-orange-700 transition hover:bg-orange-100/80 border border-orange-200/60"
                aria-label="Notifikasi"
              >
                <Bell className="size-5" />
              </button>
              {/* Badge dot kecil */}
              <span className="absolute top-1.5 right-1.5 size-2.5 rounded-full bg-orange-500 ring-2 ring-white" />
            </div>

            <LogoutButton />
          </div>
        </header>

        {/* 2. KARTU PROFIL PENGAWAS */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 rounded-3xl bg-white/90 p-5 sm:p-6 shadow-md backdrop-blur-md border border-orange-100/80">
          {/* Avatar Inisial */}
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 font-extrabold text-xl text-white shadow-md shadow-orange-500/20">
            {pengawasInitials}
          </div>

          {/* Info Pengawas */}
          <div className="flex flex-1 flex-col items-center sm:items-start text-center sm:text-left gap-1">
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              Halo, {pengawas.name}
            </h2>
            <div className="mt-1 flex items-center gap-1.5 rounded-full bg-orange-50 px-3.5 py-1 text-xs font-bold text-orange-800 border border-orange-200">
              <MapPin className="size-3.5 text-orange-600" />
              <span>Wilayah Tugas: <strong>{pengawas.wilayah}</strong></span>
            </div>
          </div>
        </div>

        {/* 3, 4, 5, 6. DASHBOARD CONTENT (STATISTIK, SEARCH, SECTION 1, SECTION 2) */}
        <PengawasDashboard
          binaanStudents={binaanStudents}
          allWilayahStudents={allWilayahStudents}
          wilayah={pengawas.wilayah}
        />
      </main>
    </div>
  )
}
