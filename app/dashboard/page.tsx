import { redirect } from "next/navigation"
import { getSessionUsername, clearSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, GraduationCap, LogOut, MessageCircle, UserRound } from "lucide-react"

export default async function DashboardPage() {
  const username = await getSessionUsername()
  if (!username) redirect("/login")

  const student = await prisma.student.findUnique({
    where: { username },
    include: { pengawas: true, father: true, mother: true, guardian: true, educationCosts: true, documents: true },
  })
  if (!student) redirect("/login")

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-5 px-5 py-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-primary">Adik Asuh</p>
          <h1 className="text-2xl font-extrabold text-foreground">Halo, {student.fullName}</h1>
        </div>
        <form action={async () => { "use server"; await clearSession(); redirect("/") }}>
          <Button type="submit" variant="ghost" size="icon" aria-label="Keluar"><LogOut className="size-5" /></Button>
        </form>
      </header>

      <nav className="grid grid-cols-3 gap-2" aria-label="Menu dashboard">
        <a href="#beranda" className="flex flex-col items-center gap-1 rounded-2xl bg-primary p-3 text-primary-foreground"><GraduationCap className="size-5" /><span className="text-xs font-bold">Beranda</span></a>
        <a href="#profil" className="flex flex-col items-center gap-1 rounded-2xl bg-secondary p-3 text-foreground"><UserRound className="size-5" /><span className="text-xs font-bold">Profil Saya</span></a>
        <a href="#dokumen" className="flex flex-col items-center gap-1 rounded-2xl bg-secondary p-3 text-foreground"><FileText className="size-5" /><span className="text-xs font-bold">Dokumen</span></a>
      </nav>

      <section id="beranda" className="flex flex-col gap-4">
        <Card className="rounded-2xl border-0 bg-primary text-primary-foreground">
          <CardHeader><CardTitle className="text-xl">Semangat terus belajarnya.</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="leading-relaxed opacity-90">Kami siap mendukung perjalanan pendidikanmu bersama Adik Asuh.</p>
            <p className="text-sm opacity-80">Pengawas: <strong>{student.pengawas.name}</strong> · {student.pengawas.wilayah}</p>
            <Button nativeButton={false} render={<a href="https://wa.me/6282129741793" target="_blank" rel="noreferrer" />} className="w-full rounded-xl bg-background text-foreground hover:bg-background/90"><MessageCircle className="size-4" /> Hubungi Pengawas</Button>
          </CardContent>
        </Card>
      </section>

      <section id="profil" className="flex flex-col gap-3">
        <h2 className="text-xl font-extrabold text-foreground">Profil Saya</h2>
        <Card className="rounded-2xl"><CardContent className="grid gap-3 p-5 sm:grid-cols-2">
          <Info label="NIK" value={student.nik} /><Info label="Tanggal lahir" value={student.dateOfBirth.toLocaleDateString("id-ID")} /><Info label="Jenis kelamin" value={student.gender} /><Info label="Cita-cita" value={student.citaCita} /><Info label="Sekolah" value={student.schoolName} /><Info label="Kelas / tingkat" value={student.gradeLevel} /><Info label="Nilai rata-rata" value={student.nilaiRataRata} /><Info label="No. WhatsApp" value={student.noHp} /><Info label="Alamat" value={student.alamatLengkap} /><Info label="Jumlah saudara" value={String(student.jumlahSaudara)} />
        </CardContent></Card>
      </section>

      <section id="dokumen" className="flex flex-col gap-3 pb-4">
        <h2 className="text-xl font-extrabold text-foreground">Dokumen Saya</h2>
        <Card className="rounded-2xl"><CardContent className="flex flex-col gap-3 p-5">
          {student.documents.length ? student.documents.map((document) => <a key={document.id} href={document.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl bg-secondary p-3 font-bold text-foreground"><FileText className="size-5 text-primary" />{document.type}</a>) : <p className="text-muted-foreground">Belum ada dokumen yang diunggah.</p>}
        </CardContent></Card>
      </section>
    </main>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-secondary p-3"><p className="text-xs font-semibold text-muted-foreground">{label}</p><p className="mt-1 font-bold text-foreground">{value || "-"}</p></div>
}
