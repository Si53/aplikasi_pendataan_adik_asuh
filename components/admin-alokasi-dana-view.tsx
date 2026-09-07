"use client"

import { useState, useMemo, useTransition } from "react"
import Link from "next/link"
import {
  Wallet,
  Users,
  TrendingUp,
  Coins,
  Search,
  Download,
  Filter,
  ArrowUpDown,
  History,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Building2,
  MapPin,
  ExternalLink,
  Plus,
  X,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  Loader2,
  Info,
} from "lucide-react"
import { createBantuanAdjustmentAction } from "@/app/actions/admin"

export interface AlokasiDisbursementItem {
  id: number
  tanggal: string
  nominal: number | null
  fileUrl: string
  processedAt: string | null
  pengawasName: string
}

export interface AlokasiAdjustmentItem {
  id: number
  createdAt: string
  nominalLama: number
  nominalBaru: number
  catatan: string | null
  adminName: string
}

export interface AlokasiYearlySummary {
  year: number
  totalNominal: number
  count: number
}

export interface AlokasiStudentItem {
  id: number
  fullName: string
  nik: string
  schoolName: string
  gradeLevel: string
  wilayah: string
  gender: string
  pengawasName: string
  totalVerifiedNominal: number
  disbursementCount: number
  lastVerifiedDate: string | null
  yearlySummaries: AlokasiYearlySummary[]
  disbursements: AlokasiDisbursementItem[]
  adjustments: AlokasiAdjustmentItem[]
}

interface AdminAlokasiDanaViewProps {
  stats: {
    totalTersalurkan6Bulan: number
    adikAsuhMenerimaCount: number
    avgPerPenyaluran6Bulan: number
  }
  students: AlokasiStudentItem[]
  wilayahList: string[]
}

function formatRupiah(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID")
}

function formatNominalInput(val: string | number): string {
  if (!val) return ""
  const num = typeof val === "string" ? parseInt(val.replace(/\D/g, ""), 10) : val
  if (isNaN(num)) return ""
  return num.toLocaleString("id-ID")
}

export function AdminAlokasiDanaView({
  stats,
  students,
  wilayahList,
}: AdminAlokasiDanaViewProps) {
  // Table state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedWilayah, setSelectedWilayah] = useState("all")
  const [selectedJenjang, setSelectedJenjang] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortBy, setSortBy] = useState<"total-desc" | "total-asc" | "name-asc" | "date-desc">("total-desc")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // Modal detail state
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)
  const [showAdjustmentForm, setShowAdjustmentForm] = useState(false)
  const [adjNominalRaw, setAdjNominalRaw] = useState("")
  const [adjCatatan, setAdjCatatan] = useState("")
  const [isSubmittingAdj, startTransition] = useTransition()
  const [adjError, setAdjError] = useState<string | null>(null)
  const [adjSuccess, setAdjSuccess] = useState<string | null>(null)
  const [exportNotice, setExportNotice] = useState(false)

  const activeStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || null
  }, [students, selectedStudentId])

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchName = s.fullName.toLowerCase().includes(q)
        const matchNik = s.nik.toLowerCase().includes(q)
        const matchSchool = s.schoolName.toLowerCase().includes(q)
        if (!matchName && !matchNik && !matchSchool) return false
      }

      // Wilayah
      if (selectedWilayah !== "all" && s.wilayah !== selectedWilayah) {
        return false
      }

      // Jenjang (SD, SMP, SMA, Kuliah)
      if (selectedJenjang !== "all") {
        const grade = s.gradeLevel.toLowerCase()
        if (selectedJenjang === "SD" && !grade.includes("sd")) return false
        if (selectedJenjang === "SMP" && !grade.includes("smp")) return false
        if (selectedJenjang === "SMA" && !grade.includes("sma") && !grade.includes("smk")) return false
        if (selectedJenjang === "KULIAH" && !grade.includes("kuliah") && !grade.includes("univ") && !grade.includes("d3") && !grade.includes("s1")) return false
      }

      // Status penerimaan
      if (selectedStatus === "received" && s.disbursementCount === 0) return false
      if (selectedStatus === "never" && s.disbursementCount > 0) return false

      return true
    }).sort((a, b) => {
      if (sortBy === "total-desc") {
        return b.totalVerifiedNominal - a.totalVerifiedNominal
      }
      if (sortBy === "total-asc") {
        return a.totalVerifiedNominal - b.totalVerifiedNominal
      }
      if (sortBy === "name-asc") {
        return a.fullName.localeCompare(b.fullName)
      }
      if (sortBy === "date-desc") {
        const dateA = a.lastVerifiedDate ? new Date(a.lastVerifiedDate).getTime() : 0
        const dateB = b.lastVerifiedDate ? new Date(b.lastVerifiedDate).getTime() : 0
        return dateB - dateA
      }
      return 0
    })
  }, [students, searchQuery, selectedWilayah, selectedJenjang, selectedStatus, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1
  const validPage = Math.min(Math.max(1, currentPage), totalPages)
  const paginatedStudents = useMemo(() => {
    const start = (validPage - 1) * pageSize
    return filteredStudents.slice(start, start + pageSize)
  }, [filteredStudents, validPage, pageSize])

  // Submit Koreksi Manual (BantuanAdjustment)
  const handleCreateAdjustment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeStudent) return

    setAdjError(null)
    setAdjSuccess(null)

    const num = parseInt(adjNominalRaw.replace(/\D/g, ""), 10)
    if (isNaN(num) || num < 0) {
      setAdjError("Silakan masukkan nominal penyesuaian yang valid.")
      return
    }

    startTransition(async () => {
      const nominalLama = activeStudent.totalVerifiedNominal
      const res = await createBantuanAdjustmentAction(
        activeStudent.id,
        nominalLama,
        num,
        adjCatatan
      )

      if (res.success) {
        setAdjSuccess("Catatan penyesuaian dana berhasil disimpan.")
        setAdjNominalRaw("")
        setAdjCatatan("")
        setShowAdjustmentForm(false)
        setTimeout(() => setAdjSuccess(null), 4000)
      } else {
        setAdjError(res.error || "Gagal menyimpan penyesuaian.")
      }
    })
  }

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Nama Siswa",
      "NIK",
      "Jenjang & Kelas",
      "Sekolah",
      "Wilayah",
      "Pengawas",
      "Total Diterima (Rp)",
      "Jumlah Penyaluran",
      "Terakhir Diverifikasi",
    ]

    const rows = filteredStudents.map((s) => [
      s.id,
      `"${s.fullName.replace(/"/g, '""')}"`,
      `'${s.nik}`,
      `"${s.gradeLevel.replace(/"/g, '""')}"`,
      `"${s.schoolName.replace(/"/g, '""')}"`,
      `"${s.wilayah}"`,
      `"${s.pengawasName.replace(/"/g, '""')}"`,
      s.totalVerifiedNominal,
      s.disbursementCount,
      s.lastVerifiedDate
        ? new Date(s.lastVerifiedDate).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "Belum pernah",
    ])

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute(
      "download",
      `alokasi-dana-beasiswa-${new Date().toISOString().slice(0, 10)}.csv`
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
              AKUMULASI DANA TERVERIFIKASI
            </span>
            <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-semibold text-stone-600">
              Siklus 6 Bulan
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Alokasi Dana
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl">
            Laporan akumulasi dana beasiswa yang telah diverifikasi disalurkan kepada
            masing-masing adik asuh per periode semester dan sepanjang waktu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-stone-700 hover:bg-stone-50 hover:text-stone-900 shadow-2xs transition cursor-pointer"
          >
            <Download className="size-4 text-stone-500" />
            <span>Export Laporan</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>Laporan alokasi dana berhasil diexport ke file CSV.</span>
        </div>
      )}

      {/* 2. TIGA KARTU STATISTIK (6 Bulan Terakhir) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Kartu 1: Total Tersalurkan (6 Bulan Terakhir) */}
        <div className="relative overflow-hidden rounded-3xl border border-orange-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Total Tersalurkan
            </span>
            <div className="flex size-10 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
              <Wallet className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {formatRupiah(stats.totalTersalurkan6Bulan)}
            </p>
            <p className="mt-1 text-xs text-stone-500 font-medium">
              6 Bulan Terakhir (Terverifikasi)
            </p>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-orange-700 font-semibold bg-orange-50/80 rounded-lg px-2.5 py-1 w-fit">
            <Calendar className="size-3" />
            <span>Penyaluran Semester Berjalan</span>
          </div>
        </div>

        {/* Kartu 2: Adik Asuh Menerima (6 Bulan Terakhir) */}
        <div className="relative overflow-hidden rounded-3xl border border-orange-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Adik Asuh Menerima
            </span>
            <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Users className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {stats.adikAsuhMenerimaCount}{" "}
              <span className="text-base font-bold text-stone-400">Siswa</span>
            </p>
            <p className="mt-1 text-xs text-stone-500 font-medium">
              Minimal 1x penyaluran dalam 6 bulan
            </p>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-800 font-semibold bg-amber-50/80 rounded-lg px-2.5 py-1 w-fit">
            <ShieldCheck className="size-3" />
            <span>Penerima Manfaat Aktif</span>
          </div>
        </div>

        {/* Kartu 3: Rata-rata per Penyaluran (6 Bulan Terakhir) */}
        <div className="relative overflow-hidden rounded-3xl border border-orange-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Rata-rata per Penyaluran
            </span>
            <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {formatRupiah(stats.avgPerPenyaluran6Bulan)}
            </p>
            <p className="mt-1 text-xs text-stone-500 font-medium">
              Nominal rata-rata per bukti terverifikasi
            </p>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold bg-emerald-50/80 rounded-lg px-2.5 py-1 w-fit">
            <Coins className="size-3" />
            <span>Bantuan per Semester</span>
          </div>
        </div>
      </div>

      {/* 3. TABEL DAFTAR SISWA & AKUMULASI DANA */}
      <div className="rounded-3xl border border-stone-200/90 bg-white p-6 shadow-xs space-y-6">
        {/* Controls: Search, Filters, Sorting */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Cari nama adik asuh, NIK, atau sekolah..."
              className="h-10.5 w-full rounded-2xl border border-stone-200 bg-stone-50/50 pl-10 pr-4 text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Wilayah Filter */}
            <select
              value={selectedWilayah}
              onChange={(e) => {
                setSelectedWilayah(e.target.value)
                setCurrentPage(1)
              }}
              className="h-10.5 rounded-2xl border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="all">Semua Wilayah</option>
              {wilayahList.map((w) => (
                <option key={w} value={w}>
                  Wilayah {w}
                </option>
              ))}
            </select>

            {/* Jenjang Filter */}
            <select
              value={selectedJenjang}
              onChange={(e) => {
                setSelectedJenjang(e.target.value)
                setCurrentPage(1)
              }}
              className="h-10.5 rounded-2xl border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="all">Semua Jenjang</option>
              <option value="SD">Jenjang SD</option>
              <option value="SMP">Jenjang SMP</option>
              <option value="SMA">Jenjang SMA/SMK</option>
              <option value="KULIAH">Perguruan Tinggi</option>
            </select>

            {/* Status Penyaluran Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value)
                setCurrentPage(1)
              }}
              className="h-10.5 rounded-2xl border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="all">Semua Status</option>
              <option value="received">Pernah Menerima</option>
              <option value="never">Belum Pernah Menerima</option>
            </select>

            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-10.5 rounded-2xl border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="total-desc">Total Diterima (Tertinggi)</option>
              <option value="total-asc">Total Diterima (Terendah)</option>
              <option value="name-asc">Nama Siswa (A - Z)</option>
              <option value="date-desc">Terakhir Diverifikasi (Terbaru)</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto rounded-2xl border border-stone-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Nama Adik Asuh</th>
                <th className="py-3.5 px-4">Jenjang & Sekolah</th>
                <th className="py-3.5 px-4">Total Diterima (Sepanjang Waktu)</th>
                <th className="py-3.5 px-4">Terakhir Diverifikasi</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400">
                    <Coins className="size-8 text-stone-300 mx-auto mb-2" />
                    <p className="font-bold text-stone-600 text-sm">
                      Tidak ada data adik asuh ditemukan
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Coba sesuaikan kata kunci pencarian atau filter wilayah/jenjang.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((st) => {
                  const initials = st.fullName
                    .split(" ")
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()

                  return (
                    <tr
                      key={st.id}
                      className="hover:bg-orange-50/30 transition-colors group"
                    >
                      {/* 1. Nama Adik Asuh (Avatar + Nama + NIK) */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 font-bold text-xs text-white shadow-2xs">
                            {initials}
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <Link
                              href={`/admin/dashboard/data-anak-asuh/${st.id}`}
                              className="font-bold text-stone-900 hover:text-orange-600 transition block truncate"
                            >
                              {st.fullName}
                            </Link>
                            <p className="text-[11px] font-mono text-stone-400">
                              NIK: {st.nik}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 2. Jenjang & Sekolah */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-extrabold text-stone-700">
                              {st.gradeLevel}
                            </span>
                            <span className="text-stone-400 text-xs">•</span>
                            <span className="text-[11px] font-semibold text-orange-700">
                              Wilayah {st.wilayah}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 truncate max-w-[200px]">
                            {st.schoolName}
                          </p>
                        </div>
                      </td>

                      {/* 3. Total Diterima (Sepanjang Waktu) */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <p className="text-sm font-black text-stone-900 font-mono">
                            {formatRupiah(st.totalVerifiedNominal)}
                          </p>
                          <p className="text-[11px] text-stone-400">
                            {st.disbursementCount > 0
                              ? `${st.disbursementCount}x penyaluran terverifikasi`
                              : "Belum pernah disalurkan"}
                          </p>
                        </div>
                      </td>

                      {/* 4. Terakhir Diverifikasi */}
                      <td className="py-4 px-4">
                        {st.lastVerifiedDate ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="size-3 text-emerald-500" />
                              {new Date(st.lastVerifiedDate).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            <p className="text-[11px] text-stone-400">
                              Oleh: {st.pengawasName}
                            </p>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-500">
                            <Clock className="size-3 text-stone-400" />
                            Belum pernah
                          </span>
                        )}
                      </td>

                      {/* 5. Aksi: Tombol Lihat Riwayat */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStudentId(st.id)
                            setShowAdjustmentForm(false)
                            setAdjError(null)
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50/70 px-3 py-1.5 text-xs font-bold text-orange-950 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition shadow-2xs cursor-pointer group"
                        >
                          <History className="size-3.5 text-orange-600 group-hover:text-white transition" />
                          <span>Lihat Riwayat</span>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 text-xs text-stone-500">
          <p>
            Menampilkan{" "}
            <strong>
              {paginatedStudents.length > 0 ? (validPage - 1) * pageSize + 1 : 0}
            </strong>{" "}
            -{" "}
            <strong>
              {Math.min(validPage * pageSize, filteredStudents.length)}
            </strong>{" "}
            dari <strong>{filteredStudents.length}</strong> adik asuh
          </p>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              type="button"
              disabled={validPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Sebelumnya
            </button>
            <span className="px-2 font-bold text-stone-700">
              {validPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={validPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MODAL "LIHAT RIWAYAT" (PER SISWA) */}
      {/* ========================================================================= */}
      {activeStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedStudentId(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 border-b border-stone-100 bg-gradient-to-r from-orange-50/60 via-amber-50/40 to-white">
              <div className="flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 font-black text-lg text-white shadow-md shadow-orange-500/20">
                  {activeStudent.fullName
                    .split(" ")
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-stone-900">
                      {activeStudent.fullName}
                    </h2>
                    <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-extrabold text-orange-800">
                      AKA-{activeStudent.id}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    {activeStudent.schoolName} ({activeStudent.gradeLevel}) • Wilayah {activeStudent.wilayah}
                  </p>
                  <p className="text-[11px] text-stone-400 font-mono">
                    NIK: {activeStudent.nik} • Pengawas: {activeStudent.pengawasName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudentId(null)}
                className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Feedback Notifikasi */}
              {adjSuccess && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs sm:text-sm text-emerald-900 flex items-center gap-3">
                  <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                  <span>{adjSuccess}</span>
                </div>
              )}
              {adjError && (
                <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs sm:text-sm text-rose-900 flex items-center gap-3">
                  <AlertCircle className="size-5 text-rose-600 shrink-0" />
                  <span>{adjError}</span>
                </div>
              )}

              {/* 1. Total Keseluruhan yang Sudah Diterima Siswa Ini */}
              <div className="rounded-2xl bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 p-6 text-white shadow-lg shadow-orange-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                    Total Dana Beasiswa Diterima
                  </span>
                  <p className="text-3xl sm:text-4xl font-black tracking-tight">
                    {formatRupiah(activeStudent.totalVerifiedNominal)}
                  </p>
                  <p className="text-xs text-white/90">
                    Akumulasi sepanjang waktu dari {activeStudent.disbursementCount}x penyaluran terverifikasi
                  </p>
                </div>

                <div className="flex flex-col gap-1 items-start sm:items-end">
                  <Link
                    href={`/admin/dashboard/data-anak-asuh/${activeStudent.id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 hover:bg-white/30 px-3.5 py-2 text-xs font-bold text-white transition backdrop-blur-md"
                  >
                    <span>Lihat Profil Lengkap</span>
                    <ExternalLink className="size-3" />
                  </Link>
                </div>
              </div>

              {/* 2. BREAKDOWN PER TAHUN */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <Calendar className="size-4 text-orange-500" />
                    <span>Breakdown Penyaluran per Tahun</span>
                  </h3>
                  <span className="text-xs text-stone-400">
                    {activeStudent.yearlySummaries.length} Periode Tahun
                  </span>
                </div>

                {activeStudent.yearlySummaries.length === 0 ? (
                  <div className="py-6 text-center text-xs text-stone-400 rounded-2xl bg-stone-50 border border-dashed border-stone-200">
                    Belum ada riwayat penyaluran dana yang terverifikasi untuk siswa ini.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {activeStudent.yearlySummaries.map((ys) => (
                      <div
                        key={ys.year}
                        className="rounded-2xl border border-orange-100 bg-orange-50/40 p-4 space-y-1"
                      >
                        <span className="text-xs font-bold text-orange-800">
                          Tahun {ys.year}
                        </span>
                        <p className="text-base font-black text-stone-900 font-mono">
                          {formatRupiah(ys.totalNominal)}
                        </p>
                        <p className="text-[11px] text-stone-500 font-medium">
                          {ys.count}x penyaluran terverifikasi
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. LIST DETAIL TIAP PENYALURAN */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <FileText className="size-4 text-orange-500" />
                  <span>Daftar Bukti Penyaluran Terverifikasi</span>
                </h3>

                {activeStudent.disbursements.length === 0 ? (
                  <div className="py-6 text-center text-xs text-stone-400 rounded-2xl bg-stone-50 border border-dashed border-stone-200">
                    Belum ada bukti penyaluran terverifikasi.
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
                    {activeStudent.disbursements.map((d) => (
                      <div
                        key={d.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/60 transition"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 font-mono text-sm">
                              {d.nominal ? formatRupiah(d.nominal) : "Rp -"}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              <CheckCircle2 className="size-3 text-emerald-500" />
                              Terverifikasi
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400">
                            <span>
                              Diserahkan:{" "}
                              {new Date(d.tanggal).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                            <span>•</span>
                            <span>Pengawas: <strong>{d.pengawasName}</strong></span>
                            {d.processedAt && (
                              <>
                                <span>•</span>
                                <span>
                                  Diverifikasi:{" "}
                                  {new Date(d.processedAt).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {d.fileUrl && (
                          <a
                            href={d.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200 shrink-0 transition"
                          >
                            <span>Lihat Bukti</span>
                            <ExternalLink className="size-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. RIWAYAT BANTUAN ADJUSTMENT (KOREKSI MANUAL) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <History className="size-4 text-amber-500" />
                    <span>Catatan Penyesuaian & Koreksi Dana</span>
                  </h3>

                  {!showAdjustmentForm && (
                    <button
                      type="button"
                      onClick={() => setShowAdjustmentForm(true)}
                      className="inline-flex items-center gap-1 rounded-xl bg-orange-500 hover:bg-orange-600 px-3 py-1.5 text-xs font-bold text-white transition shadow-xs cursor-pointer"
                    >
                      <Plus className="size-3.5" />
                      <span>Tambah Koreksi</span>
                    </button>
                  )}
                </div>

                {/* Form Tambah Koreksi */}
                {showAdjustmentForm && (
                  <form
                    onSubmit={handleCreateAdjustment}
                    className="rounded-2xl border border-orange-200 bg-orange-50/40 p-4 sm:p-5 space-y-4 animate-in fade-in"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-orange-200/60">
                      <p className="text-xs font-bold text-orange-900">
                        Formulir Penyesuaian Nominal Manual
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowAdjustmentForm(false)}
                        className="text-stone-400 hover:text-stone-600"
                      >
                        <X className="size-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700">
                          Nominal Tercatat Saat Ini
                        </label>
                        <input
                          type="text"
                          disabled
                          value={formatRupiah(activeStudent.totalVerifiedNominal)}
                          className="h-10 w-full rounded-xl border border-stone-200 bg-stone-100 px-3 text-xs font-mono font-bold text-stone-600"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700">
                          Nominal Penyesuaian Baru (Rp) *
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={formatNominalInput(adjNominalRaw)}
                          onChange={(e) => setAdjNominalRaw(e.target.value.replace(/\D/g, ""))}
                          placeholder="Contoh: 1.500.000"
                          required
                          className="h-10 w-full rounded-xl border border-orange-300 bg-white px-3 text-xs font-mono font-bold text-stone-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">
                        Catatan Alasan Koreksi
                      </label>
                      <textarea
                        rows={2}
                        value={adjCatatan}
                        onChange={(e) => setAdjCatatan(e.target.value)}
                        placeholder="Contoh: Penyesuaian selisih transfer SPP semester ganjil yang dibayarkan langsung ke sekolah..."
                        className="w-full rounded-xl border border-stone-200 bg-white p-3 text-xs text-stone-800 placeholder:text-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAdjustmentForm(false)}
                        className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingAdj}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs transition disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmittingAdj ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="size-3.5" />
                        )}
                        <span>{isSubmittingAdj ? "Menyimpan..." : "Simpan Koreksi"}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* List Riwayat Adjustment */}
                {activeStudent.adjustments.length === 0 ? (
                  <p className="text-xs text-stone-400 py-3 text-center bg-stone-50 rounded-xl border border-stone-100">
                    Belum ada catatan koreksi manual untuk adik asuh ini.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {activeStudent.adjustments.map((adj) => (
                      <div
                        key={adj.id}
                        className="rounded-xl border border-stone-200 bg-stone-50/60 p-3.5 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-800">
                            Penyesuaian oleh {adj.adminName}
                          </span>
                          <span className="font-mono text-[11px] text-stone-400">
                            {new Date(adj.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-stone-600">
                          <span className="line-through text-stone-400">
                            {formatRupiah(adj.nominalLama)}
                          </span>
                          <span>→</span>
                          <span className="font-bold text-orange-600">
                            {formatRupiah(adj.nominalBaru)}
                          </span>
                        </div>
                        {adj.catatan && (
                          <p className="text-stone-600 text-[11px] italic pt-1">
                            &quot;{adj.catatan}&quot;
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedStudentId(null)}
                className="rounded-xl bg-stone-200 hover:bg-stone-300 px-4 py-2 text-xs font-bold text-stone-800 transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
