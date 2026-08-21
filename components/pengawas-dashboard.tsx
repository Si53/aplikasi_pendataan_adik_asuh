"use client"

import { useMemo, useState } from "react"
import { Search, SlidersHorizontal, FileText, ChevronDown, GraduationCap, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Student = {
  id: number
  fullName: string
  schoolName: string
  gradeLevel: string
  wilayah: string
  nilaiRataRata: string
  citaCita: string
  documents: { type: string; fileUrl: string | null }[]
}

export function PengawasDashboard({ students }: { students: Student[] }) {
  const [query, setQuery] = useState("")
  const [showAll, setShowAll] = useState(false)
  const filtered = useMemo(() => students.filter((student) =>
    `${student.fullName} ${student.schoolName} ${student.wilayah}`.toLowerCase().includes(query.toLowerCase())
  ), [students, query])
  const visible = showAll ? filtered : filtered.slice(0, 5)
  const withDocuments = students.filter((student) => student.documents.length > 0).length

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Card className="rounded-2xl"><CardContent className="flex flex-col gap-2 p-4"><GraduationCap className="size-5 text-primary" /><p className="text-2xl font-extrabold text-foreground">{students.length}</p><p className="text-xs leading-5 text-muted-foreground">Adik asuh di wilayah</p></CardContent></Card>
        <Card className="rounded-2xl"><CardContent className="flex flex-col gap-2 p-4"><FileText className="size-5 text-primary" /><p className="text-2xl font-extrabold text-foreground">{withDocuments}</p><p className="text-xs leading-5 text-muted-foreground">Profil punya dokumen</p></CardContent></Card>
      </div>

      <Card className="rounded-2xl border-primary/20 bg-primary/5">
        <CardContent className="flex items-center justify-between gap-3 p-4">
          <div className="flex min-w-0 flex-col gap-1"><p className="text-sm font-bold text-foreground">Fokus pemantauan</p><p className="text-xs leading-5 text-muted-foreground">Pastikan data akademik dan dokumen terbaru terisi.</p></div>
          <SlidersHorizontal className="size-5 shrink-0 text-primary" aria-hidden="true" />
        </CardContent>
      </Card>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-3"><div><h2 className="text-xl font-extrabold text-foreground">Daftar Adik Asuh</h2><p className="text-sm leading-6 text-muted-foreground">Cari berdasarkan nama, sekolah, atau wilayah.</p></div><div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari adik asuh..." aria-label="Cari adik asuh" className="h-11 rounded-xl pl-9" /></div></div>
        <div className="flex flex-col gap-3">
          {visible.map((student) => <Card key={student.id} className="rounded-2xl"><CardHeader className="gap-2"><CardTitle className="flex items-start justify-between gap-3 text-base"><span className="leading-6">{student.fullName}</span><span className="shrink-0 rounded-full bg-secondary px-2 py-1 text-[10px] font-bold text-secondary-foreground">Aktif</span></CardTitle><p className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="size-3.5" aria-hidden="true" />{student.wilayah}</p></CardHeader><CardContent className="flex flex-col gap-3 text-sm"><div className="grid grid-cols-2 gap-2 text-muted-foreground"><p>Sekolah <strong className="block truncate text-foreground">{student.schoolName || "Belum diisi"}</strong></p><p>Kelas <strong className="block text-foreground">{student.gradeLevel || "Belum diisi"}</strong></p><p>Nilai rata-rata <strong className="block text-foreground">{student.nilaiRataRata || "Belum diisi"}</strong></p><p>Cita-cita <strong className="block truncate text-foreground">{student.citaCita || "Belum diisi"}</strong></p></div><div className="flex items-center justify-between border-t border-border pt-3"><span className="flex items-center gap-1.5 text-xs text-muted-foreground"><FileText className="size-3.5" aria-hidden="true" />{student.documents.length} dokumen</span><Button variant="link" size="sm" className="h-auto p-0">Lihat detail</Button></div></CardContent></Card>)}
          {visible.length === 0 && <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Tidak ada adik asuh yang cocok.</p>}
        </div>
        {filtered.length > 5 && <Button variant="outline" className="w-full rounded-xl" onClick={() => setShowAll((current) => !current)}>{showAll ? "Tampilkan lebih sedikit" : "Lihat semua adik asuh"}<ChevronDown className={`size-4 transition-transform ${showAll ? "rotate-180" : ""}`} data-icon="inline-end" /></Button>}
      </section>
    </>
  )
}
