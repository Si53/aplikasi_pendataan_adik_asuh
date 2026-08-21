import { redirect } from "next/navigation"
import { LogOut, MapPin, ShieldCheck } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { getSessionUsername, clearSession } from "@/lib/session"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PengawasDashboard } from "@/components/pengawas-dashboard"

async function logout() {
  "use server"
  await clearSession()
  redirect("/login")
}

export default async function PengawasPage() {
  const username = await getSessionUsername()
  if (!username) redirect("/login")

  const pengawas = await prisma.pengawas.findUnique({
    where: { username },
    include: { students: { include: { documents: true } } },
  })
  if (!pengawas) redirect("/login")

  const students = pengawas.students.map((student) => ({
    id: student.id,
    fullName: student.fullName,
    schoolName: student.schoolName,
    gradeLevel: student.gradeLevel,
    wilayah: student.wilayah,
    nilaiRataRata: student.nilaiRataRata,
    citaCita: student.citaCita,
    documents: student.documents.map((document) => ({ type: document.type, fileUrl: document.fileUrl })),
  }))

  return <main className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col gap-6 px-5 py-6 sm:py-8">
    <header className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-2"><p className="flex items-center gap-2 text-sm font-bold text-primary"><ShieldCheck className="size-4" aria-hidden="true" />Dashboard Pengawas</p><h1 className="text-3xl font-extrabold tracking-tight text-foreground">Halo, {pengawas.name}</h1><p className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="size-4" aria-hidden="true" />{pengawas.wilayah}</p></div>
      <form action={logout}><Button type="submit" variant="outline" size="icon" aria-label="Keluar"><LogOut data-icon="inline-start" /></Button></form>
    </header>
    <Card className="rounded-2xl bg-secondary"><CardContent className="flex flex-col gap-2 p-4"><p className="text-sm font-bold text-secondary-foreground">Panel wilayah</p><p className="text-sm leading-6 text-muted-foreground">Kelola pemantauan adik asuh dan bantu pastikan setiap profil tetap terbarui.</p></CardContent></Card>
    <PengawasDashboard students={students} />
  </main>
}
