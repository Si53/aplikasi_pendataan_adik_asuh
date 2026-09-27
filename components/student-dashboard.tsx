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
  Plus,
  Trash2,
  FileCheck,
  Check,
} from "lucide-react"
import { createStudentAcademicUpdateAction } from "@/app/actions/academic"

export type StudentAcademicUpdate = {
  id: number
  tanggalInput: string
  kelasSaatItu: string
  semester?: string | null
  nilaiRataRata: string
  namaSekolahBaru: string | null
  dokumenRaporUrl: string | null
  dokumenRaporUrls?: string[]
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
  jenjang?: string | null
  gradeLevel: string
  programAkselerasi?: boolean
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

const JENJANG_SEKOLAH_OPTIONS = ["SD", "SMP", "SMA"] as const

const KELAS_SD_OPTIONS = [
  { value: "1", label: "Kelas 1" },
  { value: "2", label: "Kelas 2" },
  { value: "3", label: "Kelas 3" },
  { value: "4", label: "Kelas 4" },
  { value: "5", label: "Kelas 5" },
  { value: "6", label: "Kelas 6" },
]

const KELAS_SMP_SMA_OPTIONS = [
  { value: "1", label: "Kelas 1" },
  { value: "2", label: "Kelas 2" },
  { value: "3", label: "Kelas 3" },
]

const KULIAH_OPTIONS = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
  "Semester 9",
  "Semester 10",
]

export function StudentDashboard({ student }: { student: StudentData }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"beranda" | "akademik" | "profil" | "dokumen">("beranda")
  const [isPending, startTransition] = useTransition()

  // 1. Kategori Pendidikan (Sekolah vs Kuliah) - Default SELALU "Sekolah"
  const [educationLevelType, setEducationLevelType] = useState<"Sekolah" | "Kuliah">("Sekolah")

  // 2. Dropdown Bertingkat & Semester untuk Sekolah
  const [jenjangSekolah, setJenjangSekolah] = useState<string>("")
  const [kelasSekolah, setKelasSekolah] = useState<string>("")
  const [semesterSekolah, setSemesterSekolah] = useState<"Ganjil" | "Genap" | "">("")

  // 3. Dropdown untuk Kuliah
  const [semesterKuliah, setSemesterKuliah] = useState<string>("Semester 1")

  // 4. Program Akselerasi (Khusus Kuliah)
  const [programAkselerasi, setProgramAkselerasi] = useState<boolean>(
    Boolean(student.programAkselerasi)
  )

  const [isPindahJenjang, setIsPindahJenjang] = useState(false)
  const [namaSekolahBaru, setNamaSekolahBaru] = useState("")
  const [nilaiRataRata, setNilaiRataRata] = useState("")

  // 5. Multi-upload Dokumen Rapor
  const [raporFiles, setRaporFiles] = useState<
    Array<{ id: string; file: File; name: string; size: number }>
  >([])
  const [fileError, setFileError] = useState("")
  const [formFeedback, setFormFeedback] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const handleLevelTypeChange = (type: "Sekolah" | "Kuliah") => {
    setEducationLevelType(type)
    setFileError("")
    setFormFeedback(null)
    if (type === "Kuliah") {
      setSemesterSekolah("")
    }
  }

  const handleJenjangSekolahChange = (val: string) => {
    setJenjangSekolah(val)
    setKelasSekolah("")
  }

  const handleAddRaporFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("")
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 15 * 1024 * 1024) {
      setFileError(`Ukuran file "${file.name}" terlalu besar (maksimal 15 MB). Silakan pilih file yang lebih kecil.`)
      e.target.value = ""
      return
    }

    try {
      const processedFile =
        file.type.startsWith("image/") && !file.type.includes("pdf") && file.size > 500 * 1024
          ? await compressImageClientSide(file)
          : file

      setRaporFiles((prev) => [
        ...prev,
        {
          id: `rapor-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          file: processedFile,
          name: file.name,
          size: processedFile.size,
        },
      ])
    } catch {
      setRaporFiles((prev) => [
        ...prev,
        {
          id: `rapor-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          file,
          name: file.name,
          size: file.size,
        },
      ])
    }
    e.target.value = ""
  }

  const handleRemoveRaporFile = (id: string) => {
    setRaporFiles((prev) => prev.filter((item) => item.id !== id))
  }

  const handleAcademicSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormFeedback(null)
    setFileError("")

    // Validasi input
    if (educationLevelType === "Sekolah") {
      if (!jenjangSekolah) {
        setFormFeedback({
          type: "error",
          text: "Silakan pilih jenjang pendidikan (SD, SMP, atau SMA).",
        })
        return
      }
      if (!kelasSekolah) {
        setFormFeedback({
          type: "error",
          text: `Silakan pilih kelas Anda saat ini (${jenjangSekolah}).`,
        })
        return
      }
      if (!semesterSekolah) {
        setFormFeedback({
          type: "error",
          text: "Silakan pilih Semester (Semester Ganjil atau Semester Genap).",
        })
        return
      }
    } else {
      if (!semesterKuliah) {
        setFormFeedback({
          type: "error",
          text: "Silakan pilih semester Anda saat ini.",
        })
        return
      }
    }

    if (!nilaiRataRata.trim()) {
      setFormFeedback({
        type: "error",
        text: educationLevelType === "Kuliah" ? "IPK Terbaru wajib diisi." : "Nilai Rata-Rata Terbaru wajib diisi.",
      })
      return
    }

    if (raporFiles.length === 0) {
      setFormFeedback({
        type: "error",
        text: "Dokumen rapor wajib diunggah (minimal 1 berkas foto/PDF).",
      })
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
    formData.append("kategoriPendidikan", educationLevelType)
    if (educationLevelType === "Sekolah") {
      formData.append("jenjang", jenjangSekolah)
      formData.append("gradeLevel", kelasSekolah)
      formData.append("semester", semesterSekolah)
      formData.append("kelasSaatItu", `Kelas ${kelasSekolah} ${jenjangSekolah}`)
    } else {
      formData.append("jenjang", "Kuliah")
      formData.append("gradeLevel", semesterKuliah)
      formData.append("kelasSaatItu", semesterKuliah)
      formData.append("programAkselerasi", programAkselerasi ? "true" : "false")
    }
    formData.append("nilaiRataRata", nilaiRataRata.trim())
    formData.append("isPindahJenjang", isPindahJenjang ? "true" : "false")
    if (isPindahJenjang && namaSekolahBaru.trim()) {
      formData.append("namaSekolahBaru", namaSekolahBaru.trim())
    }
    raporFiles.forEach((item) => {
      formData.append("files", item.file)
    })

    startTransition(async () => {
      const res = await createStudentAcademicUpdateAction(formData)
      if (res.success) {
        setFormFeedback({ type: "success", text: res.message })
        if (educationLevelType === "Sekolah") {
          setKelasSekolah("")
          setSemesterSekolah("")
        }
        setNilaiRataRata("")
        setIsPindahJenjang(false)
        setNamaSekolahBaru("")
        setRaporFiles([])
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
                sizes="(max-width: 768px) 200px, 200px"
                className="object-contain"
              />
            </div>

            {/* Sisi Kanan: Teks Sambutan Hangat & Profil Singkat */}
            <div className="flex flex-1 flex-col gap-3 text-left">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                  <Sparkles className="size-3.5 text-orange-600" />
                  PORTAL ADIK ASUH
                </span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  Aktif
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                  Halo, {student.fullName}!
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                  Selamat datang di portal informasi beasiswa adik asuh Vihara Vimala Dharma. Tetap semangat dalam menuntut ilmu dan meraih cita-citamu!
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-orange-100/80">
                <div className="rounded-2xl bg-orange-50/60 p-3 border border-orange-100/80">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Jenjang & Kelas</p>
                  <p className="text-sm font-black text-foreground truncate mt-0.5">{student.gradeLevel || "-"}</p>
                </div>
                <div className="rounded-2xl bg-orange-50/60 p-3 border border-orange-100/80">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Wilayah Asal</p>
                  <p className="text-sm font-black text-foreground truncate mt-0.5">{student.wilayah || "-"}</p>
                </div>
                <div className="col-span-2 sm:col-span-1 rounded-2xl bg-orange-50/60 p-3 border border-orange-100/80">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Nilai Rata-rata</p>
                  <p className="text-sm font-black text-orange-600 truncate mt-0.5">{student.nilaiRataRata || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Kartu Profil Singkat & Pengawas Pendamping */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Sekolah / Institusi */}
            <div className="rounded-3xl bg-white/95 p-5 shadow-md backdrop-blur-md border border-orange-100/90 flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-2xs">
                  <Building2 className="size-5.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Institusi Pendidikan</h3>
                  <p className="text-base sm:text-lg font-black text-foreground mt-0.5">{student.schoolName || "-"}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-orange-100/80 flex items-center justify-between text-xs text-muted-foreground">
                <span>Tingkat: <strong className="text-foreground">{student.gradeLevel}</strong></span>
                <span>Cita-cita: <strong className="text-orange-600">{student.citaCita || "-"}</strong></span>
              </div>
            </div>

            {/* Pengawas Pendamping */}
            <div className="rounded-3xl bg-white/95 p-5 shadow-md backdrop-blur-md border border-orange-100/90 flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-2xs">
                  <UserRound className="size-5.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Kakak Pengawas</h3>
                  <p className="text-base sm:text-lg font-black text-foreground mt-0.5">{student.pengawasName}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-orange-100/80 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3 text-orange-500" /> Wilayah {student.wilayah}
                </span>
                <span className="text-emerald-600 font-bold">Siap Mendampingi</span>
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

            <form onSubmit={handleAcademicSubmit} className="flex flex-col gap-4.5">
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

              {/* 1. Radio Button: Sekolah vs Kuliah */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold text-orange-950/80">
                  Kategori Pendidikan <span className="text-red-500 font-extrabold">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Pilih Kategori Pendidikan">
                  {(["Sekolah", "Kuliah"] as const).map((lvl) => {
                    const isSelected = educationLevelType === lvl
                    return (
                      <label
                        key={lvl}
                        className={`flex items-center gap-3 rounded-2xl border p-3.5 transition cursor-pointer shadow-xs select-none ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/80 text-orange-950 font-bold ring-2 ring-orange-500/20"
                            : "border-orange-200/60 bg-white/90 text-foreground hover:bg-orange-50/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="educationLevelType"
                          value={lvl}
                          checked={isSelected}
                          onChange={() => handleLevelTypeChange(lvl)}
                          className="sr-only"
                        />
                        <div
                          className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                            isSelected
                              ? "border-orange-500 bg-orange-500"
                              : "border-stone-300 bg-white"
                          }`}
                        >
                          {isSelected && <span className="size-2 rounded-full bg-white shadow-xs" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs sm:text-sm font-bold">{lvl}</span>
                          <span className="text-[10px] text-muted-foreground font-normal">
                            {lvl === "Sekolah" ? "SD, SMP, atau SMA" : "Perguruan Tinggi / Universitas"}
                          </span>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* 2. DROPDOWN PILIHAN TINGKAT & SEMESTER */}
              {educationLevelType === "Sekolah" ? (
                <div className="flex flex-col gap-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Dropdown 1 - Jenjang */}
                    <div className="flex flex-col gap-1.5 text-left">
                      <label htmlFor="jenjangSekolah" className="text-xs font-bold text-orange-950/80">
                        Jenjang Sekolah <span className="text-red-500 font-extrabold">*</span>
                      </label>
                      <select
                        id="jenjangSekolah"
                        value={jenjangSekolah}
                        onChange={(e) => handleJenjangSekolahChange(e.target.value)}
                        className="h-12 w-full rounded-2xl border border-orange-200/80 bg-white px-4 text-sm font-semibold text-foreground focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer shadow-xs"
                        required
                      >
                        <option value="">-- Pilih Jenjang (SD / SMP / SMA) --</option>
                        {JENJANG_SEKOLAH_OPTIONS.map((j) => (
                          <option key={j} value={j}>
                            {j}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Dropdown 2 - Kelas (Muncul SETELAH Dropdown 1 dipilih) */}
                    {jenjangSekolah ? (
                      <div className="flex flex-col gap-1.5 text-left animate-in fade-in slide-in-from-top-1 duration-200">
                        <label htmlFor="kelasSekolah" className="text-xs font-bold text-orange-950/80">
                          Kelas ({jenjangSekolah}) <span className="text-red-500 font-extrabold">*</span>
                        </label>
                        <select
                          id="kelasSekolah"
                          value={kelasSekolah}
                          onChange={(e) => setKelasSekolah(e.target.value)}
                          className="h-12 w-full rounded-2xl border border-orange-200/80 bg-white px-4 text-sm font-semibold text-foreground focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer shadow-xs"
                          required
                        >
                          <option value="">-- Pilih Kelas ({jenjangSekolah}) --</option>
                          {(jenjangSekolah === "SD" ? KELAS_SD_OPTIONS : KELAS_SMP_SMA_OPTIONS).map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="hidden sm:flex flex-col justify-end pb-3 text-xs text-muted-foreground italic">
                        Pilih jenjang sekolah terlebih dahulu untuk memilih kelas.
                      </div>
                    )}
                  </div>

                  {/* Tombol Pilihan Semester (Khusus Sekolah - Button Group Pill-Shape) */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-xs font-bold text-orange-950/80">
                      Semester <span className="text-red-500 font-extrabold">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Pilih Semester">
                      {(["Ganjil", "Genap"] as const).map((sem) => {
                        const isSelected = semesterSekolah === sem
                        return (
                          <button
                            key={sem}
                            type="button"
                            onClick={() => setSemesterSekolah(sem)}
                            className={`h-11 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer border shadow-xs ${
                              isSelected
                                ? "border-orange-500 bg-orange-500 text-white shadow-orange-500/20"
                                : "border-orange-200/80 bg-white text-foreground hover:bg-orange-50/50"
                            }`}
                          >
                            Semester {sem}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* Dropdown Semester untuk Kuliah */
                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="semesterKuliah" className="text-xs font-bold text-orange-950/80">
                    Semester Saat Ini <span className="text-red-500 font-extrabold">*</span>
                  </label>
                  <select
                    id="semesterKuliah"
                    value={semesterKuliah}
                    onChange={(e) => setSemesterKuliah(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-orange-200/80 bg-white px-4 text-sm font-semibold text-foreground focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer shadow-xs"
                    required
                  >
                    <option value="">-- Pilih Semester --</option>
                    {KULIAH_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* 2b. Checkbox Program Akselerasi (Khusus Kuliah) */}
              {educationLevelType === "Kuliah" && (
                <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-4 transition animate-in fade-in slide-in-from-top-2 duration-200 shadow-xs">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={programAkselerasi}
                      onChange={(e) => setProgramAkselerasi(e.target.checked)}
                      className="mt-0.5 size-4 rounded-md border-purple-300 text-purple-600 focus:ring-purple-500/20 cursor-pointer"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs sm:text-sm font-bold text-purple-950 block">
                        Saya mengikuti program percepatan 1 Tahun 3 Semester
                      </span>
                      <span className="text-[11px] text-purple-700 block">
                        Centang opsi ini jika kampus kamu menerapkan kurikulum akselerasi/trimester (3 semester per tahun akademik).
                      </span>
                    </div>
                  </label>
                </div>
              )}

              {/* 3. Checkbox Pindah Jenjang Sekolah */}
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
                      Saya pindah jenjang sekolah / kampus baru (misal dari SD ke SMP, SMP ke SMA, SMA ke Kuliah)
                    </span>
                    <span className="text-[11px] text-muted-foreground block">
                      Centang opsi ini jika kamu melanjutkan ke sekolah/universitas yang baru.
                    </span>
                  </div>
                </label>

                {/* 3b. Nama Sekolah Baru (Muncul jika checkbox dicentang) */}
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

              {/* 4. Nilai Rata-Rata / IPK Terbaru */}
              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="nilaiRataRata" className="text-xs font-bold text-orange-950/80">
                  {educationLevelType === "Kuliah" ? "IPK Terbaru" : "Nilai Rata-Rata Terbaru"}{" "}
                  <span className="text-red-500 font-extrabold">*</span>
                </label>
                <input
                  id="nilaiRataRata"
                  type="text"
                  value={nilaiRataRata}
                  onChange={(e) => setNilaiRataRata(e.target.value)}
                  placeholder={
                    educationLevelType === "Kuliah"
                      ? "Contoh: 3.75 (Skala IPK 0.00 - 4.00)"
                      : "Contoh: 85.5 (Skala Rapor 0 - 100)"
                  }
                  className="h-12 w-full rounded-2xl border border-orange-200/80 bg-orange-50/30 px-4 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-xs"
                  required
                />
              </div>

              {/* 5. Upload Dokumen Rapor (WAJIB - MULTI-UPLOAD) */}
              <div className="flex flex-col gap-3 rounded-2xl border border-orange-200/80 bg-orange-50/30 p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-orange-950/80 block">
                      Dokumen Rapor / KHS / Transkrip <span className="text-red-500 font-extrabold">*</span>
                    </label>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Wajib — Unggah foto halaman rapor atau KHS semester terbaru (dapat lebih dari 1 file).
                    </p>
                  </div>
                  <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-bold text-orange-800 border border-orange-200 shrink-0">
                    Wajib
                  </span>
                </div>

                {/* Daftar File Rapor Terpilih */}
                {raporFiles.length > 0 && (
                  <div className="space-y-2 pt-1">
                    {raporFiles.map((item, idx) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-2 rounded-xl border border-orange-200/80 bg-white p-3 shadow-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
                            <FileCheck className="size-4 text-emerald-600" />
                          </div>
                          <div className="min-w-0 space-y-0.5">
                            <p className="text-xs font-semibold text-foreground truncate max-w-xs sm:max-w-md">
                              {idx + 1}. {item.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              Ukuran: {(item.size / 1024).toFixed(0)} KB • Siap diunggah
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveRaporFile(item.id)}
                          className="size-8 p-0 text-muted-foreground hover:text-destructive hover:bg-red-50 rounded-lg shrink-0 flex items-center justify-center cursor-pointer transition"
                          title="Hapus file ini"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tombol Tambah File Rapor */}
                <div>
                  <input
                    id="dokumenRaporInput"
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleAddRaporFile}
                  />
                  <label
                    htmlFor="dokumenRaporInput"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-500 bg-orange-500/10 px-4 py-2.5 text-xs sm:text-sm font-bold text-orange-700 hover:bg-orange-500/20 cursor-pointer transition shadow-xs"
                  >
                    <Plus className="size-4 text-orange-600" />
                    <span>Tambah File Rapor</span>
                  </label>
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
                          {update.semester
                            ? `${update.kelasSaatItu} - Semester ${update.semester}`
                            : update.kelasSaatItu}
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

                    {/* Tombol Lihat Rapor Presigned URL(s) */}
                    <div className="self-end sm:self-center shrink-0 flex flex-wrap items-center gap-2">
                      {update.dokumenRaporUrls && update.dokumenRaporUrls.length > 0 ? (
                        update.dokumenRaporUrls.map((url, urlIdx) => (
                          <a
                            key={urlIdx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-1.5 text-xs font-bold text-orange-700 hover:bg-orange-100 hover:text-orange-900 border border-orange-300 shadow-2xs transition"
                          >
                            <FileText className="size-3.5" />
                            <span>
                              {update.dokumenRaporUrls && update.dokumenRaporUrls.length > 1
                                ? `Rapor ${urlIdx + 1}`
                                : "Lihat Rapor"}
                            </span>
                            <ExternalLink className="size-3 opacity-70" />
                          </a>
                        ))
                      ) : update.dokumenRaporUrl ? (
                        <a
                          href={update.dokumenRaporUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-1.5 text-xs font-bold text-orange-700 hover:bg-orange-100 hover:text-orange-900 border border-orange-300 shadow-2xs transition"
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
              <Info
                label="Nomor Induk Kependudukan (NIK)"
                value={
                  student.nik
                    ? student.nik.trim().length <= 4
                      ? student.nik
                      : "*".repeat(Math.max(12, student.nik.trim().length - 4)) +
                        student.nik.trim().slice(-4)
                    : "-"
                }
              />
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

          {/* Data Orang Tua & Wali (Hanya Menampilkan Nama) */}
          <div className="rounded-3xl bg-white/90 p-5 sm:p-6 shadow-md backdrop-blur-md border border-orange-100/80 flex flex-col gap-3">
            <h3 className="text-base font-bold text-foreground">Data Orang Tua & Wali</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <Info label="Nama Ayah" value={student.father?.name || "-"} />
              <Info label="Nama Ibu" value={student.mother?.name || "-"} />
              {student.guardian?.name && student.guardian.name.trim() !== "" && student.guardian.name.trim() !== "-" && (
                <div className="sm:col-span-2">
                  <Info label="Nama Wali" value={student.guardian.name} />
                </div>
              )}
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
