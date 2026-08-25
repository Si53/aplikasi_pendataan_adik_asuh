import { redirect } from "next/navigation"
import { MapPin, ShieldCheck } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { LogoutButton } from "@/components/logout-button"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PengawasDashboard } from "@/components/pengawas-dashboard"

export default async function PengawasPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "PENGAWAS" || !session.user.username) {
    redirect("/login")
  }

  const pengawas = await prisma.pengawas.findUnique({
    where: { username: session.user.username },
  })
  if (!pengawas) redirect("/login")

  const [binaanStudentsRaw, sewilayahStudentsRaw] = await Promise.all([
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
        pengawasId: { not: pengawas.id },
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

  const mapStudent = (s: typeof binaanStudentsRaw[number]) => ({
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
    pengawasName: s.pengawas?.name ?? pengawas.name,
    father: s.father ? {
      name: s.father.name,
      status: s.father.status,
      occupation: s.father.occupation,
      incomePerMonth: s.father.incomePerMonth,
      phone: s.father.phone,
      address: s.father.address,
      medicalHistory: s.father.medicalHistory,
    } : null,
    mother: s.mother ? {
      name: s.mother.name,
      status: s.mother.status,
      occupation: s.mother.occupation,
      incomePerMonth: s.mother.incomePerMonth,
      phone: s.mother.phone,
      address: s.mother.address,
      medicalHistory: s.mother.medicalHistory,
    } : null,
    guardian: s.guardian ? {
      name: s.guardian.name,
      status: s.guardian.status,
      occupation: s.guardian.occupation,
      incomePerMonth: s.guardian.incomePerMonth,
      phone: s.guardian.phone,
      address: s.guardian.address,
      medicalHistory: s.guardian.medicalHistory,
    } : null,
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
  })

  const binaanStudents = binaanStudentsRaw.map(mapStudent)
  const sewilayahStudents = sewilayahStudentsRaw.map(mapStudent)

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-6 px-5 py-6 sm:py-8">
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="flex items-center gap-2 text-sm font-bold text-primary">
            <ShieldCheck className="size-4" aria-hidden="true" />
            Dashboard Pengawas
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Halo, {pengawas.name}
          </h1>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4 text-primary" aria-hidden="true" />
            Wilayah Tugas: <strong className="text-foreground">{pengawas.wilayah}</strong>
          </p>
        </div>
        <LogoutButton />
      </header>

      <Card className="rounded-2xl border-primary/20 bg-secondary/50">
        <CardContent className="flex flex-col gap-1.5 p-4 sm:p-5">
          <p className="text-sm font-bold text-foreground">Panel Pemantauan Wilayah {pengawas.wilayah}</p>
          <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Pantau perkembangan adik asuh binaan Anda dan periksa data adik asuh lainnya di wilayah yang sama.
          </p>
        </CardContent>
      </Card>

      <PengawasDashboard
        binaanStudents={binaanStudents}
        sewilayahStudents={sewilayahStudents}
        wilayah={pengawas.wilayah}
      />
    </main>
  )
}
