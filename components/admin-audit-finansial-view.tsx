"use client"

import { useState, useMemo, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserCheck,
  MapPin,
  FileText,
  ExternalLink,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Calendar,
  School,
  Sparkles,
  Inbox,
  AlertTriangle,
  ZoomIn,
} from "lucide-react"
import { processDisbursementAction } from "@/app/actions/admin"

export interface AuditProofItem {
  id: number
  tanggal: string
  fileUrl: string
  nominal: number | null
  status: "pending" | "verified" | "rejected" | string
  processedAt: string | null
  student: {
    id: number
    fullName: string
    schoolName: string
    gradeLevel: string
    wilayah: string
  }
  pengawas: {
    id: number
    name: string
    wilayah: string
    noHp: string | null
  }
}

export interface StudentWithoutProofItem {
  id: number
  fullName: string
  schoolName: string
  gradeLevel: string
  wilayah: string
  pengawas: {
    id: number
    name: string
    wilayah: string
  } | null
}

interface AdminAuditFinansialViewProps {
  pendingProofs: AuditProofItem[]
  studentsWithoutProof: StudentWithoutProofItem[]
  processedHistory: AuditProofItem[]
}

function getRelativeTimeIndo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHours = Math.floor(diffMin / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSec < 60) return "Baru saja"
  if (diffMin < 60) return `${diffMin} menit yang lalu`
  if (diffHours < 24) return `${diffHours} jam yang lalu`
  if (diffDays === 1) return "Kemarin"
  if (diffDays < 30) return `${diffDays} hari yang lalu`
  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths < 12) return `${diffMonths} bulan yang lalu`
  return `${Math.floor(diffDays / 365)} tahun yang lalu`
}

export function AdminAuditFinansialView({
  pendingProofs,
  studentsWithoutProof,
  processedHistory,
}: AdminAuditFinansialViewProps) {
  // Selection state
  const [selectedProofId, setSelectedProofId] = useState<number | null>(
    pendingProofs.length > 0 ? pendingProofs[0].id : null
  )

  // Transition state
  const [isProcessing, startTransition] = useTransition()
  const [actionError, setActionError] = useState<string | null>(null)
  const [exportNotice, setExportNotice] = useState(false)

  // History table filter & pagination
  const [historySearch, setHistorySearch] = useState("")
  const [historyStatusFilter, setHistoryStatusFilter] = useState("all")
  const [historyPage, setHistoryPage] = useState(1)
  const [historyPageSize, setHistoryPageSize] = useState(10)

  // Currently selected pending proof
  const selectedProof = useMemo(() => {
    return pendingProofs.find((p) => p.id === selectedProofId) || null
  }, [pendingProofs, selectedProofId])

  // Process Proof (Verify / Reject)
  const handleProcess = (status: "verified" | "rejected") => {
    if (!selectedProofId) return
    setActionError(null)

    startTransition(async () => {
      const res = await processDisbursementAction(selectedProofId, status)
      if (res.success) {
        // Reset selectedProofId to null or next available
        const remaining = pendingProofs.filter((p) => p.id !== selectedProofId)
        setSelectedProofId(remaining.length > 0 ? remaining[0].id : null)
      } else {
        setActionError(res.error || "Gagal memproses bukti.")
      }
    })
  }

  // Filtered History
  const filteredHistory = useMemo(() => {
    return processedHistory.filter((item) => {
      if (historySearch.trim()) {
        const q = historySearch.toLowerCase().trim()
        const matchStudent = item.student.fullName.toLowerCase().includes(q)
        const matchPengawas = item.pengawas.name.toLowerCase().includes(q)
        const matchWilayah = item.student.wilayah.toLowerCase().includes(q)
        if (!matchStudent && !matchPengawas && !matchWilayah) return false
      }
      if (historyStatusFilter !== "all" && item.status !== historyStatusFilter) {
        return false
      }
      return true
    })
  }, [processedHistory, historySearch, historyStatusFilter])

  // Paginated History
  const totalHistoryItems = filteredHistory.length
  const totalHistoryPages = Math.ceil(totalHistoryItems / historyPageSize) || 1
  const validHistoryPage = Math.min(
    Math.max(1, historyPage),
    totalHistoryPages
  )

  const paginatedHistory = useMemo(() => {
    const start = (validHistoryPage - 1) * historyPageSize
    return filteredHistory.slice(start, start + historyPageSize)
  }, [filteredHistory, validHistoryPage, historyPageSize])

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Tanggal Upload",
      "Tanggal Diproses",
      "Nama Siswa",
      "Sekolah",
      "Wilayah",
      "Pengawas",
      "Nominal (Rp)",
      "Status",
    ]
    const allRows = [...pendingProofs, ...processedHistory].map((p) => [
      p.id,
      p.tanggal,
      p.processedAt || "-",
      `"${p.student.fullName.replace(/"/g, '""')}"`,
      `"${p.student.schoolName.replace(/"/g, '""')}"`,
      `"${p.student.wilayah}"`,
      `"${p.pengawas.name.replace(/"/g, '""')}"`,
      p.nominal ? p.nominal : "-",
      p.status === "verified"
        ? "Terverifikasi"
        : p.status === "rejected"
        ? "Ditolak"
        : "Menunggu Verifikasi",
    ])

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...allRows.map((e) => e.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute(
      "download",
      `audit-finansial-${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setExportNotice(true)
    setTimeout(() => setExportNotice(false), 4000)
  }

  return (
    <div className="space-y-8">
      {/* 1. Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-700">
              <Sparkles className="size-3 text-orange-600" />
              PENGAWASAN KEUANGAN & BUKTI BAYAR
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Audit Finansial
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl">
            Verifikasi dan audit bukti transfer penyaluran dana beasiswa dari
            pengawas wilayah ke masing-masing adik asuh.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Badge Counter Menunggu Verifikasi */}
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200/80 px-3.5 py-2 text-xs sm:text-sm font-bold text-amber-800 shadow-2xs">
            <Clock className="size-4 text-amber-600 animate-pulse" />
            <span>{pendingProofs.length} Menunggu Verifikasi</span>
          </span>

          {/* Tombol Export Laporan */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-stone-700 hover:bg-stone-50 hover:text-stone-900 shadow-2xs transition cursor-pointer"
          >
            <Download className="size-4 text-stone-500" />
            <span>Export Laporan</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>Laporan audit finansial berhasil diexport ke file CSV.</span>
        </div>
      )}

      {/* 2. Two-Column Layout: Left (Queue & No Proof) | Right (Proof Detail) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* KOLOM KIRI (7 Kolom di Desktop): Antrean & Belum Ada Bukti */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* SECTION 1: ANTREAN VERIFIKASI */}
          <div className="rounded-3xl border border-stone-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600 font-bold text-xs">
                  <Clock className="size-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-stone-900">
                    Antrean Verifikasi
                  </h2>
                  <p className="text-xs text-stone-500">
                    Bukti transfer menunggu persetujuan (paling lama diajukan di
                    atas)
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-orange-50 border border-orange-200 px-2.5 py-0.5 text-xs font-bold text-orange-700">
                {pendingProofs.length} Berkas
              </span>
            </div>

            {pendingProofs.length === 0 ? (
              <div className="py-10 text-center text-xs text-stone-400 rounded-2xl bg-stone-50 border border-dashed border-stone-200">
                <CheckCircle2 className="size-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-stone-800 text-sm">
                  Semua Bukti Telah Terverifikasi
                </p>
                <p className="mt-1">
                  Tidak ada antrean audit saat ini. Berkas baru akan muncul saat
                  pengawas mengunggah bukti.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {pendingProofs.map((item) => {
                  const isSelected = selectedProofId === item.id
                  const initial = item.student.fullName.charAt(0).toUpperCase()

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedProofId(item.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-150 flex items-start justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? "bg-orange-50/60 border-orange-500 ring-2 ring-orange-500/20 shadow-xs"
                          : "bg-stone-50/70 border-stone-200/80 hover:bg-white hover:border-stone-300"
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`flex size-10 shrink-0 items-center justify-center rounded-xl font-bold text-sm shadow-2xs ${
                            isSelected
                              ? "bg-orange-500 text-white"
                              : "bg-white text-stone-700 border border-stone-200"
                          }`}
                        >
                          {initial}
                        </div>

                        <div className="space-y-1 min-w-0">
                          <h3 className="font-bold text-stone-900 text-sm truncate">
                            {item.student.fullName}
                          </h3>
                          <p className="text-xs text-stone-600 flex items-center gap-1.5 truncate">
                            <UserCheck className="size-3 text-stone-400 shrink-0" />
                            <span>Pengawas: {item.pengawas.name}</span>
                          </p>
                          <div className="flex items-center gap-2 pt-0.5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-500">
                              <MapPin className="size-3 text-orange-500" />
                              {item.student.wilayah}
                            </span>
                            <span className="text-stone-300">•</span>
                            <span className="text-[11px] font-mono text-stone-400">
                              {item.student.schoolName}
                            </span>
                            {item.nominal ? (
                              <>
                                <span className="text-stone-300">•</span>
                                <span className="text-[11px] font-bold text-emerald-700">
                                  Rp {item.nominal.toLocaleString("id-ID")}
                                </span>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 space-y-1">
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/70 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                          <Clock className="size-2.5" />
                          {getRelativeTimeIndo(item.tanggal)}
                        </span>
                        <p className="text-[10px] text-stone-400 font-mono">
                          {new Date(item.tanggal).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* SECTION 2: BELUM ADA BUKTI (Pengingat Visual) */}
          <div className="rounded-3xl border border-stone-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 font-bold text-xs">
                  <AlertTriangle className="size-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-stone-900">
                    Belum Ada Bukti Bayar
                  </h2>
                  <p className="text-xs text-stone-500">
                    Siswa terdaftar yang belum pernah memiliki bukti penyaluran
                    dana
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                {studentsWithoutProof.length} Siswa
              </span>
            </div>

            {studentsWithoutProof.length === 0 ? (
              <div className="py-6 text-center text-xs text-stone-400 rounded-2xl bg-stone-50 border border-stone-200/60">
                Semua siswa binaan sudah memiliki riwayat penyaluran dana.
              </div>
            ) : (
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {studentsWithoutProof.map((st) => (
                  <div
                    key={st.id}
                    className="p-3 rounded-xl bg-rose-50/40 border border-rose-100 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-stone-900 truncate">
                        {st.fullName}
                      </p>
                      <p className="text-[11px] text-stone-500 truncate">
                        {st.schoolName} ({st.gradeLevel}) • Wilayah: {st.wilayah}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-semibold text-stone-700 block">
                        {st.pengawas?.name || "Belum ada pengawas"}
                      </span>
                      <span className="text-[10px] text-rose-600 font-bold">
                        Perlu Disalurkan
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* KOLOM KANAN (5 Kolom di Desktop): Panel Detail Bukti & Tindakan */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 rounded-3xl border border-stone-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-base font-bold text-stone-900">
                Detail Bukti Transfer
              </h2>
              {selectedProof && (
                <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200">
                  ID: #{selectedProof.id}
                </span>
              )}
            </div>

            {selectedProof ? (
              <div className="space-y-5">
                {/* Preview Foto Bukti Transfer */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Lampiran Berkas Bukti
                  </span>

                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border-2 border-stone-200 bg-stone-100 group">
                    {selectedProof.fileUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={selectedProof.fileUrl}
                        alt={`Bukti Transfer ${selectedProof.student.fullName}`}
                        className="size-full object-contain p-1"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-xs text-stone-400">
                        Tidak ada file gambar
                      </div>
                    )}

                    {selectedProof.fileUrl && (
                      <a
                        href={selectedProof.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-2xs text-white text-xs font-bold gap-1.5"
                      >
                        <ZoomIn className="size-4" />
                        <span>Buka Ukuran Penuh</span>
                        <ExternalLink className="size-3 text-stone-200" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Read-Only Nominal Penyaluran */}
                <div className="rounded-2xl bg-orange-50/80 border border-orange-200 p-4 flex items-center justify-between shadow-2xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 block">
                      Nominal Penyaluran
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Diinput Pengawas saat upload bukti
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg sm:text-xl font-black text-orange-600">
                      {selectedProof.nominal !== null &&
                      selectedProof.nominal !== undefined
                        ? `Rp ${selectedProof.nominal.toLocaleString("id-ID")}`
                        : "Rp - (Belum tercatat)"}
                    </span>
                  </div>
                </div>

                {/* Detail Data Bukti */}
                <div className="rounded-2xl bg-stone-50 border border-stone-200/70 p-4 space-y-2.5 text-xs">
                  <div className="flex justify-between items-start">
                    <span className="text-stone-500">Nama Siswa:</span>
                    <strong className="text-stone-900 text-right">
                      {selectedProof.student.fullName}
                    </strong>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-stone-500">Sekolah & Jenjang:</span>
                    <span className="text-stone-800 text-right">
                      {selectedProof.student.schoolName} (
                      {selectedProof.student.gradeLevel})
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-stone-500">Wilayah:</span>
                    <span className="font-semibold text-stone-800">
                      {selectedProof.student.wilayah}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-stone-500">Pengawas Pengunggah:</span>
                    <strong className="text-stone-900 text-right">
                      {selectedProof.pengawas.name}
                    </strong>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-stone-500">Waktu Pengajuan:</span>
                    <span className="text-stone-700 font-mono text-[11px] text-right">
                      {new Date(selectedProof.tanggal).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                </div>

                {actionError && (
                  <p className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                    <AlertCircle className="size-3.5" />
                    {actionError}
                  </p>
                )}

                {/* 2 Action Buttons: Tolak & Tandai Terverifikasi */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleProcess("rejected")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs sm:text-sm font-bold text-rose-700 hover:bg-rose-100 transition disabled:opacity-50 cursor-pointer"
                  >
                    {isProcessing ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <XCircle className="size-4" />
                    )}
                    <span>Tolak</span>
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleProcess("verified")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-emerald-500 transition shadow-xs shadow-emerald-600/25 disabled:opacity-50 cursor-pointer"
                  >
                    {isProcessing ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="size-4" />
                    )}
                    <span>Tandai Terverifikasi</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-stone-400 space-y-2">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-400 mx-auto mb-2">
                  <Inbox className="size-7" />
                </div>
                <p className="font-bold text-stone-700 text-sm">
                  Belum Ada Bukti Dipilih
                </p>
                <p className="text-xs max-w-xs mx-auto">
                  Pilih salah satu berkas bukti transfer dari antrean di sebelah
                  kiri untuk melihat lampiran dan melakukan audit.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: RIWAYAT VERIFIKASI TERBARU (Full Width Bawah) */}
      {/* ========================================================================= */}
      <div className="rounded-3xl border border-stone-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              Riwayat Verifikasi Terbaru
            </h2>
            <p className="text-xs text-stone-500">
              Arsip seluruh bukti transfer dana yang telah diproses (Terverifikasi
              / Ditolak)
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-stone-400" />
              <input
                type="text"
                value={historySearch}
                onChange={(e) => {
                  setHistorySearch(e.target.value)
                  setHistoryPage(1)
                }}
                placeholder="Cari siswa atau pengawas..."
                className="rounded-xl border border-stone-200 bg-stone-50/50 pl-9 pr-3 py-1.5 text-xs text-stone-800 placeholder-stone-400 focus:border-orange-500 focus:bg-white focus:outline-none"
              />
            </div>

            <select
              value={historyStatusFilter}
              onChange={(e) => {
                setHistoryStatusFilter(e.target.value)
                setHistoryPage(1)
              }}
              className="rounded-xl border border-stone-200 bg-stone-50/50 px-3 py-1.5 text-xs text-stone-700 focus:border-orange-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="verified">Terverifikasi</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
        </div>

        {/* Tabel Riwayat */}
        <div className="overflow-x-auto border border-stone-200/80 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm text-stone-700 border-collapse">
            <thead className="bg-stone-50 text-[11px] font-bold uppercase tracking-wider text-stone-500 border-b border-stone-200/80">
              <tr>
                <th scope="col" className="px-5 py-3.5">
                  Tanggal Diproses
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Nama Siswa
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Pengawas & Wilayah
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Nominal
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Bukti
                </th>
                <th scope="col" className="px-5 py-3.5 text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {paginatedHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-stone-400">
                    Tidak ada riwayat verifikasi yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                paginatedHistory.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-stone-50/60 transition-colors"
                  >
                    {/* Tanggal */}
                    <td className="px-5 py-3.5 font-mono text-stone-600">
                      {item.processedAt
                        ? new Date(item.processedAt).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : new Date(item.tanggal).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                    </td>

                    {/* Nama Siswa */}
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/dashboard/data-anak-asuh/${item.student.id}`}
                        className="font-bold text-stone-900 hover:text-orange-600 transition"
                      >
                        {item.student.fullName}
                      </Link>
                      <p className="text-[11px] text-stone-500">
                        {item.student.schoolName} ({item.student.gradeLevel})
                      </p>
                    </td>

                    {/* Pengawas & Wilayah */}
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-stone-800 block">
                        {item.pengawas.name}
                      </span>
                      <span className="text-[11px] text-stone-500 flex items-center gap-1">
                        <MapPin className="size-3 text-orange-500" />
                        {item.student.wilayah}
                      </span>
                    </td>

                    {/* Nominal */}
                    <td className="px-5 py-3.5 font-bold text-stone-800">
                      {item.nominal !== null && item.nominal !== undefined
                        ? `Rp ${item.nominal.toLocaleString("id-ID")}`
                        : "-"}
                    </td>

                    {/* Bukti */}
                    <td className="px-5 py-3.5">
                      {item.fileUrl ? (
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-bold text-stone-700 hover:bg-stone-200 transition"
                        >
                          <FileText className="size-3" />
                          <span>Lihat File</span>
                          <ExternalLink className="size-2.5 text-stone-400" />
                        </a>
                      ) : (
                        <span className="text-stone-400 italic text-[11px]">
                          Tidak Ada File
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5 text-right">
                      {item.status === "verified" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="size-3 text-emerald-500" />
                          Terverifikasi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
                          <XCircle className="size-3 text-rose-500" />
                          Ditolak
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-stone-500">
          <div>
            Menampilkan{" "}
            <strong className="font-bold text-stone-900">
              {totalHistoryItems === 0
                ? 0
                : (validHistoryPage - 1) * historyPageSize + 1}
            </strong>{" "}
            -{" "}
            <strong className="font-bold text-stone-900">
              {Math.min(validHistoryPage * historyPageSize, totalHistoryItems)}
            </strong>{" "}
            dari{" "}
            <strong className="font-bold text-stone-900">
              {totalHistoryItems}
            </strong>{" "}
            berkas riwayat
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={validHistoryPage <= 1}
              onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="size-3.5" />
              <span>Sebelumnya</span>
            </button>

            <span className="px-2 font-bold text-stone-800">
              Hal {validHistoryPage} dari {totalHistoryPages}
            </span>

            <button
              type="button"
              disabled={validHistoryPage >= totalHistoryPages}
              onClick={() => setHistoryPage((p) => Math.min(totalHistoryPages, p + 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
