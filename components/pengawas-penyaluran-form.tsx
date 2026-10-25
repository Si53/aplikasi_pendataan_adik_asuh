"use client"

import { useState, useMemo, useTransition, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
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
  Calendar,
} from "lucide-react"
import { createPengawasBatchDisbursementAction } from "@/app/actions/pengawas"
import {
  getAvailablePeriodeList,
  isDateInPeriode,
  getPeriodeFromDate,
  getCurrentPeriode,
} from "@/lib/periode"

export interface PengawasStudentRow {
  id: number
  fullName: string
  schoolName: string
  jenjang?: string | null
  gradeLevel: string
  formattedGrade: string
  wilayah: string
  disbursements?: {
    id: number
    tanggal: string
    nominal: number | null
    status: string
  }[]
  statusPeriode?: "Belum menerima" | "Menunggu verifikasi" | "Terverifikasi"
  hasRejectedPrevious?: boolean
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
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 1. Periode state
  const availablePeriodeList = useMemo(() => getAvailablePeriodeList(), [])
  const [selectedTablePeriode, setSelectedTablePeriode] = useState<string>(
    () => currentPeriode || availablePeriodeList[0] || getCurrentPeriode()
  )
  const [selectedHistoryPeriode, setSelectedHistoryPeriode] = useState<string>("all")

  // 2. Form selection & input states
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [nominals, setNominals] = useState<Record<number, string>>({})
  const [sharedFile, setSharedFile] = useState<File | null>(null)
  const [sharedPreview, setSharedPreview] = useState<string | null>(null)

  // 3. Feedback states
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // 4. Hitung status siswa secara dinamis berdasarkan periode yang dipilih pada tabel
  const studentsWithStatus = useMemo(() => {
    return students.map((st) => {
      const periodProofs = (st.disbursements || []).filter((d) =>
        isDateInPeriode(d.tanggal, selectedTablePeriode)
      )
      const hasVerified = periodProofs.some((d) => d.status === "verified")
      const hasPending = periodProofs.some((d) => d.status === "pending")
      const hasRejected = periodProofs.some((d) => d.status === "rejected")

      let statusPeriode: "Belum menerima" | "Menunggu verifikasi" | "Terverifikasi" =
        "Belum menerima"
      if (hasVerified) {
        statusPeriode = "Terverifikasi"
      } else if (hasPending) {
        statusPeriode = "Menunggu verifikasi"
      }

      return {
        ...st,
        statusPeriode,
        hasRejectedPrevious: statusPeriode === "Belum menerima" && hasRejected,
      }
    })
  }, [students, selectedTablePeriode])

  // Siswa yang berstatus "Belum menerima" pada periode terpilih (dapat dicentang)
  const eligibleStudents = useMemo(() => {
    return studentsWithStatus.filter((s) => s.statusPeriode === "Belum menerima")
  }, [studentsWithStatus])

  // Siswa yang sedang dicentang/dipilih
  const selectedStudents = useMemo(() => {
    return selectedIds
      .map((id) => students.find((s) => s.id === id))
      .filter((s): s is PengawasStudentRow => Boolean(s))
  }, [selectedIds, students])

  // Total nominal keseluruhan yang sudah diisi
  const totalNominal = useMemo(() => {
    return selectedIds.reduce((sum, id) => {
      const raw = nominals[id]
      const val = raw ? parseInt(raw.replace(/\D/g, ""), 10) : 0
      return sum + (isNaN(val) ? 0 : val)
    }, 0)
  }, [selectedIds, nominals])

  // Handler pemilihan periode tabel: update periode & bersihkan siswa yang terkunci di periode baru
  const handleTablePeriodeChange = (newPeriod: string) => {
    setSelectedTablePeriode(newPeriod)
    setErrorMessage(null)
    setSelectedIds((prev) => {
      const newEligibleIds = students
        .filter((st) => {
          const proofs = (st.disbursements || []).filter((d) =>
            isDateInPeriode(d.tanggal, newPeriod)
          )
          return !proofs.some((d) => d.status === "verified" || d.status === "pending")
        })
        .map((s) => s.id)
      return prev.filter((id) => newEligibleIds.includes(id))
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
    setErrorMessage(null)
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null)
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage("Ukuran file terlalu besar (maksimal 15 MB).")
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

  const handleRemoveFile = () => {
    setSharedFile(null)
    if (sharedPreview) {
      URL.revokeObjectURL(sharedPreview)
      setSharedPreview(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    // Validasi minimal 1 adik asuh dipilih
    if (selectedIds.length === 0) {
      setErrorMessage("Silakan centang minimal 1 adik asuh penerima dana.")
      return
    }

    // Validasi nominal tiap baris yang dicentang
    for (const sid of selectedIds) {
      const student = studentsWithStatus.find((s) => s.id === sid)
      const raw = nominals[sid] ? parseInt(nominals[sid].replace(/\D/g, ""), 10) : 0
      if (!raw || raw <= 0) {
        setErrorMessage(
          `Nominal bantuan untuk ${student?.fullName || `anak ID ${sid}`} wajib diisi dan harus lebih dari Rp 0.`
        )
        return
      }
    }

    // Validasi file bukti kolektif / tunggal
    if (!sharedFile) {
      setErrorMessage(
        selectedIds.length > 1
          ? "Silakan unggah 1 foto / berkas bukti kolektif untuk adik asuh yang dipilih."
          : "Silakan unggah foto / berkas bukti penyaluran dana beasiswa."
      )
      return
    }

    // Siapkan FormData
    const formData = new FormData()
    formData.append("periode", selectedTablePeriode)
    formData.append("sharedFile", sharedFile)

    for (const sid of selectedIds) {
      formData.append("studentIds", String(sid))
      formData.append(`nominal_${sid}`, nominals[sid].replace(/\D/g, ""))
    }

    startTransition(async () => {
      const res = await createPengawasBatchDisbursementAction(formData)
      if (res.success) {
        setSuccessMessage(res.message)
        setSelectedIds([])
        setNominals({})
        handleRemoveFile()
        router.refresh()
      } else {
        setErrorMessage(res.error || "Gagal menyimpan bukti penyaluran dana.")
      }
    })
  }

  // Filter riwayat bukti berdasarkan periode riwayat yang dipilih
  const filteredHistory = useMemo(() => {
    if (selectedHistoryPeriode === "all") return history
    return history.filter((item) =>
      isDateInPeriode(item.tanggal, selectedHistoryPeriode)
    )
  }, [history, selectedHistoryPeriode])

  return (
    <div className="space-y-8">
      {/* 1. Header Halaman */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs sm:text-sm font-extrabold text-orange-800 border border-orange-200">
              Wilayah {wilayah}
            </span>
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs sm:text-sm font-black text-amber-700 border border-amber-300 flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-amber-600" />
              Periode saat ini: {currentPeriode}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight pt-1">
            Input Penyaluran Dana Beasiswa
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
            Pencatatan dan pengunggahan bukti penyerahan beasiswa untuk adik asuh binaan Anda
            berdasarkan periode semester yang dipilih.
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

      {/* 2. Form Utama: Tabel Adik Asuh & Upload Bukti Kolektif */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-3xl border border-orange-100/90 bg-white/95 p-5 sm:p-7 shadow-md backdrop-blur-md space-y-6">
          {/* A. Header Tabel & Filter Periode */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-orange-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  Daftar Adik Asuh Binaan Anda
                </h3>
                <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-800">
                  {studentsWithStatus.length} Siswa
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Centang adik asuh yang akan disalurkan dan isi nominal bantuannya.
              </p>
            </div>

            {/* Dropdown Periode Tabel */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-2 rounded-2xl bg-orange-50/60 border border-orange-200 px-3 py-1.5 shadow-2xs">
                <label
                  htmlFor="table-periode-select"
                  className="text-xs font-bold text-orange-900 flex items-center gap-1.5 shrink-0"
                >
                  <Calendar className="size-3.5 text-orange-600" />
                  <span>Periode:</span>
                </label>
                <select
                  id="table-periode-select"
                  value={selectedTablePeriode}
                  onChange={(e) => handleTablePeriodeChange(e.target.value)}
                  className="rounded-xl border border-orange-200 bg-white px-2.5 py-1 text-xs font-bold text-stone-800 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 shadow-2xs transition cursor-pointer"
                >
                  {availablePeriodeList.map((p) => (
                    <option key={p} value={p}>
                      {p} {p === currentPeriode ? "(Saat Ini)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {eligibleStudents.length > 0 && (
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 hover:text-orange-900 bg-white hover:bg-orange-50 px-3 py-2 rounded-xl border border-orange-200 transition cursor-pointer shadow-2xs"
                >
                  {selectedIds.length === eligibleStudents.length ? (
                    <>
                      <Square className="size-3.5 text-orange-600" />
                      <span>Batal Pilih Semua</span>
                    </>
                  ) : (
                    <>
                      <CheckSquare className="size-3.5 text-orange-600" />
                      <span>Pilih Semua yang Belum ({eligibleStudents.length})</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* B. TABEL (Tampilan Desktop / Layar Lebar) */}
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
                  <th className="py-3 px-4 min-w-[170px]">
                    Status Periode {selectedTablePeriode}
                  </th>
                  <th className="py-3 px-4 min-w-[180px]">Nominal (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100/80 bg-white">
                {studentsWithStatus.map((st) => {
                  const isLocked =
                    st.statusPeriode === "Menunggu verifikasi" ||
                    st.statusPeriode === "Terverifikasi"
                  const isChecked = selectedIds.includes(st.id)

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
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* C. KARTU RESPONSIF (Tampilan Layar Kecil / Mobile) */}
          <div className="md:hidden space-y-3">
            {studentsWithStatus.map((st) => {
              const isLocked =
                st.statusPeriode === "Menunggu verifikasi" ||
                st.statusPeriode === "Terverifikasi"
              const isChecked = selectedIds.includes(st.id)

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

                  {isChecked && !isLocked && (
                    <div className="pt-2 border-t border-orange-100/80 space-y-2">
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

                      <div className="pt-1 text-xs">
                        {!sharedFile ? (
                          <span className="text-amber-700 font-medium">
                            * Menunggu file bukti diunggah pada bagian bawah tabel
                          </span>
                        ) : selectedIds.length > 1 ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <FileCheck className="size-3.5 text-emerald-600" />
                            Diwakilkan bukti kolektif ({sharedFile.name})
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <FileCheck className="size-3.5 text-emerald-600" />
                            Bukti siap diunggah ({sharedFile.name})
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* D. Fitur Upload Bukti Kolektif / Tunggal (Hanya Muncul 1 Kali) */}
          <div className="space-y-3 pt-2">
            <div className="rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50/40 p-5 sm:p-6 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-foreground font-bold text-sm sm:text-base">
                    <FileCheck className="size-4 text-orange-600" />
                    <span>
                      {selectedIds.length > 1
                        ? `Upload 1 Bukti Kolektif (${selectedIds.length} Anak Terpilih)`
                        : selectedIds.length === 1
                        ? "Upload Bukti Penyaluran (1 Anak Terpilih)"
                        : "Upload Bukti Penyaluran"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedIds.length > 1
                      ? `Satu foto / file bukti transfer ini otomatis diwakilkan dan tersimpan untuk seluruh ${selectedIds.length} adik asuh yang Anda centang.`
                      : selectedIds.length === 1
                      ? "Unggah foto struk transfer atau dokumentasi penyerahan dana beasiswa."
                      : "Centang adik asuh di tabel terlebih dahulu untuk mengaktifkan upload bukti."}
                  </p>
                </div>

                {selectedIds.length > 1 && (
                  <span className="rounded-full bg-orange-200/80 px-3 py-1 text-xs font-black text-orange-950 shrink-0 self-start sm:self-auto border border-orange-300">
                    Mode Kolektif ({selectedIds.length} Anak)
                  </span>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                disabled={selectedIds.length === 0}
                className="hidden"
                id="pengawas-collective-file-input"
              />

              {selectedIds.length === 0 ? (
                <div className="mt-2 flex flex-col items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white/70 p-6 text-center text-stone-400">
                  <UploadCloud className="size-8 text-stone-300" />
                  <p className="text-xs sm:text-sm font-semibold">
                    Silakan centang minimal 1 adik asuh di tabel atas untuk mengunggah bukti.
                  </p>
                </div>
              ) : !sharedFile ? (
                <label
                  htmlFor="pengawas-collective-file-input"
                  className="mt-2 flex flex-col items-center justify-center gap-2.5 rounded-xl border border-orange-300/80 bg-white p-6 text-center hover:bg-orange-50/70 hover:border-orange-400 transition cursor-pointer shadow-2xs"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 shadow-2xs">
                    <UploadCloud className="size-6" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs sm:text-sm font-bold text-foreground">
                      {selectedIds.length > 1
                        ? `Klik untuk memilih 1 file bukti kolektif (${selectedIds.length} anak)`
                        : "Klik untuk memilih foto / berkas bukti penyaluran"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Mendukung JPG, PNG, WEBP, atau PDF (Maksimal 15 MB)
                    </p>
                  </div>
                </label>
              ) : (
                <div className="mt-2 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-orange-200 bg-white p-4 shadow-2xs">
                  <div className="flex items-center gap-3 min-w-0">
                    {sharedPreview ? (
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-orange-200 bg-stone-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sharedPreview}
                          alt="Preview Bukti Penyaluran"
                          className="size-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 font-bold">
                        <FileText className="size-6" />
                      </div>
                    )}
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                        {sharedFile.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        {(sharedFile.size / (1024 * 1024)).toFixed(2)} MB •{" "}
                        {selectedIds.length > 1
                          ? `Siap digunakan mewakili ${selectedIds.length} anak`
                          : "Siap dikirim"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0 border border-rose-200"
                  >
                    <X className="size-3.5" />
                    <span>Ganti File</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* E. Ringkasan Konfirmasi & Tombol Submit */}
          <div className="pt-4 border-t border-orange-100 space-y-4">
            {selectedIds.length > 0 && (
              <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-4 sm:p-5 space-y-3.5 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-orange-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="size-4 text-orange-600 shrink-0" />
                    <span className="text-sm font-bold text-orange-950">
                      Ringkasan Penyaluran ({selectedIds.length} Anak Binaan)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-stone-600">
                    <span>Periode:</span>
                    <span className="font-bold text-orange-900 bg-white/90 px-2.5 py-0.5 rounded-lg border border-orange-200 shadow-2xs">
                      {selectedTablePeriode}
                    </span>
                  </div>
                </div>

                {/* Daftar adik asuh & nominal masing-masing */}
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-stone-600">
                    Daftar Adik Asuh & Nominal:
                  </p>
                  <ul className="space-y-1.5 text-xs">
                    {selectedStudents.map((st) => {
                      const nom = nominals[st.id]
                      const formatted = formatNominal(nom)
                      return (
                        <li
                          key={st.id}
                          className="flex items-center justify-between gap-3 bg-white/80 rounded-xl px-3 py-2 border border-orange-100 shadow-2xs"
                        >
                          <span className="font-semibold text-stone-800 truncate">
                            {st.fullName}
                          </span>
                          <div className="shrink-0 flex items-center gap-1.5">
                            <span className="text-stone-400">—</span>
                            {formatted ? (
                              <span className="font-bold text-stone-900">
                                Rp {formatted}
                              </span>
                            ) : (
                              <span className="font-semibold text-rose-600">
                                Nominal belum diisi
                              </span>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                {/* Status File Bukti & Total Nominal Keseluruhan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-orange-200/80 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-stone-600">Status File Bukti:</span>
                    {sharedFile ? (
                      <span
                        className="font-bold text-emerald-700 truncate max-w-[220px]"
                        title={sharedFile.name}
                      >
                        {sharedFile.name}
                      </span>
                    ) : (
                      <span className="font-semibold text-amber-600">
                        Bukti belum diunggah
                      </span>
                    )}
                  </div>

                  <div className="flex items-center sm:justify-end gap-2">
                    <span className="text-stone-600">Total Nominal:</span>
                    <span className="font-black text-sm sm:text-base text-orange-950">
                      Rp {totalNominal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tombol Batal & Kirim Bukti */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 w-full">
              <Link
                href="/pengawas"
                className="w-full sm:w-auto text-center rounded-2xl border border-orange-200/80 bg-white px-5 py-3 text-sm font-bold text-muted-foreground hover:bg-orange-50 hover:text-foreground transition"
              >
                Batal
              </Link>

              <button
                type="submit"
                disabled={isPending || selectedIds.length === 0 || !sharedFile}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 hover:bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-orange-500/25 transition disabled:opacity-50 cursor-pointer"
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

      {/* 3. RIWAYAT PENGAJUAN BUKTI (DILENGKAPI FILTER PERIODE) */}
      <div className="rounded-3xl border border-orange-100/90 bg-white/95 p-6 sm:p-8 shadow-md backdrop-blur-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-orange-100">
          <div className="space-y-0.5">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              Riwayat Pengajuan Bukti Anda
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Semua bukti penyaluran dana milik anak binaan Anda (terbaru di atas)
            </p>
          </div>

          {/* Filter Periode Riwayat */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-2 rounded-2xl bg-orange-50/60 border border-orange-200 px-3 py-1.5 shadow-2xs">
              <label
                htmlFor="history-periode-select"
                className="text-xs font-bold text-orange-900 flex items-center gap-1.5 shrink-0"
              >
                <Calendar className="size-3.5 text-orange-600" />
                <span>Filter Periode:</span>
              </label>
              <select
                id="history-periode-select"
                value={selectedHistoryPeriode}
                onChange={(e) => setSelectedHistoryPeriode(e.target.value)}
                className="rounded-xl border border-orange-200 bg-white px-2.5 py-1 text-xs font-bold text-stone-800 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 shadow-2xs transition cursor-pointer"
              >
                <option value="all">Semua Periode</option>
                {availablePeriodeList.map((p) => (
                  <option key={p} value={p}>
                    Periode {p}
                  </option>
                ))}
              </select>
            </div>

            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs sm:text-sm font-bold text-orange-800">
              {filteredHistory.length} Berkas
            </span>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground rounded-2xl bg-orange-50/30 border border-dashed border-orange-200">
            <Clock className="size-8 text-orange-300 mx-auto mb-2" />
            <p className="font-bold text-foreground text-base">Belum Ada Bukti</p>
            <p className="mt-1">
              {selectedHistoryPeriode !== "all"
                ? `Tidak ditemukan berkas bukti penyaluran pada Periode ${selectedHistoryPeriode}.`
                : "Gunakan formulir di atas untuk mengirimkan bukti penyaluran dana beasiswa pertama Anda."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-orange-100/80 border border-orange-100 rounded-2xl overflow-hidden">
            {filteredHistory.map((item) => {
              const itemPeriode = getPeriodeFromDate(item.tanggal)

              return (
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
                      <span className="rounded-full bg-amber-100/80 border border-amber-300 px-2.5 py-0.5 text-[11px] font-black text-amber-900">
                        {itemPeriode}
                      </span>
                      {item.batchId && (
                        <span className="rounded-full bg-orange-100 border border-orange-200 px-2 py-0.5 text-[10px] font-bold text-orange-800">
                          Bukti Kolektif
                        </span>
                      )}
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
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
