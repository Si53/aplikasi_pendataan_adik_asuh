"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  FileText,
  Home,
  MessageCircle,
  UserRound,
  ExternalLink,
  Download,
  MapPin,
  Sparkles,
  GraduationCap,
  BookOpen,
  UploadCloud,
  Calendar,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  X,
  Clock,
} from "lucide-react"
import { createStudentAcademicUpdateAction } from "@/app/actions/academic"

export type StudentAcademicUpdate = {
  id: number
  tanggalInput: string
  kelasSaatItu: string
  nilaiRataRata: string
  namaSekolahBaru: string | null
  dokumenRaporUrl: string | null
}

export type StudentData = {
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
  academicUpdates: StudentAcademicUpdate[]
}

export function StudentDashboard({ student }: { student: StudentData }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"beranda" | "akademik" | "profil" | "dokumen">("beranda")
  const [isPending, startTransition] = useTransition()

  // Form State untuk Update Nilai & Rapor
  const defaultKelas =
    student.academicUpdates && student.academicUpdates.length > 0
      ? student.academicUpdates[0].kelasSaatItu
      : student.gradeLevel || ""

  const [kelasSaatItu, setKelasSaatItu] = useState(defaultKelas)
  const [isPindahJenjang, setIsPindahJenjang] = useState(false)
  const [namaSekolahBaru, setNamaSekolahBaru] = useState("")
  const [nilaiRataRata, setNilaiRataRata] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState("")
  const [formFeedback, setFormFeedback] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("")
    const file = e.target.files?.[0]
    if (!file) {
      setSelectedFile(null)
      return
    }

    if (file.size > 15 * 1024 * 1024) {
      setFileError(`Ukuran file "${file.name}" terlalu besar (maksimal 15 MB). Silakan pilih file yang lebih kecil.`)
      setSelectedFile(null)
      return
    }

    try {
      if (file.type.startsWith("image/") && !file.type.includes("pdf") && file.size > 500 * 1024) {
        const compressed = await compressImageClientSide(file)
        setSelectedFile(compressed)
      } else {
        setSelectedFile(file)
      }
    } catch {
      setSelectedFile(file)
    }
  }

  const handleAcademicSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormFeedback(null)
    setFileError("")

    // Validasi input
    if (!kelasSaatItu.trim()) {
      setFormFeedback({ type: "error", text: "Kelas / Tingkat Saat Ini wajib diisi." })
      return
    }

    if (!nilaiRataRata.trim()) {
      setFormFeedback({ type: "error", text: "Nilai Rata-Rata / IPK Terbaru wajib diisi." })
      return
    }

    if (isPindahJenjang && !namaSekolahBaru.trim()) {
      setFormFeedback({
        type: "error",
        text: "Nama Sekolah / Kampus Baru wajib diisi karena Anda mencentang opsi pindah jenjang.",
      })
      return
    }

    const formData = new FormData()
    formData.append("kelasSaatItu", kelasSaatItu.trim())
    formData.append("nilaiRataRata", nilaiRataRata.trim())
    formData.append("isPindahJenjang", isPindahJenjang ? "true" : "false")
    if (isPindahJenjang && namaSekolahBaru.trim()) {
      formData.append("namaSekolahBaru", namaSekolahBaru.trim())
    }
    if (selectedFile) {
      formData.append("file", selectedFile)
    }

    startTransition(async () => {
      const res = await createStudentAcademicUpdateAction(formData)
      if (res.success) {
        setFormFeedback({ type: "success", text: res.message })
        setNilaiRataRata("")
        setIsPindahJenjang(false)
        setNamaSekolahBaru("")
        setSelectedFile(null)
        router.refresh()
      } else {
        setFormFeedback({ type: "error", text: res.error })
      }
    })
  }

  const totalCost = student.educationCosts.reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="flex flex-col gap-6">
      {/* ============================================================ */}
      {/* 1. KONTEN TAB BERANDA ====================================== */}
      {/* ============================================================ */}
      {activeTab === "beranda" && (
        <section className="flex flex-col gap-5 animate-in fade-in duration-200">
          {/* Kartu "Selamat Datang" dengan Gambar Ilustrasi Biksu & Anak */}
          <div className="flex flex-col md:flex-row items-center gap-6 rounded-3xl bg-white/95 p-6 shadow-xl backdrop-blur-md border border-orange-100/90">
            {/* Sisi Kiri: Gambar Ilustrasi */}
            <div className="relative w-full max-w-[200px] h-[260px] shrink-0 overflow-hidden rounded-2xl shadow-sm border border-orange-100/80 bg-amber-50">
              <Image
                src="/illustrasi-biksu-anak.png"
                alt="Ilustrasi Biksu dan Anak"
                fill
                priority
                sizes="(max-width: 768px) 200px, 220px"
                className="object-cover"
              />
            </div>

            {/* Sisi Kanan: Teks Sambutan & Info Pengawas */}
            <div className="flex flex-1 flex-col justify-center text-center md:text-left gap-3 w-full">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800">
                  <Sparkles className="size-3" /> Program Bantuan Dana Pendidikan
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  Selamat datang di Program Adik Asuh!
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground font-medium">
                  Bersama Vihara Vimala Dharma, raih cita-cita setinggi mungkin melalui
                  pendidikan yang berkelanjutan.
                </p>
              </div>

              {/* Info Pengawas Pendamping Asli dari Relasi Database */}
              <div className="rounded-2xl bg-orange-50/80 p-4 border border-orange-200/80 text-left">
                <span className="text-xs font-bold text-orange-900 block">
                  Pengawas Pendamping Wilayah {student.wilayah}:
                </span>
                <p className="mt-1 text-base sm:text-lg font-extrabold text-orange-600 flex items-center gap-1.5">
                  <MapPin className="size-4 shrink-0 text-orange-500" />
                  <span>{student.pengawasName}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Action Card: Update Nilai & Rapor Semester */}
          <div className="relative overflow-hidden rounded-3xl border border-orange-200/80 bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 p-5 sm:p-6 text-white shadow-lg shadow-orange-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-inner">
                <GraduationCap className="size-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/25 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                    Pembaruan Berkala
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Update Nilai & Rapor Semester
                </h3>
                <p className="text-xs sm:text-sm text-white/90 max-w-md">
                  Perbarui kelas, nilai rapor semester terbaru, atau pindah sekolah agar terpantau oleh Kakak Asuh & Pengawas.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("akademik")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs sm:text-sm font-black text-orange-600 hover:bg-orange-50 transition shadow-sm shrink-0 cursor-pointer active:scale-95 self-start sm:self-auto"
            >
              <span>Update Nilai Sekarang</span>
              <ArrowRight className="size-4" />
            </button>
          </div>

          {/* Tombol Hijau Besar Full-Width (WhatsApp) */}
          <a
            href="https://wa.me/6282129741793"
            target="_blank"
            rel="noreferrer"
            className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 hover:from-emerald-700 hover:to-green-600 px-6 text-base font-extrabold text-white shadow-lg shadow-emerald-600/25 active:scale-[0.98] transition duration-200 cursor-pointer"
          >
            <MessageCircle className="size-5" />
            <span>Hubungi Kakak Asuh (WhatsApp)</span>
          </a>
        </section>
      )}

      {/* ============================================================ */}
      {/* 2. KONTEN TAB AKADEMIK (UPDATE NILAI & RAPOR) =============== */}
      {/* ============================================================ */}
      {activeTab === "akademik" && (
        <section className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-l-4 border-orange-500 pl-3">
            <div>
              <h2 className="text-xl font-black text-foreground">Pembaruan Akademik & Rapor</h2>
              <span className="text-xs text-muted-foreground">
                Laporkan perkembangan nilai semester dan berkas rapor kamu secara berkala
              </span>
            </div>
          </div>

          {/* FORM INPUT UPDATE NILAI & RAPOR */}
          <div className="rounded-3xl bg-white/95 p-5 sm:p-7 shadow-md backdrop-blur-md border border-orange-100/90">
            <div className="flex items-center gap-2.5 border-b border-orange-100/80 pb-4 mb-5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <BookOpen className="size-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-foreground">
                  Formulir Pembaruan Semester
                </h3>
                <p className="text-xs text-muted-foreground">
                  Kamu bisa mengisi formulir ini setiap kali menerima hasil nilai/rapor baru
                </p>
              </div>
            </div>

            <form onSubmit={handleAcademicSubmit} className="flex flex-col gap-4">
              {/* Feedback Alert */}
              {formFeedback && (
                <div
                  role="alert"
                  className={`flex items-start gap-2.5 rounded-2xl p-4 text-xs sm:text-sm font-medium leading-relaxed border ${
                    formFeedback.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-destructive/10 text-destructive border-destructive/20"
                  }`}
                >
                  {formFeedback.type === "success" ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                  )}
                  <span>{formFeedback.text}</span>
                </div>
              )}

              {/* Field 1: Kelas / Tingkat Saat Ini */}
              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="kelasSaatItu" className="text-xs font-bold text-orange-950/80">
                  Kelas / Tingkat Saat Ini <span className="text-red-500 font-extrabold">*</span>
                </label>
                <input
                  id="kelasSaatItu"
                  type="text"
                  value={kelasSaatItu}
                  onChange={(e) => setKelasSaatItu(e.target.value)}
                  placeholder="Contoh: Kelas 8 SMP atau Semester 3"
                  className="h-12 w-full rounded-2xl border border-orange-200/80 bg-orange-50/30 px-4 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  required
                />
              </div>

              {/* Field 2: Checkbox Pindah Jenjang Sekolah */}
              <div className="rounded-2xl border border-orange-200/70 bg-orange-50/40 p-4 transition">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPindahJenjang}
                    onChange={(e) => setIsPindahJenjang(e.target.checked)}
                    className="mt-0.5 size-4 rounded-md border-orange-300 text-orange-600 focus:ring-orange-500/20"
                  />
                  <div className="space-y-0.5">
                    <span className="text-xs sm:text-sm font-bold text-foreground block">
                      Saya pindah jenjang sekolah baru (misal dari SD ke SMP, SMP ke SMA, dll)
                    </span>
                    <span className="text-[11px] text-muted-foreground block">
                      Centang opsi ini jika kamu melanjutkan ke sekolah/universitas yang baru.
                    </span>
                  </div>
                </label>

                {/* Field 2b: Nama Sekolah Baru (Muncul jika checkbox dicentang) */}
                {isPindahJenjang && (
                  <div className="mt-3 pt-3 border-t border-orange-200/60 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <label htmlFor="namaSekolahBaru" className="text-xs font-bold text-orange-950/80 flex items-center gap-1.5">
                      <Building2 className="size-3.5 text-orange-600" />
                      <span>Nama Sekolah / Kampus Baru</span>
                      <span className="text-red-500 font-extrabold">*</span>
                    </label>
                    <input
                      id="namaSekolahBaru"
                      type="text"
                      value={namaSekolahBaru}
                      onChange={(e) => setNamaSekolahBaru(e.target.value)}
                      placeholder="Contoh: SMP Negeri 1 Pati atau Universitas Diponegoro"
                      className="h-12 w-full rounded-2xl border border-orange-200/80 bg-white px-4 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      required={isPindahJenjang}
                    />
                  </div>
                )}
              </div>

              {/* Field 3: Nilai Rata-Rata Terbaru */}
              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="nilaiRataRata" className="text-xs font-bold text-orange-950/80">
                  Nilai Rata-Rata / IPK Terbaru <span className="text-red-500 font-extrabold">*</span>
                </label>
                <input
                  id="nilaiRataRata"
                  type="text"
                  value={nilaiRataRata}
                  onChange={(e) => setNilaiRataRata(e.target.value)}
                  placeholder="Contoh: 88.5 atau 3.75"
                  className="h-12 w-full rounded-2xl border border-orange-200/80 bg-orange-50/30 px-4 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  required
                />
              </div>

              {/* Field 4: Upload Dokumen Rapor (Opsional) */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold text-orange-950/80 flex items-center justify-between">
                  <span>Upload Dokumen Rapor (Opsional)</span>
                  <span className="text-[11px] font-normal text-muted-foreground">Format JPG/PNG/PDF (Maks 15 MB)</span>
                </label>

                <div className="relative">
                  <input
                    id="dokumenRaporInput"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                  <label
                    htmlFor="dokumenRaporInput"
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-orange-200/90 bg-orange-50/30 p-4 text-center cursor-pointer hover:bg-orange-50/60 hover:border-orange-300 transition"
                  >
                    <UploadCloud className="size-6 text-orange-500" />
                    <span className="text-xs font-bold text-orange-800">
                      {selectedFile ? selectedFile.name : "Klik untuk pilih foto rapor atau dokumen PDF"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {selectedFile
                        ? `Ukuran: ${(selectedFile.size / 1024).toFixed(0)} KB • Klik untuk ganti file`
                        : "Bisa foto langsung dari HP atau upload scan PDF"}
                    </span>
                  </label>

                  {selectedFile && (
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="absolute right-3 top-3 rounded-full bg-stone-100 p-1 text-stone-500 hover:bg-stone-200 hover:text-stone-800"
                      aria-label="Hapus file terpilih"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                {fileError && (
                  <p className="text-xs text-destructive font-medium">{fileError}</p>
                )}
              </div>

              {/* Tombol Simpan Update */}
              <button
                type="submit"
                disabled={isPending}
                className="mt-2 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 px-6 text-sm sm:text-base font-extrabold text-white shadow-lg shadow-orange-500/25 transition duration-200 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-5 animate-spin" /> Menyimpan Update...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="size-5" /> Simpan Update
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* RIWAYAT UPDATE NILAI & RAPOR BERKALA */}
          <div className="flex flex-col gap-4 rounded-3xl bg-white/95 p-5 sm:p-6 shadow-md backdrop-blur-md border border-orange-100/90">
            <div className="flex items-center justify-between border-b border-orange-100/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <Clock className="size-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-foreground">
                    Riwayat Pembaruan Nilai Kamu
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Daftar seluruh laporan semester yang pernah kamu kirimkan
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
                {student.academicUpdates ? student.academicUpdates.length : 0} Laporan
              </span>
            </div>

            {/* List Riwayat / Kondisi Kosong */}
            {!student.academicUpdates || student.academicUpdates.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-400 border border-orange-200/60">
                  <FileText className="size-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">
                    Belum ada riwayat update nilai
                  </p>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    Isi formulir di atas untuk mengirimkan laporan nilai semester pertamamu.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                {student.academicUpdates.map((update, idx) => (
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
                          Tidak ada lampiran berkas
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 3. KONTEN TAB PROFIL SAYA ================================== */}
      {/* ============================================================ */}
      {activeTab === "profil" && (
        <section className="flex flex-col gap-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-l-4 border-orange-500 pl-3">
            <div>
              <h2 className="text-xl font-black text-foreground">Profil Saya</h2>
              <span className="text-xs text-muted-foreground">Informasi pribadi dan data pendaftaran</span>
            </div>
          </div>

          {/* Quick link button ke tab Akademik */}
          <div className="flex items-center justify-between gap-3 p-4 rounded-3xl bg-gradient-to-r from-orange-100 via-amber-50 to-orange-100 border border-orange-200 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
                <GraduationCap className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                  Pindah jenjang atau naik kelas baru?
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  Perbarui nilai dan kelas kamu secara berkala
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("akademik")}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-orange-500 px-3.5 py-2 text-xs font-bold text-white hover:bg-orange-600 transition shadow-xs shrink-0 cursor-pointer"
            >
              <span>Update Nilai</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>

          {/* Data Pribadi & Kontak */}
          <div className="rounded-3xl bg-white/90 p-5 sm:p-6 shadow-md backdrop-blur-md border border-orange-100/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <Info label="Nomor Induk Kependudukan (NIK)" value={student.nik} />
              <Info label="Tanggal Lahir" value={student.dateOfBirth} />
              <Info label="Jenis Kelamin" value={student.gender} />
              <Info label="Cita-cita" value={student.citaCita} />
              <Info label="Sekolah / Universitas" value={student.schoolName} />
              <Info label="Kelas / Tingkat" value={student.gradeLevel} />
              <Info label="Nilai Rata-rata / IPK" value={student.nilaiRataRata} />
              <Info label="Nomor WhatsApp" value={student.noHp} />
              <Info label="Wilayah" value={student.wilayah} />
              <Info label="Jumlah Saudara" value={`${student.jumlahSaudara} orang`} />
              <div className="sm:col-span-2">
                <Info label="Alamat Lengkap" value={student.alamatLengkap} />
              </div>
              <div className="sm:col-span-2">
                <Info label="Riwayat Penyakit" value={student.riwayatPenyakit} />
              </div>
            </div>
          </div>

          {/* Rincian Biaya Pendidikan */}
          {student.educationCosts.length > 0 && (
            <div className="rounded-3xl bg-white/90 p-5 sm:p-6 shadow-md backdrop-blur-md border border-orange-100/80 flex flex-col gap-3">
              <h3 className="text-base font-bold text-foreground">Rincian Kebutuhan Biaya</h3>
              <div className="flex flex-col divide-y divide-border/60 text-sm">
                {student.educationCosts.map((cost) => (
                  <div key={cost.id} className="flex justify-between py-2">
                    <span className="text-muted-foreground">{cost.label}</span>
                    <span className="font-bold text-foreground">
                      Rp {cost.amount.toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
                <div className="mt-1 flex justify-between pt-2 text-base font-extrabold text-orange-600">
                  <span>Total Estimasi Biaya</span>
                  <span>Rp {totalCost.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ============================================================ */}
      {/* 4. KONTEN TAB DOKUMEN SAYA ================================= */}
      {/* ============================================================ */}
      {activeTab === "dokumen" && (
        <section className="flex flex-col gap-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-l-4 border-orange-500 pl-3">
            <div>
              <h2 className="text-xl font-black text-foreground">Dokumen Saya</h2>
              <span className="text-xs text-muted-foreground">Berkas persyaratan yang telah diunggah</span>
            </div>
          </div>

          <div className="rounded-3xl bg-white/90 p-5 sm:p-6 shadow-md backdrop-blur-md border border-orange-100/80">
            <div className="flex flex-col gap-3">
              {student.documents.length ? (
                student.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-orange-50/60 p-4 border border-orange-200/60 transition hover:bg-orange-50/90"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {doc.type === "FOTO_ANAK" && doc.fileUrl ? (
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border-2 border-orange-300 bg-amber-100 shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={doc.fileUrl}
                            alt="Foto Anak"
                            className="size-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-600 shadow-sm border border-orange-200/60">
                          <FileText className="size-6" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-extrabold text-sm text-foreground truncate">
                          {doc.type === "FOTO_ANAK"
                            ? "Foto Anak"
                            : doc.type === "RAPOR"
                            ? "Rapor Terakhir"
                            : doc.type === "SKTM"
                            ? "Surat Keterangan Tidak Mampu (SKTM)"
                            : doc.type === "PRESTASI"
                            ? "Sertifikat / Piagam Prestasi"
                            : "Kartu Keluarga (KK)"}
                        </p>
                        <span className="text-[11px] font-semibold text-orange-700 block">
                          Tipe: {doc.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-orange-950 shadow-sm border border-orange-200 hover:bg-orange-100/60 hover:text-orange-900 transition"
                      >
                        <ExternalLink className="size-3.5" />
                        <span>Buka / Lihat</span>
                      </a>
                      <a
                        href={doc.fileUrl}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs font-bold text-white shadow-sm hover:from-orange-600 hover:to-amber-600 transition"
                      >
                        <Download className="size-3.5" />
                        <span>Unduh</span>
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-orange-200 p-6 text-center text-sm text-muted-foreground">
                  Belum ada dokumen yang diunggah.
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 5. BOTTOM NAVIGATION BAR DENGAN 4 MENU BERWARNA ============ */}
      {/* ============================================================ */}
      <nav
        aria-label="Navigasi Bawah Dashboard"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-orange-200/80 shadow-2xl px-3 py-2 max-w-lg mx-auto sm:rounded-t-3xl"
      >
        <div className="flex items-center justify-around">
          {/* Menu 1: Beranda */}
          <button
            type="button"
            onClick={() => setActiveTab("beranda")}
            className={`flex flex-col items-center gap-0.5 px-3 sm:px-4 py-1.5 rounded-2xl transition-all duration-200 cursor-pointer ${
              activeTab === "beranda"
                ? "text-orange-600 font-extrabold bg-orange-100/90 shadow-sm border border-orange-200/60"
                : "text-muted-foreground hover:text-foreground font-medium hover:bg-orange-50/50"
            }`}
          >
            <div className={`transition-transform duration-200 ${activeTab === "beranda" ? "scale-110" : ""}`}>
              <Home className="size-5" />
            </div>
            <span className="text-[11px]">Beranda</span>
          </button>

          {/* Menu 2: Nilai & Rapor (Akademik) */}
          <button
            type="button"
            onClick={() => setActiveTab("akademik")}
            className={`flex flex-col items-center gap-0.5 px-3 sm:px-4 py-1.5 rounded-2xl transition-all duration-200 cursor-pointer ${
              activeTab === "akademik"
                ? "text-orange-600 font-extrabold bg-orange-100/90 shadow-sm border border-orange-200/60"
                : "text-muted-foreground hover:text-foreground font-medium hover:bg-orange-50/50"
            }`}
          >
            <div className={`transition-transform duration-200 ${activeTab === "akademik" ? "scale-110" : ""}`}>
              <GraduationCap className="size-5" />
            </div>
            <span className="text-[11px]">Nilai & Rapor</span>
          </button>

          {/* Menu 3: Profil */}
          <button
            type="button"
            onClick={() => setActiveTab("profil")}
            className={`flex flex-col items-center gap-0.5 px-3 sm:px-4 py-1.5 rounded-2xl transition-all duration-200 cursor-pointer ${
              activeTab === "profil"
                ? "text-orange-600 font-extrabold bg-orange-100/90 shadow-sm border border-orange-200/60"
                : "text-muted-foreground hover:text-foreground font-medium hover:bg-orange-50/50"
            }`}
          >
            <div className={`transition-transform duration-200 ${activeTab === "profil" ? "scale-110" : ""}`}>
              <UserRound className="size-5" />
            </div>
            <span className="text-[11px]">Profil</span>
          </button>

          {/* Menu 4: Dokumen */}
          <button
            type="button"
            onClick={() => setActiveTab("dokumen")}
            className={`flex flex-col items-center gap-0.5 px-3 sm:px-4 py-1.5 rounded-2xl transition-all duration-200 cursor-pointer ${
              activeTab === "dokumen"
                ? "text-orange-600 font-extrabold bg-orange-100/90 shadow-sm border border-orange-200/60"
                : "text-muted-foreground hover:text-foreground font-medium hover:bg-orange-50/50"
            }`}
          >
            <div className={`transition-transform duration-200 ${activeTab === "dokumen" ? "scale-110" : ""}`}>
              <FileText className="size-5" />
            </div>
            <span className="text-[11px]">Dokumen</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

/**
 * Kompresi gambar di sisi browser sebelum dikirim ke server.
 */
async function compressImageClientSide(file: File): Promise<File> {
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf") || file.size < 500 * 1024) {
    return file
  }

  try {
    return await new Promise<File>((resolve) => {
      const img = new window.Image()
      const url = URL.createObjectURL(file)

      img.onload = () => {
        URL.revokeObjectURL(url)
        const maxDimension = 1920
        let { width, height } = img

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          } else {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }

        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")

        if (!ctx) return resolve(file)

        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              const baseName = file.name.replace(/\.[^/.]+$/, "")
              resolve(new File([blob], `${baseName}.jpg`, { type: "image/jpeg", lastModified: Date.now() }))
            } else {
              resolve(file)
            }
          },
          "image/jpeg",
          0.82
        )
      }

      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(file)
      }

      img.src = url
    })
  } catch {
    return file
  }
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-orange-50/50 p-3.5 border border-orange-100/60">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-bold text-foreground">{value || "-"}</p>
    </div>
  )
}
