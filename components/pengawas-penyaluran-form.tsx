"use client"

import { useState, useTransition, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileText,
  ExternalLink,
  Clock,
  XCircle,
  Loader2,
  Coins,
  X,
  FileCheck,
  CheckSquare,
  Square,
  Sparkles,
  Info,
} from "lucide-react"
import { createPengawasBatchDisbursementAction } from "@/app/actions/pengawas"

export interface PengawasStudentRow {
  id: number
  fullName: string
  schoolName: string
  jenjang?: string | null
  gradeLevel: string
  formattedGrade: string
  wilayah: string
  statusPeriode: "Belum menerima" | "Menunggu verifikasi" | "Terverifikasi"
  hasRejectedPrevious: boolean
}

export interface PengawasProofHistoryItem {
  id: number
  tanggal: string
  fileUrl: string
  nominal: number | null
  status: "pending" | "verified" | "rejected" | string
  keterangan: string | null
  batchId: string | null
  processedAt: string | null
  student: {
    id: number
    fullName: string
    schoolName: string
    gradeLevel: string
    wilayah: string
  }
}

interface PengawasPenyaluranFormProps {
  students: PengawasStudentRow[]
  history: PengawasProofHistoryItem[]
  pengawasName: string
  wilayah: string
  currentPeriode: string
}

function formatNominal(val: string | number | undefined): string {
  if (!val && val !== 0) return ""
  const num = typeof val === "string" ? parseInt(val.replace(/\D/g, ""), 10) : val
  if (isNaN(num)) return ""
  return num.toLocaleString("id-ID")
}

export function PengawasPenyaluranForm({
  students,
  history,
  pengawasName: _pengawasName,
  wilayah,
  currentPeriode,
}: PengawasPenyaluranFormProps) {
  const router = useRouter()
  const isJepara = wilayah.trim().toLowerCase() === "jepara"
  const sharedFileInputRef = useRef<HTMLInputElement>(null)

  // Form states
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [nominals, setNominals] = useState<Record<number, string>>({})
  const [studentFiles, setStudentFiles] = useState<Record<number, File>>({})
  const [sharedFile, setSharedFile] = useState<File | null>(null)
  const [sharedPreview, setSharedPreview] = useState<string | null>(null)
  const [keterangan, setKeterangan] = useState<string>("")

  // Feedback states
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Siswa yang berstatus "Belum menerima" di periode ini
  const belumMenerimaStudents = students.filter(
    (s) => s.statusPeriode === "Belum menerima"
  )

  // Siswa yang dapat dipilih (bukan berstatus Menunggu atau Terverifikasi)
  const eligibleStudents = students.filter(
    (s) => s.statusPeriode === "Belum menerima"
  )

  const handleSelectAllBelum = () => {
    setErrorMessage(null)
    const allBelumIds = belumMenerimaStudents.map((s) => s.id)
    setSelectedIds((prev) => {
      // Gabungkan id belum menerima dengan yang sudah dicentang
      const combined = Array.from(new Set([...prev, ...allBelumIds]))
      return combined
    })
  }

  const handleToggleStudent = (id: number, locked: boolean) => {
    if (locked) return
    setErrorMessage(null)
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const handleToggleSelectAll = () => {
    if (selectedIds.length === eligibleStudents.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(eligibleStudents.map((s) => s.id))
    }
  }

  const handleNominalChange = (studentId: number, val: string) => {
    const raw = val.replace(/\D/g, "")
    setNominals((prev) => ({
      ...prev,
      [studentId]: raw,
    }))
  }

  const handleIndividualFileChange = (
    studentId: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setErrorMessage(null)
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage("Ukuran file terlalu besar (maksimal 15 MB).")
      return
    }

    setStudentFiles((prev) => ({
      ...prev,
      [studentId]: file,
    }))
  }

  const handleRemoveIndividualFile = (studentId: number) => {
    setStudentFiles((prev) => {
      const copy = { ...prev }
      delete copy[studentId]
      return copy
    })
  }

  const handleSharedFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null)
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage("Ukuran file bukti bersama terlalu besar (maksimal 15 MB).")
      return
    }

    setSharedFile(file)
    if (file.type.startsWith("image/")) {
      const preview = URL.createObjectURL(file)
      setSharedPreview(preview)
    } else {
      setSharedPreview(null)
    }
  }

  const handleRemoveSharedFile = () => {
    setSharedFile(null)
    if (sharedPreview) {
      URL.revokeObjectURL(sharedPreview)
      setSharedPreview(null)
    }
    if (sharedFileInputRef.current) {
      sharedFileInputRef.current.value = ""
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    // Validasi keterangan
    if (!keterangan.trim()) {
      setErrorMessage("Keterangan penyaluran dana wajib diisi.")
      return
    }

    // Validasi minimal 1 baris dicentang
    if (selectedIds.length === 0) {
      setErrorMessage("Silakan centang minimal 1 adik asuh penerima dana.")
      return
    }

    // Validasi tiap baris yang dicentang
    for (const sid of selectedIds) {
      const student = students.find((s) => s.id === sid)
      const raw = nominals[sid] ? parseInt(nominals[sid].replace(/\D/g, ""), 10) : 0
      if (!raw || raw <= 0) {
        setErrorMessage(
          `Nominal bantuan untuk ${student?.fullName || `anak ID ${sid}`} wajib diisi dan harus lebih dari Rp 0.`
        )
        return
      }

      if (!isJepara) {
        const f = studentFiles[sid]
        if (!f) {
          setErrorMessage(
            `Bukti transfer/penyerahan untuk ${student?.fullName || `anak ID ${sid}`} wajib diunggah.`
          )
          return
        }
      }
    }

    // Validasi file bersama jika Jepara
    if (isJepara && !sharedFile) {
      setErrorMessage("Foto atau dokumen bukti bersama untuk wilayah Jepara wajib diunggah.")
      return
    }

    // Siapkan FormData
    const formData = new FormData()
    formData.append("keterangan", keterangan.trim())
    for (const sid of selectedIds) {
      formData.append("studentIds", String(sid))
      formData.append(`nominal_${sid}`, nominals[sid].replace(/\D/g, ""))
      if (!isJepara && studentFiles[sid]) {
        formData.append(`file_${sid}`, studentFiles[sid])
      }
    }

    if (isJepara && sharedFile) {
      formData.append("sharedFile", sharedFile)
    }

    startTransition(async () => {
      const res = await createPengawasBatchDisbursementAction(formData)
      if (res.success) {
        setSuccessMessage(res.message)
        // Reset form
        setSelectedIds([])
        setNominals({})
        setStudentFiles({})
        setKeterangan("")
        handleRemoveSharedFile()
        router.refresh()
      } else {
        setErrorMessage(res.error || "Gagal menyimpan bukti penyaluran dana.")
      }
    })
  }

  return (
    <div className="space-y-8">
      {/* 1. Header & Periode Berjalan */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/pengawas"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/90 border border-orange-200/80 px-3 py-1 text-xs sm:text-sm font-bold text-orange-950 hover:bg-white shadow-2xs transition"
            >
              <ArrowLeft className="size-3.5 text-orange-600" />
              <span>Dashboard</span>
            </Link>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs sm:text-sm font-extrabold text-orange-800 border border-orange-200">
              Wilayah {wilayah}
            </span>
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs sm:text-sm font-black text-amber-700 border border-amber-300 flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-amber-600" />
              Periode berjalan: {currentPeriode}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight pt-1">
            Input Penyaluran Dana Beasiswa
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
            Pencatatan bukti penyerahan beasiswa untuk adik asuh binaan Anda pada{" "}
            <strong className="text-foreground">Periode {currentPeriode}</strong>.
          </p>
        </div>
      </div>

      {/* Notifikasi Sukses */}
      {successMessage && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-sm sm:text-base text-emerald-900 flex items-start justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-emerald-950">Bukti Berhasil Dikirim!</p>
              <p className="text-emerald-800 leading-relaxed">{successMessage}</p>
            </div>
          </div>
          <Link
            href="/pengawas"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-sm font-bold text-white hover:bg-emerald-500 transition shrink-0 shadow-2xs"
          >
            <span>Ke Dashboard</span>
          </Link>
        </div>
      )}

      {/* Notifikasi Error */}
      {errorMessage && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm sm:text-base text-rose-900 flex items-start gap-3 shadow-xs animate-in fade-in">
          <AlertCircle className="size-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-rose-950">Perhatian</p>
            <p className="text-rose-800">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* 2. Ringkasan "Belum Menerima Periode Ini" */}
      <div className="rounded-3xl border border-orange-200/90 bg-gradient-to-br from-white via-orange-50/30 to-amber-50/40 p-5 sm:p-6 shadow-sm backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-orange-100">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-orange-500 text-white font-black text-sm shadow-xs">
              {belumMenerimaStudents.length}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Belum Menerima Periode Ini ({belumMenerimaStudents.length} Anak)
              </h2>
              <p className="text-xs text-muted-foreground">
                Adik asuh binaan yang belum memiliki bukti penyaluran di periode {currentPeriode}
              </p>
            </div>
          </div>

          {belumMenerimaStudents.length > 0 ? (
            <button
              type="button"
              onClick={handleSelectAllBelum}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-xs transition cursor-pointer shrink-0"
            >
              <CheckSquare className="size-4" />
              <span>Pilih Semua yang Belum ({belumMenerimaStudents.length})</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              <CheckCircle2 className="size-4 text-emerald-600" />
              Lengkap
            </span>
          )}
        </div>

        {belumMenerimaStudents.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {belumMenerimaStudents.map((st) => {
              const isChecked = selectedIds.includes(st.id)
              return (
                <button
                  type="button"
                  key={st.id}
                  onClick={() => handleToggleStudent(st.id, false)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition border cursor-pointer ${
                    isChecked
                      ? "bg-orange-600 text-white border-orange-600 shadow-2xs"
                      : "bg-white text-stone-700 border-orange-200/90 hover:bg-orange-50"
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="size-3.5 text-white" />
                  ) : (
                    <Square className="size-3.5 text-stone-400" />
                  )}
                  <span>{st.fullName}</span>
                  <span
                    className={`text-[10px] font-normal ${
                      isChecked ? "text-orange-100" : "text-stone-400"
                    }`}
                  >
                    ({st.formattedGrade})
                  </span>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl bg-emerald-50/80 border border-emerald-200/90 p-4 text-sm text-emerald-900 flex items-center gap-3">
            <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
            <p className="font-semibold">
              Hebat! Seluruh adik asuh binaan Anda sudah menerima penyaluran dana beasiswa pada periode{" "}
              {currentPeriode}.
            </p>
          </div>
        )}
      </div>

      {/* 3. Form Utama: Keterangan, Bukti Bersama (Jepara), dan Tabel Input */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-3xl border border-orange-100/90 bg-white/95 p-5 sm:p-7 shadow-md backdrop-blur-md space-y-6">
          {/* A. Keterangan Wajib Diisi */}
          <div className="space-y-1.5">
            <label className="text-sm sm:text-base font-bold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="size-4 text-orange-500" />
                <span>Keterangan (uang ini untuk kapan / keperluan apa) *</span>
              </span>
              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                Wajib Diisi
              </span>
            </label>
            <input
              type="text"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Contoh: Beasiswa semester ganjil 2026"
              className="w-full h-12 rounded-2xl border border-orange-200/90 bg-orange-50/30 px-4 text-sm sm:text-base font-semibold text-foreground focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition"
              required
            />
            <p className="text-xs text-muted-foreground">
              Catatan ini disimpan ke setiap bukti penyaluran yang dibuat pada submit ini untuk keperluan audit dan pencatatan.
            </p>
          </div>

          {/* B. Khusus Wilayah Jepara: Upload Bukti Bersama di Luar Tabel */}
          {isJepara && (
            <div className="space-y-2 rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50/40 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-orange-950 font-bold text-sm sm:text-base">
                    <FileCheck className="size-4 text-orange-600" />
                    <span>Upload Foto Bukti Bersama (Khusus Wilayah Jepara) *</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Satu foto struk transfer / nota bersama yang mencakup seluruh anak yang dicentang di tabel bawah.
                  </p>
                </div>
                <span className="rounded-full bg-orange-200/70 px-2.5 py-0.5 text-[11px] font-black text-orange-900 shrink-0">
                  Mode Jepara
                </span>
              </div>

              <input
                ref={sharedFileInputRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={handleSharedFileChange}
                className="hidden"
                id="jepara-shared-file-input"
              />

              {!sharedFile ? (
                <label
                  htmlFor="jepara-shared-file-input"
                  className="mt-3 flex flex-col items-center justify-center gap-2 rounded-xl border border-orange-300/80 bg-white p-5 text-center hover:bg-orange-50 hover:border-orange-400 transition cursor-pointer"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600 shadow-2xs">
                    <UploadCloud className="size-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs sm:text-sm font-bold text-foreground">
                      Klik untuk memilih foto bukti bersama
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Mendukung JPG, PNG, WEBP, atau PDF (Maksimal 15 MB)
                    </p>
                  </div>
                </label>
              ) : (
                <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-orange-200 bg-white p-3.5 shadow-2xs">
                  <div className="flex items-center gap-3 min-w-0">
                    {sharedPreview ? (
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-orange-200 bg-stone-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sharedPreview}
                          alt="Preview Bukti Bersama"
                          className="size-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 font-bold">
                        <FileText className="size-5" />
                      </div>
                    )}
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                        {sharedFile.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        {(sharedFile.size / (1024 * 1024)).toFixed(2)} MB • Siap Digunakan Bersama
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveSharedFile}
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition cursor-pointer shrink-0"
                  >
                    <X className="size-3.5" />
                    <span>Ganti File</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* C. Header Tabel & Pilihan */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-orange-100">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <span>Daftar Adik Asuh Binaan Anda</span>
                  <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-800">
                    {students.length} Siswa
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Centang anak yang akan disalurkan dan isi nominal bantuan. Siswa yang sudah menerima di periode ini dikunci otomatis.
                </p>
              </div>

              {eligibleStudents.length > 0 && (
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 hover:text-orange-900 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl border border-orange-200 transition cursor-pointer self-start sm:self-auto"
                >
                  {selectedIds.length === eligibleStudents.length ? (
                    <>
                      <Square className="size-3.5" />
                      <span>Batal Pilih Semua</span>
                    </>
                  ) : (
                    <>
                      <CheckSquare className="size-3.5" />
                      <span>Centang Semua yang Belum</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* D. TABEL (Tampilan Desktop / Layar Lebar) */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-orange-100/90 shadow-2xs">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-orange-50/70 border-b border-orange-100 text-xs font-bold uppercase tracking-wider text-orange-900">
                    <th className="py-3 px-3 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={
                          eligibleStudents.length > 0 &&
                          selectedIds.length === eligibleStudents.length
                        }
                        onChange={handleToggleSelectAll}
                        disabled={eligibleStudents.length === 0}
                        aria-label="Pilih semua baris yang tersedia"
                        className="size-4 rounded accent-orange-600 cursor-pointer disabled:opacity-40"
                      />
                    </th>
                    <th className="py-3 px-4 min-w-[200px]">Nama Adik Asuh</th>
                    <th className="py-3 px-4 min-w-[160px]">Status Periode Ini</th>
                    <th className="py-3 px-4 min-w-[170px]">Nominal (Rp)</th>
                    <th className="py-3 px-4 min-w-[180px]">
                      {isJepara ? "Mode Bukti" : "Upload Bukti"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100/80 bg-white">
                  {students.map((st) => {
                    const isLocked =
                      st.statusPeriode === "Menunggu verifikasi" ||
                      st.statusPeriode === "Terverifikasi"
                    const isChecked = selectedIds.includes(st.id)
                    const fileObj = studentFiles[st.id]

                    return (
                      <tr
                        key={st.id}
                        className={`transition-colors ${
                          isLocked
                            ? "bg-stone-50/60 opacity-80"
                            : isChecked
                            ? "bg-orange-50/40"
                            : "hover:bg-orange-50/20"
                        }`}
                      >
                        {/* 1. Checkbox */}
                        <td className="py-3 px-3 text-center align-middle">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={isLocked}
                            onChange={() => handleToggleStudent(st.id, isLocked)}
                            aria-label={`Pilih ${st.fullName}`}
                            className="size-4 rounded accent-orange-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                          />
                        </td>

                        {/* 2. Nama & Sekolah */}
                        <td className="py-3 px-4 align-middle">
                          <div className="font-bold text-foreground text-sm">
                            {st.fullName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {st.schoolName} • {st.formattedGrade}
                          </div>
                        </td>

                        {/* 3. Status Periode Ini */}
                        <td className="py-3 px-4 align-middle">
                          {st.statusPeriode === "Terverifikasi" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="size-3 text-emerald-500" />
                              Terverifikasi
                            </span>
                          ) : st.statusPeriode === "Menunggu verifikasi" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                              <Clock className="size-3 text-amber-500" />
                              Menunggu Verifikasi
                            </span>
                          ) : (
                            <div>
                              <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-bold text-stone-700 border border-stone-200">
                                <AlertCircle className="size-3 text-stone-500" />
                                Belum Menerima
                              </span>
                              {st.hasRejectedPrevious && (
                                <p className="text-[11px] font-semibold text-rose-600 mt-1 flex items-center gap-1">
                                  <span>⚠️ Bukti sebelumnya ditolak</span>
                                </p>
                              )}
                            </div>
                          )}
                        </td>

                        {/* 4. Nominal Format Rupiah */}
                        <td className="py-3 px-4 align-middle">
                          <div className="relative">
                            <span
                              className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold ${
                                isChecked ? "text-orange-600" : "text-stone-400"
                              }`}
                            >
                              Rp
                            </span>
                            <input
                              type="text"
                              inputMode="numeric"
                              disabled={!isChecked || isLocked}
                              value={formatNominal(nominals[st.id])}
                              onChange={(e) => handleNominalChange(st.id, e.target.value)}
                              placeholder={isChecked ? "Contoh: 500.000" : "-"}
                              className={`w-full h-9 rounded-xl border pl-9 pr-2.5 text-xs font-bold transition focus:outline-none ${
                                isChecked
                                  ? "border-orange-300 bg-white text-foreground focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                  : "border-stone-200 bg-stone-100/70 text-stone-400 cursor-not-allowed"
                              }`}
                            />
                          </div>
                        </td>

                        {/* 5. Bukti */}
                        <td className="py-3 px-4 align-middle">
                          {isJepara ? (
                            <span className="text-xs font-semibold text-orange-700 bg-orange-100/70 px-2.5 py-1 rounded-lg border border-orange-200 inline-block">
                              Bukti Bersama (Jepara)
                            </span>
                          ) : isLocked ? (
                            <span className="text-xs text-stone-400">-</span>
                          ) : !isChecked ? (
                            <span className="text-xs text-stone-400">Centang baris</span>
                          ) : (
                            <div>
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => handleIndividualFileChange(st.id, e)}
                                id={`file-row-${st.id}`}
                                className="hidden"
                              />
                              {!fileObj ? (
                                <label
                                  htmlFor={`file-row-${st.id}`}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-orange-300 bg-orange-50/50 hover:bg-orange-100/60 px-2.5 py-1.5 text-xs font-bold text-orange-800 transition cursor-pointer"
                                >
                                  <UploadCloud className="size-3.5 text-orange-600" />
                                  <span>Pilih Foto Bukti</span>
                                </label>
                              ) : (
                                <div className="inline-flex items-center gap-1.5 rounded-lg bg-orange-100 px-2 py-1 text-xs border border-orange-200">
                                  <FileCheck className="size-3.5 text-emerald-600 shrink-0" />
                                  <span className="font-semibold text-orange-950 truncate max-w-[90px]">
                                    {fileObj.name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveIndividualFile(st.id)}
                                    title="Hapus / ganti file"
                                    className="text-rose-600 hover:text-rose-800 p-0.5 rounded cursor-pointer"
                                  >
                                    <X className="size-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* E. KARTU RESPONSIF (Tampilan Layar Kecil / Mobile) */}
            <div className="md:hidden space-y-3">
              {students.map((st) => {
                const isLocked =
                  st.statusPeriode === "Menunggu verifikasi" ||
                  st.statusPeriode === "Terverifikasi"
                const isChecked = selectedIds.includes(st.id)
                const fileObj = studentFiles[st.id]

                return (
                  <div
                    key={st.id}
                    className={`rounded-2xl border p-4 transition-colors space-y-3 ${
                      isLocked
                        ? "border-stone-200 bg-stone-50/70 opacity-80"
                        : isChecked
                        ? "border-orange-300 bg-orange-50/40 shadow-xs"
                        : "border-stone-200 bg-white"
                    }`}
                  >
                    {/* Header Kartu: Checkbox, Nama, Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isLocked}
                          onChange={() => handleToggleStudent(st.id, isLocked)}
                          className="size-4 mt-1 rounded accent-orange-600 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <div>
                          <p className="font-bold text-foreground text-sm">
                            {st.fullName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {st.schoolName} ({st.formattedGrade})
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {st.statusPeriode === "Terverifikasi" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="size-3 text-emerald-500" />
                            Terverifikasi
                          </span>
                        ) : st.statusPeriode === "Menunggu verifikasi" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
                            <Clock className="size-3 text-amber-500" />
                            Menunggu Verifikasi
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-bold text-stone-700 border border-stone-200">
                            Belum Menerima
                          </span>
                        )}
                        {st.hasRejectedPrevious && (
                          <p className="text-[10px] font-semibold text-rose-600 mt-1">
                            ⚠️ Bukti sebelumnya ditolak
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Input Nominal & Upload File (Hanya aktif jika dicentang) */}
                    {isChecked && !isLocked && (
                      <div className="pt-2 border-t border-orange-100/80 space-y-2.5">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                            <Coins className="size-3 text-orange-500" />
                            <span>Nominal Dana (Rp):</span>
                          </label>
                          <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-orange-600">
                              Rp
                            </span>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={formatNominal(nominals[st.id])}
                              onChange={(e) => handleNominalChange(st.id, e.target.value)}
                              placeholder="Contoh: 500.000"
                              className="w-full h-10 rounded-xl border border-orange-300 bg-white pl-9 pr-3 text-sm font-bold text-foreground focus:border-orange-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        {!isJepara && (
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                              <FileCheck className="size-3 text-orange-500" />
                              <span>Foto / Berkas Bukti:</span>
                            </label>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={(e) => handleIndividualFileChange(st.id, e)}
                              id={`file-card-${st.id}`}
                              className="hidden"
                            />
                            {!fileObj ? (
                              <label
                                htmlFor={`file-card-${st.id}`}
                                className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-orange-300 bg-orange-50/50 p-2.5 text-xs font-bold text-orange-800 transition cursor-pointer"
                              >
                                <UploadCloud className="size-4 text-orange-600" />
                                <span>Pilih Foto Bukti</span>
                              </label>
                            ) : (
                              <div className="flex items-center justify-between rounded-xl bg-orange-100 p-2 border border-orange-200 text-xs">
                                <div className="flex items-center gap-1.5 truncate">
                                  <FileCheck className="size-4 text-emerald-600 shrink-0" />
                                  <span className="font-semibold text-orange-950 truncate">
                                    {fileObj.name}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveIndividualFile(st.id)}
                                  className="text-rose-600 font-bold ml-2 shrink-0"
                                >
                                  Ganti
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* F. Tombol Submit & Ringkasan Pilihan */}
          <div className="pt-4 border-t border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Info className="size-4 text-orange-500 shrink-0" />
              <span>
                <strong>{selectedIds.length}</strong> anak binaan dicentang untuk penyaluran dana.
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href="/pengawas"
                className="flex-1 sm:flex-initial text-center rounded-2xl border border-orange-200/80 bg-white px-5 py-3 text-sm font-bold text-muted-foreground hover:bg-orange-50 hover:text-foreground transition"
              >
                Batal
              </Link>

              <button
                type="submit"
                disabled={isPending || selectedIds.length === 0}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 hover:bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-orange-500/25 transition disabled:opacity-50 cursor-pointer"
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <UploadCloud className="size-4" />
                )}
                <span>
                  {isPending
                    ? "Mengirim..."
                    : `Kirim Bukti (${selectedIds.length} Anak)`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* 4. RIWAYAT PENGAJUAN BUKTI (READ-ONLY) */}
      <div className="rounded-3xl border border-orange-100/90 bg-white/95 p-6 sm:p-8 shadow-md backdrop-blur-md space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-orange-100">
          <div className="space-y-0.5">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              Riwayat Pengajuan Bukti Anda
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Semua bukti penyaluran dana milik anak binaan Anda (terbaru di atas)
            </p>
          </div>
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs sm:text-sm font-bold text-orange-800">
            {history.length} Berkas
          </span>
        </div>

        {history.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground rounded-2xl bg-orange-50/30 border border-dashed border-orange-200">
            <Clock className="size-8 text-orange-300 mx-auto mb-2" />
            <p className="font-bold text-foreground text-base">Belum Ada Bukti Diunggah</p>
            <p className="mt-1">
              Gunakan formulir di atas untuk mengirimkan bukti penyaluran dana beasiswa pertama Anda.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-orange-100/80 border border-orange-100 rounded-2xl overflow-hidden">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-orange-50/40 transition"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-foreground text-base">
                      {item.student.fullName}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      ({item.student.schoolName})
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <span className="font-bold text-orange-600 font-mono text-base sm:text-lg">
                      {item.nominal !== null && item.nominal !== undefined
                        ? `Rp ${item.nominal.toLocaleString("id-ID")}`
                        : "-"}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-xs">
                      Diajukan:{" "}
                      {new Date(item.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    {item.processedAt && (
                      <>
                        <span>•</span>
                        <span className="font-mono text-xs">
                          Diproses:{" "}
                          {new Date(item.processedAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Keterangan */}
                  <div className="pt-0.5">
                    <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md inline-block">
                      Keterangan: {item.keterangan || "-"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Status Badge */}
                  {item.status === "verified" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs sm:text-sm font-bold text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="size-3.5 text-emerald-500" />
                      Terverifikasi
                    </span>
                  ) : item.status === "rejected" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs sm:text-sm font-bold text-rose-700 border border-rose-200">
                      <XCircle className="size-3.5 text-rose-500" />
                      Ditolak
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs sm:text-sm font-bold text-amber-700 border border-amber-200">
                      <Clock className="size-3.5 text-amber-500" />
                      Menunggu Verifikasi
                    </span>
                  )}

                  {/* Tombol Lihat Bukti File */}
                  {item.fileUrl && (
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-xl bg-white border border-orange-200 px-3 py-1.5 text-xs sm:text-sm font-bold text-orange-950 hover:bg-orange-50 transition shadow-2xs"
                    >
                      <FileText className="size-3.5 text-orange-600" />
                      <span>Lihat Bukti</span>
                      <ExternalLink className="size-3 text-muted-foreground" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
