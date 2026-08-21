import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MapPin, Users } from "lucide-react"

export default async function PengawasPage() {
  const pengawas = await prisma.pengawas.findFirst({ include: { students: { include: { father: true, mother: true, guardian: true, documents: true } } } })
  if (!pengawas) redirect("/login")
  const others = await prisma.student.findMany({ where: { wilayah: pengawas.wilayah, pengawasId: { not: pengawas.id } }, include: { documents: true } })
  const students = [...pengawas.students, ...others]

  return <main className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col gap-6 px-5 py-8">
    <header><p className="text-sm font-bold text-primary">Dashboard Pengawas</p><h1 className="text-3xl font-extrabold text-foreground">Halo, {pengawas.name}</h1><p className="mt-1 flex items-center gap-2 text-muted-foreground"><MapPin className="size-4" />{pengawas.wilayah}</p></header>
    <div className="grid grid-cols-2 gap-3"><Card className="rounded-2xl"><CardContent className="p-4"><Users className="mb-2 size-5 text-primary" /><p className="text-2xl font-extrabold text-foreground">{pengawas.students.length}</p><p className="text-sm text-muted-foreground">Adik asuh pilihan</p></CardContent></Card><Card className="rounded-2xl"><CardContent className="p-4"><MapPin className="mb-2 size-5 text-primary" /><p className="text-2xl font-extrabold text-foreground">{students.length}</p><p className="text-sm text-muted-foreground">Total wilayah {pengawas.wilayah}</p></CardContent></Card></div>
    <section className="flex flex-col gap-3"><h2 className="text-xl font-extrabold text-foreground">Daftar Adik Asuh</h2>{students.map((student) => <Card key={student.id} className="rounded-2xl"><CardHeader><CardTitle className="flex items-center justify-between gap-3 text-lg"><span>{student.fullName}</span><span className="text-sm font-semibold text-muted-foreground">{student.schoolName}</span></CardTitle></CardHeader><CardContent className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2"><p>Kelas: <strong className="text-foreground">{student.gradeLevel}</strong></p><p>Nilai: <strong className="text-foreground">{student.nilaiRataRata}</strong></p><p>Jenis kelamin: <strong className="text-foreground">{student.gender}</strong></p><p>Cita-cita: <strong className="text-foreground">{student.citaCita}</strong></p><p className="sm:col-span-2">Alamat: <strong className="text-foreground">{student.alamatLengkap}</strong></p><a href={student.documents.find((document) => document.type === "RAPOR")?.fileUrl ?? "#"} className="flex items-center gap-2 font-bold text-primary"><FileText className="size-4" />Lihat rapor</a></CardContent></Card>)}</section>
  </main>
}
