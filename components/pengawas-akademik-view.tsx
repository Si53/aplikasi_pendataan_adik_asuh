"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  BookOpen,
  GraduationCap,
  FileText,
  ExternalLink,
  ChevronDown,
  Clock,
  Calendar,
  Building2,
  Award,
  Info,
  Users,
  CheckCircle2,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export type AcademicUpdateItem = {
  id: number
  tanggalInput: string
  kelasSaatItu: string
  nilaiRataRata: string
  namaSekolahBaru: string | null
  dokumenRaporUrl: string | null
}

export type StudentAcademicProfile = {
  id: number
  fullName: string
  nik: string
  schoolName: string
  gradeLevel: string
  nilaiAwal: string
  wilayah: string
  isBinaan: boolean
  academicUpdates: AcademicUpdateItem[]
}

export function PengawasAkademikView({
  students,
  pengawasName,
  wilayah,
}: {
  students: StudentAcademicProfile[]
  pengawasName: string
  wilayah: string
}) {
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    students.length > 0 ? students[0].id : null
  )

  const selectedStudent = useMemo(
    () => students.find((s) => s.id === selectedStudentId) || students[0] || null,
    [students, selectedStudentId]
  )

  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl bg-white/90 p-8 text-center shadow-md backdrop-blur-md border border-orange-100/80">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
          <Users className="size-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-foreground">Belum Ada Data Siswa</h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
            Saat ini belum ada adik asuh binaan maupun siswa terdaftar di wilayah {wilayah}.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 1. KARTU PILIH ADIK ASUH (DROPDOWN GABUNGAN BINAAN & WILAYAH) */}
      <div className="flex flex-col gap-3 rounded-3xl bg-white/95 p-5 sm:p-6 shadow-md backdrop-blur-md border border-orange-100/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-orange-100/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <GraduationCap className="size-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-foreground">
                Pilih Adik Asuh
              </h2>
              <p className="text-xs text-muted-foreground">
                Gabungan siswa binaan langsung dan siswa di wilayah {wilayah} ({students.length} siswa)
              </p>
            </div>
          </div>

          {selectedStudent && (
            <span
              className={`self-start sm:self-auto rounded-full px-3 py-0.5 text-xs font-bold border ${
                selectedStudent.isBinaan
                  ? "bg-orange-50 text-orange-800 border-orange-200"
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}
            >
              {selectedStudent.isBinaan ? "⭐ Binaan Langsung Saya" : `Wilayah: ${selectedStudent.wilayah}`}
            </span>
          )}
        </div>

        {/* Custom Styled Select Dropdown */}
        <div className="relative">
          <select
            value={selectedStudent?.id ?? ""}
            onChange={(e) => setSelectedStudentId(Number(e.target.value))}
            className="h-14 w-full appearance-none rounded-2xl border border-orange-200/90 bg-orange-50/40 pl-4 pr-10 text-sm sm:text-base font-bold text-foreground shadow-xs transition hover:bg-orange-50/60 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id} className="py-2 text-foreground font-medium">
                {s.fullName} — {s.schoolName} ({s.isBinaan ? "Binaan Saya" : `Wilayah ${s.wilayah}`})
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-orange-600">
            <ChevronDown className="size-5" />
          </div>
        </div>
      </div>

      {selectedStudent && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* 2. PROFIL RINGKAS SISWA TERPILIH */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 rounded-3xl bg-white/90 p-5 sm:p-6 shadow-md backdrop-blur-md border border-orange-100/80">
            <div className="flex size-14 sm:size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 font-extrabold text-xl sm:text-2xl text-white shadow-md shadow-orange-500/20">
              {selectedStudent.fullName
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0])
                .join("")
                .toUpperCase()}
            </div>

            <div className="flex flex-1 flex-col items-center sm:items-start text-center sm:text-left gap-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-black text-foreground truncate max-w-full">
                {selectedStudent.fullName}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
                <span className="text-foreground font-bold">{selectedStudent.schoolName}</span>
                <span>•</span>
                <span className="rounded-md bg-orange-100/80 px-2 py-0.5 text-xs font-bold text-orange-900">
                  {selectedStudent.gradeLevel}
                </span>
                <span>•</span>
                <span>NIK: {selectedStudent.nik}</span>
              </p>
            </div>
          </div>

          {/* 3. KARTU NILAI AWAL PENDAFTARAN */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/5 p-5 sm:p-6 border border-orange-200 shadow-sm backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-md shadow-orange-500/25">
                  <BookOpen className="size-6" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-950">
                    Nilai Awal Pendaftaran
                  </span>
                  <h4 className="text-sm sm:text-base font-extrabold text-foreground">
                    Nilai Rata-rata Rapor / IPK Awal
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Data nilai yang tercatat saat calon adik asuh pertama kali melakukan pendaftaran.
                  </p>
                </div>
              </div>

              <div className="self-end sm:self-center flex items-baseline gap-1.5 rounded-2xl bg-white px-5 py-3 shadow-sm border border-orange-200">
                <span className="text-xs font-bold text-muted-foreground">Skor:</span>
                <span className="text-2xl sm:text-3xl font-black text-orange-600">
                  {selectedStudent.nilaiAwal || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* 4. RIWAYAT UPDATE NILAI & RAPOR BERKALA */}
          <div className="flex flex-col gap-4 rounded-3xl bg-white/90 p-5 sm:p-6 shadow-md backdrop-blur-md border border-orange-100/80">
            <div className="flex items-center justify-between border-b border-orange-100/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <Clock className="size-4" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-extrabold text-foreground">
                    Riwayat Pembaruan Nilai & Rapor
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Pembaruan nilai berkala yang diunggah oleh adik asuh per semester
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
                {selectedStudent.academicUpdates.length} Pembaruan
              </span>
            </div>

            {/* List Riwayat / Kondisi Kosong */}
            {selectedStudent.academicUpdates.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-400 border border-orange-200/60">
                  <FileText className="size-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">
                    Belum ada update nilai/rapor sejak pendaftaran
                  </p>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    Siswa ini belum mengunggah nilai semester baru. Pembaruan akan tampil otomatis di sini setelah diinput oleh siswa.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                {selectedStudent.academicUpdates.map((update, idx) => (
                  <div
                    key={update.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-orange-200/70 bg-orange-50/30 p-4 transition hover:bg-orange-50/60 shadow-xs"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="rounded-lg bg-orange-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-2xs">
                          {update.kelasSaatItu}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                          <Calendar className="size-3 text-orange-500" />
                          {update.tanggalInput}
                        </span>
                        {idx === 0 && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                            Terbaru
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-medium text-muted-foreground">Nilai Rata-rata / IPK:</span>
                        <span className="text-base font-extrabold text-orange-600">
                          {update.nilaiRataRata}
                        </span>
                      </div>

                      {update.namaSekolahBaru && (
                        <div className="flex items-center gap-1.5 text-xs text-amber-900 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80">
                          <Building2 className="size-3.5 text-amber-700" />
                          <span>Pindah / Lanjut Sekolah ke: <strong>{update.namaSekolahBaru}</strong></span>
                        </div>
                      )}
                    </div>

                    {/* Tombol Lihat Rapor Presigned URL */}
                    <div className="self-end sm:self-center shrink-0">
                      {update.dokumenRaporUrl ? (
                        <a
                          href={update.dokumenRaporUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-orange-700 hover:bg-orange-100 hover:text-orange-900 border border-orange-300 shadow-2xs transition"
                        >
                          <FileText className="size-3.5" />
                          <span>Lihat Rapor</span>
                          <ExternalLink className="size-3 opacity-70" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-muted-foreground italic">
                          Tidak ada lampiran rapor
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. NOTICE INFORMASI READ-ONLY */}
          <div className="flex items-start gap-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs leading-relaxed text-amber-950 sm:text-sm">
            <Info className="size-5 shrink-0 text-amber-600 mt-0.5" aria-hidden="true" />
            <span>
              <strong>Informasi Pengawas:</strong> Halaman ini bersifat <em>read-only</em> untuk memantau perkembangan nilai dan berkas rapor adik asuh. Pembaruan nilai berkala diinput secara mandiri oleh siswa melalui dashboard masing-masing.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
