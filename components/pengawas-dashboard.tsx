"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  Users,
  MapPin,
  ArrowRight,
  UploadCloud,
  X,
  ChevronDown,
} from "lucide-react"

export type StudentDetail = {
  id: number
  fullName: string
  nik: string
  gender: string
  dateOfBirth: string
  alamatLengkap: string
  noHp: string
  schoolName: string
  gradeLevel: string
  nilaiRataRata: string
  citaCita: string
  wilayah: string
  riwayatPenyakit: string
  jumlahSaudara: number
  pengawasId: number
  pengawasName: string
  fotoUrl: string | null
  father?: {
    name: string
    status: string
    occupation: string
    incomePerMonth: string
    phone: string
    address: string
    medicalHistory: string
  } | null
  mother?: {
    name: string
    status: string
    occupation: string
    incomePerMonth: string
    phone: string
    address: string
    medicalHistory: string
  } | null
  guardian?: {
    name: string
    status: string
    occupation: string
    incomePerMonth: string
    phone: string
    address: string
    medicalHistory: string
  } | null
  educationCosts: { id: number; label: string; amount: number }[]
  documents: { id: number; type: string; fileUrl: string }[]
}

export function PengawasDashboard({
  binaanStudents,
  allWilayahStudents,
  wilayah,
}: {
  binaanStudents: StudentDetail[]
  allWilayahStudents: StudentDetail[]
  wilayah: string
}) {
  const [query, setQuery] = useState("")
  const [openSections, setOpenSections] = useState({
    binaan: false,
    wilayah: false,
  })

  const toggleSection = (key: "binaan" | "wilayah") => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Filter pencarian real-time berdasarkan nama, sekolah, atau cita-cita
  const filterStudents = (list: StudentDetail[]) => {
    if (!query.trim()) return list
    const q = query.toLowerCase().trim()
    return list.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.schoolName.toLowerCase().includes(q) ||
        s.citaCita.toLowerCase().includes(q)
    )
  }

  const filteredBinaan = useMemo(
    () => filterStudents(binaanStudents),
    [binaanStudents, query]
  )
  const filteredAllWilayah = useMemo(
    () => filterStudents(allWilayahStudents),
    [allWilayahStudents, query]
  )

  return (
    <div className="flex flex-col gap-6">
      {/* ACTION BANNER: Input Bukti Penyaluran Dana */}
      <div className="relative overflow-hidden rounded-3xl border border-orange-200/80 bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 p-5 sm:p-6 text-white shadow-md shadow-orange-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-inner">
            <UploadCloud className="size-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/25 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                Audit
              </span>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                Input Penyaluran Dana
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-white/90 max-w-xl">
              Unggah bukti struk/nota dan nominal bantuan yang telah diserahkan ke adik asuh.
            </p>
          </div>
        </div>

        <Link
          href="/pengawas/penyaluran-dana"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-xs sm:text-sm font-black text-orange-600 hover:bg-orange-50 transition shadow-sm shrink-0 group self-start sm:self-auto w-full sm:w-auto"
        >
          <span>Unggah Bukti</span>
          <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 4. SEARCH BAR (Pencarian Real-time Nama, Sekolah, Cita-cita) */}
      <div className="relative w-full">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-orange-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari adik asuh berdasarkan nama, sekolah, atau cita-cita..."
          className="h-14 w-full rounded-2xl border border-orange-200/80 bg-white/95 pl-12 pr-10 text-sm sm:text-base font-medium text-foreground shadow-sm backdrop-blur-md placeholder:text-muted-foreground focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-orange-100/60 hover:text-foreground"
            aria-label="Hapus pencarian"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* 5. SECTION 1 - ACCORDION: "Adik Asuh Binaan Saya ([jumlah])" */}
      <section className="overflow-hidden rounded-3xl border border-orange-100/90 bg-white/95 shadow-md backdrop-blur-md transition-all">
        {/* Collapsible Header */}
        <button
          type="button"
          onClick={() => toggleSection("binaan")}
          className="flex w-full items-center justify-between p-5 sm:p-6 text-left hover:bg-orange-50/40 transition-colors cursor-pointer"
          aria-expanded={openSections.binaan}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex size-10 sm:size-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 font-bold shadow-xs">
              <Users className="size-5 sm:size-6" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <h2 className="text-base sm:text-xl font-extrabold text-foreground truncate">
                Adik Asuh Binaan Saya ({filteredBinaan.length})
              </h2>
              <p className="text-xs text-muted-foreground truncate">
                Adik asuh yang memilih bimbingan langsung Anda
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 pl-2">
            <span className="hidden sm:inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-800 border border-orange-200">
              {filteredBinaan.length} Siswa
            </span>

            <div
              className={`flex size-8 sm:size-9 items-center justify-center rounded-xl bg-stone-100 text-stone-600 transition-transform duration-200 ${
                openSections.binaan ? "rotate-180 bg-orange-100 text-orange-700" : ""
              }`}
            >
              <ChevronDown className="size-4 sm:size-5" />
            </div>
          </div>
        </button>

        {/* Collapsible Content */}
        {openSections.binaan && (
          <div className="border-t border-orange-100/80 p-5 sm:p-6 bg-orange-50/20 animate-in fade-in slide-in-from-top-2 duration-200">
            {filteredBinaan.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-orange-200 bg-white/60 p-8 text-center text-sm text-muted-foreground backdrop-blur-sm">
                {query
                  ? "Tidak ada adik asuh binaan yang cocok dengan pencarian."
                  : "Belum ada adik asuh yang memilih Anda sebagai pengawas langsung."}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredBinaan.map((student) => (
                  <StudentCard key={student.id} student={student} isBinaan={true} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 6. SECTION 2 - ACCORDION: "Adik Asuh di Wilayah [nama wilayah]" */}
      <section className="overflow-hidden rounded-3xl border border-orange-100/90 bg-white/95 shadow-md backdrop-blur-md transition-all">
        {/* Collapsible Header */}
        <button
          type="button"
          onClick={() => toggleSection("wilayah")}
          className="flex w-full items-center justify-between p-5 sm:p-6 text-left hover:bg-orange-50/40 transition-colors cursor-pointer"
          aria-expanded={openSections.wilayah}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex size-10 sm:size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 font-bold shadow-xs">
              <MapPin className="size-5 sm:size-6" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <h2 className="text-base sm:text-xl font-extrabold text-foreground truncate">
                Adik Asuh di Wilayah {wilayah} ({filteredAllWilayah.length})
              </h2>
              <p className="text-xs text-muted-foreground truncate">
                Semua adik asuh terdaftar di wilayah {wilayah}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 pl-2">
            <span className="hidden sm:inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
              {filteredAllWilayah.length} Siswa
            </span>

            <div
              className={`flex size-8 sm:size-9 items-center justify-center rounded-xl bg-stone-100 text-stone-600 transition-transform duration-200 ${
                openSections.wilayah ? "rotate-180 bg-orange-100 text-orange-700" : ""
              }`}
            >
              <ChevronDown className="size-4 sm:size-5" />
            </div>
          </div>
        </button>

        {/* Collapsible Content */}
        {openSections.wilayah && (
          <div className="border-t border-orange-100/80 p-5 sm:p-6 bg-orange-50/20 animate-in fade-in slide-in-from-top-2 duration-200">
            {filteredAllWilayah.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-orange-200 bg-white/60 p-8 text-center text-sm text-muted-foreground backdrop-blur-sm">
                {query
                  ? "Tidak ada adik asuh di wilayah ini yang cocok dengan pencarian."
                  : `Belum ada adik asuh terdaftar di wilayah ${wilayah}.`}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredAllWilayah.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    isBinaan={student.pengawasId === student.pengawasId}
                    badgeLabel={student.pengawasName ? `Pengawas: ${student.pengawasName}` : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

function StudentCard({
  student,
  isBinaan,
  badgeLabel,
}: {
  student: StudentDetail
  isBinaan: boolean
  badgeLabel?: string
}) {
  const initials = student.fullName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  return (
    <div className="group flex flex-col justify-between gap-4 rounded-3xl border border-orange-100/80 bg-white/90 p-5 shadow-md backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      {/* Bagian Atas: Foto & Info Utama */}
      <div className="flex items-start gap-4">
        {/* Foto Anak */}
        <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 border-2 border-orange-200/80 shadow-sm">
          {student.fotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={student.fotoUrl}
              alt={student.fullName}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center font-extrabold text-lg text-orange-600">
              {initials}
            </div>
          )}
        </div>

        {/* Nama & Status */}
        <div className="flex flex-1 flex-col gap-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-extrabold text-base sm:text-lg text-foreground truncate">
              {student.fullName}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {badgeLabel ? (
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-900 border border-amber-200 truncate max-w-[200px]">
                {badgeLabel}
              </span>
            ) : isBinaan ? (
              <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-bold text-orange-700 border border-orange-200">
                Binaan Saya
              </span>
            ) : null}
            {student.citaCita && (
              <span className="text-[11px] font-medium text-muted-foreground truncate">
                • {student.citaCita}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bagian Tengah: Detail Sekolah, Kelas, Nilai */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-2xl bg-orange-50/50 p-3 text-xs border border-orange-100/60">
        <div>
          <span className="text-muted-foreground block text-[11px]">Sekolah</span>
          <p className="font-bold text-foreground truncate" title={student.schoolName}>
            {student.schoolName || "-"}
          </p>
        </div>
        <div>
          <span className="text-muted-foreground block text-[11px]">Kelas</span>
          <p className="font-bold text-foreground truncate">{student.gradeLevel || "-"}</p>
        </div>
        <div>
          <span className="text-muted-foreground block text-[11px]">Nilai Rapor / IPK</span>
          <p className="font-extrabold text-orange-600 truncate">{student.nilaiRataRata || "-"}</p>
        </div>
      </div>

      {/* Bagian Bawah: Tombol "Lihat Detail" (Oranye Pill-Shape) */}
      <Link
        href={`/pengawas/students/${student.id}`}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 px-6 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition-all duration-200 hover:from-orange-600 hover:to-amber-600 hover:shadow-lg hover:shadow-orange-500/30 active:scale-[0.98]"
      >
        <span>Lihat Detail</span>
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  )
}
