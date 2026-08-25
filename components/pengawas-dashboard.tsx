"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  Users,
  GraduationCap,
  MapPin,
  ArrowRight,
  BookOpen,
  X,
  Award,
  Sparkles,
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
      {/* 3. DUA KARTU STATISTIK BERSEBELAHAN (Gradient Oranye dengan Angka Besar) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Kartu 1: Adik Asuh Binaan Saya */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 p-6 text-white shadow-lg shadow-orange-500/20">
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold tracking-wide text-white/90">
                Adik Asuh Binaan Saya
              </span>
              <p className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-sm">
                {binaanStudents.length}
              </p>
              <p className="text-xs text-white/80 mt-1">Bimbingan langsung Anda</p>
            </div>
            <div className="flex size-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-inner">
              <Users className="size-7" />
            </div>
          </div>
          {/* Subtle Decorative Circle */}
          <div className="pointer-events-none absolute -bottom-6 -right-6 size-28 rounded-full bg-white/10" />
        </div>

        {/* Kartu 2: Total Adik Asuh di Wilayah */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 p-6 text-white shadow-lg shadow-amber-500/20">
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold tracking-wide text-white/90">
                Total Adik Asuh di Wilayah {wilayah}
              </span>
              <p className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-sm">
                {allWilayahStudents.length}
              </p>
              <p className="text-xs text-white/80 mt-1">Seluruh pengawas di wilayah ini</p>
            </div>
            <div className="flex size-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-inner">
              <GraduationCap className="size-7" />
            </div>
          </div>
          {/* Subtle Decorative Circle */}
          <div className="pointer-events-none absolute -bottom-6 -right-6 size-28 rounded-full bg-white/10" />
        </div>
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

      {/* 5. SECTION 1 - "Adik Asuh Binaan Saya ([jumlah])" */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm">
              <Users className="size-4" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-foreground">
                Adik Asuh Binaan Saya ({filteredBinaan.length})
              </h2>
              <p className="text-xs text-muted-foreground">
                Adik asuh yang memilih bimbingan langsung Anda
              </p>
            </div>
          </div>
        </div>

        {filteredBinaan.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-orange-200 bg-white/60 p-8 text-center text-sm text-muted-foreground backdrop-blur-sm">
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
      </section>

      {/* 6. SECTION 2 - "Adik Asuh di Wilayah [nama wilayah]" */}
      <section className="flex flex-col gap-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
              <MapPin className="size-4" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-foreground">
                Adik Asuh di Wilayah {wilayah} ({filteredAllWilayah.length})
              </h2>
              <p className="text-xs text-muted-foreground">
                Semua adik asuh terdaftar di wilayah {wilayah}
              </p>
            </div>
          </div>
        </div>

        {filteredAllWilayah.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-orange-200 bg-white/60 p-8 text-center text-sm text-muted-foreground backdrop-blur-sm">
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
