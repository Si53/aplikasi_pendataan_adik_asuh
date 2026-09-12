"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpDown,
  BookOpen,
  MapPin,
  School,
  X,
  Eye,
  Sparkles,
} from "lucide-react"

export interface StudentTableItem {
  id: number
  username: string
  nik: string
  fullName: string
  schoolName: string
  gradeLevel: string
  wilayah: string
  status: "approved" | "pending" | "rejected" | string
  initialNilai: string
  latestNilai: string
  hasAcademicUpdate: boolean
  latestAcademicDate: string | null
  pengawasName: string
  createdAt: string
}

interface AdminStudentTableProps {
  students: StudentTableItem[]
  wilayahList: string[]
}

export function AdminStudentTable({
  students,
  wilayahList,
}: AdminStudentTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedWilayah, setSelectedWilayah] = useState("all")
  const [onlyNoReport, setOnlyNoReport] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Modals / Feedback
  const [selectedStudentForDetail, setSelectedStudentForDetail] =
    useState<StudentTableItem | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [exportNotice, setExportNotice] = useState(false)

  // Filter Logic
  const filteredStudents = useMemo(() => {
    return students.filter((item) => {
      // Search by Name, NIK, or School
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchName = item.fullName.toLowerCase().includes(q)
        const matchNik = item.nik.toLowerCase().includes(q)
        const matchSchool = item.schoolName.toLowerCase().includes(q)
        if (!matchName && !matchNik && !matchSchool) return false
      }

      // Filter Wilayah
      if (selectedWilayah !== "all" && item.wilayah !== selectedWilayah) {
        return false
      }

      // Quick filter: Raport Belum Masuk
      if (onlyNoReport && item.hasAcademicUpdate) {
        return false
      }

      return true
    })
  }, [students, searchQuery, selectedWilayah, onlyNoReport])

  // Count of students without report for badge on pill
  const noReportCount = useMemo(() => {
    return students.filter((s) => !s.hasAcademicUpdate).length
  }, [students])

  // Pagination Logic
  const totalItems = filteredStudents.length
  const totalPages = Math.ceil(totalItems / pageSize) || 1
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages)

  const paginatedStudents = useMemo(() => {
    const start = (validCurrentPage - 1) * pageSize
    return filteredStudents.slice(start, start + pageSize)
  }, [filteredStudents, validCurrentPage, pageSize])

  // Reset filters
  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedWilayah !== "all" ||
    onlyNoReport

  const handleResetFilters = () => {
    setSearchQuery("")
    setSelectedWilayah("all")
    setOnlyNoReport(false)
    setCurrentPage(1)
  }

  // Export CSV Functionality
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Nama Lengkap",
      "NIK",
      "Sekolah",
      "Jenjang",
      "Wilayah",
      "Pengawas",
      "Status",
      "Nilai Rata-rata",
      "Status Rapor",
    ]
    const rows = filteredStudents.map((s) => [
      s.id,
      `"${s.fullName.replace(/"/g, '""')}"`,
      `'${s.nik}`,
      `"${s.schoolName.replace(/"/g, '""')}"`,
      `"${s.gradeLevel}"`,
      `"${s.wilayah}"`,
      `"${s.pengawasName}"`,
      s.status === "approved"
        ? "Aktif Penuh"
        : s.status === "alumni"
        ? "Alumni"
        : s.status === "nonaktif"
        ? "Nonaktif"
        : s.status === "pending"
        ? "Peninjauan"
        : "Ditolak",
      s.latestNilai,
      s.hasAcademicUpdate ? "Sudah Ada Rapor" : "Belum Ada Rapor",
    ])

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute(
      "download",
      `data-anak-asuh-${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setExportNotice(true)
    setTimeout(() => setExportNotice(false), 4000)
  }

  // Helper for Status Badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/80">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Aktif Penuh
          </span>
        )
      case "alumni":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200/80">
            <span className="size-1.5 rounded-full bg-blue-500" />
            Alumni
          </span>
        )
      case "nonaktif":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-600 border border-stone-300">
            <span className="size-1.5 rounded-full bg-stone-500" />
            Nonaktif
          </span>
        )
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200/80">
            <span className="size-1.5 rounded-full bg-amber-500" />
            Peninjauan
          </span>
        )
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-200/80">
            <span className="size-1.5 rounded-full bg-rose-500" />
            Ditolak
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-700 border border-stone-200">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="space-y-5">
      {/* Search & Filter Toolbar */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col gap-4">
          {/* Top Row: Search & Dropdowns */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            {/* Search Bar */}
            <div className="relative md:col-span-8">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Cari nama anak asuh, NIK, atau nama sekolah..."
                className="w-full rounded-xl border border-stone-200 bg-stone-50/50 pl-10 pr-9 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-200/60"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Wilayah Dropdown */}
            <div className="md:col-span-4">
              <select
                value={selectedWilayah}
                onChange={(e) => {
                  setSelectedWilayah(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-sm text-stone-700 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition cursor-pointer"
              >
                <option value="all">Semua Wilayah</option>
                {wilayahList.map((w) => (
                  <option key={w} value={w}>
                    Wilayah: {w}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bottom Row: Quick Filter Pills & Reset Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-stone-500 flex items-center gap-1.5 mr-1">
                <Filter className="size-3.5 text-stone-400" /> Filter Cepat:
              </span>

              {/* Pill: Raport Belum Masuk */}
              <button
                type="button"
                onClick={() => {
                  setOnlyNoReport(!onlyNoReport)
                  setCurrentPage(1)
                }}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  onlyNoReport
                    ? "bg-amber-500 text-white shadow-xs shadow-amber-500/25"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900 border border-stone-200/60"
                }`}
              >
                <AlertCircle className="size-3.5" />
                <span>Raport Belum Masuk</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    onlyNoReport
                      ? "bg-amber-600 text-white"
                      : "bg-stone-200 text-stone-700"
                  }`}
                >
                  {noReportCount}
                </span>
              </button>
            </div>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
              >
                <X className="size-3.5" />
                <span>Reset Semua Filter</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Export Success Notice */}
      {exportNotice && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>
            File CSV berhasil diexport dengan {filteredStudents.length} data anak
            asuh.
          </span>
        </div>
      )}

      {/* Table Card */}
      <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-700 border-collapse">
            <thead className="bg-stone-50/80 text-[11px] font-bold uppercase tracking-wider text-stone-500 border-b border-stone-200/80">
              <tr>
                <th scope="col" className="px-5 py-3.5">
                  Anak Asuh
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Jenjang & Sekolah
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Wilayah / Pengawas
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Status
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Nilai Rata-rata
                </th>
                <th scope="col" className="px-5 py-3.5 text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-stone-500">
                      <div className="size-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                        <Search className="size-6" />
                      </div>
                      <p className="font-bold text-stone-800 text-base">
                        Tidak Ada Data Ditemukan
                      </p>
                      <p className="mt-1 text-xs text-stone-500">
                        Tidak ditemukan data anak asuh yang cocok dengan filter
                        atau pencarian Anda.
                      </p>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white hover:bg-orange-600 transition"
                        >
                          Reset Filter
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((item) => {
                  const initial = item.fullName.charAt(0).toUpperCase() || "A"
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-stone-50/60 transition-colors"
                    >
                      {/* 1. Anak Asuh (Avatar inisial + nama + NIK) */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 font-bold text-stone-700 border border-stone-200 shadow-2xs">
                            {initial}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-stone-900 text-sm truncate">
                              {item.fullName}
                            </span>
                            <span className="text-[11px] font-mono text-stone-500">
                              NIK: {item.nik}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 2. Jenjang & Sekolah */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-stone-800 text-xs sm:text-sm">
                            {item.schoolName}
                          </span>
                          <span className="text-xs text-stone-500">
                            {item.gradeLevel}
                          </span>
                        </div>
                      </td>

                      {/* 3. Wilayah / Pengawas */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="inline-flex items-center gap-1 font-semibold text-stone-800 text-xs">
                            <MapPin className="size-3 text-orange-500" />
                            {item.wilayah}
                          </span>
                          <span className="text-[11px] text-stone-500">
                            Pengawas: {item.pengawasName}
                          </span>
                        </div>
                      </td>

                      {/* 4. Status */}
                      <td className="px-5 py-4">
                        {renderStatusBadge(item.status)}
                      </td>

                      {/* 5. Nilai Rata-rata */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-stone-900 text-sm">
                            {item.latestNilai || "-"}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {item.hasAcademicUpdate
                              ? "Rapor Terbaru"
                              : "Nilai Awal (Belum Update)"}
                          </span>
                        </div>
                      </td>

                      {/* 6. Aksi */}
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/dashboard/data-anak-asuh/${item.id}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-bold text-stone-700 hover:bg-orange-500 hover:text-white transition cursor-pointer border border-stone-200/80"
                        >
                          <Eye className="size-3.5" />
                          <span>Detail</span>
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-stone-200/80 bg-stone-50/50">
          <div className="flex items-center gap-4 text-xs text-stone-600">
            <span>
              Menampilkan{" "}
              <strong className="font-bold text-stone-900">
                {totalItems === 0 ? 0 : (validCurrentPage - 1) * pageSize + 1}
              </strong>{" "}
              -{" "}
              <strong className="font-bold text-stone-900">
                {Math.min(validCurrentPage * pageSize, totalItems)}
              </strong>{" "}
              dari{" "}
              <strong className="font-bold text-stone-900">{totalItems}</strong>{" "}
              anak asuh
            </span>

            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-stone-400">|</span>
              <span>Baris per halaman:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="rounded-lg border border-stone-200 bg-white px-2 py-1 text-xs text-stone-700 focus:border-orange-500 focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={validCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="size-4" />
              <span>Sebelumnya</span>
            </button>

            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  // Show current, first, last, and immediate neighbors
                  return (
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - validCurrentPage) <= 1
                  )
                })
                .map((pageNumber, idx, arr) => {
                  const prev = arr[idx - 1]
                  const showEllipsis = prev && pageNumber - prev > 1
                  return (
                    <div key={pageNumber} className="flex items-center">
                      {showEllipsis && (
                        <span className="px-1 text-xs text-stone-400">...</span>
                      )}
                      <button
                        type="button"
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`size-7 rounded-lg text-xs font-bold transition ${
                          validCurrentPage === pageNumber
                            ? "bg-orange-500 text-white shadow-2xs"
                            : "text-stone-600 hover:bg-stone-100"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    </div>
                  )
                })}
            </div>

            <button
              type="button"
              disabled={validCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Export Handler Bridge */}
      <div id="export-action-bridge" className="hidden">
        <button id="btn-export-csv-trigger" onClick={handleExportCSV}>
          Trigger Export
        </button>
      </div>

      {/* Detail Modal Preview (Fase 1 placeholder before Fase 2 deep dive) */}
      {selectedStudentForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-orange-500 text-white font-bold text-lg shadow-xs">
                  {selectedStudentForDetail.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    {selectedStudentForDetail.fullName}
                  </h3>
                  <p className="text-xs font-mono text-stone-500">
                    NIK: {selectedStudentForDetail.nik}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudentForDetail(null)}
                className="p-1 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70">
                  <span className="text-stone-400 font-medium">Status</span>
                  <div className="mt-1">
                    {renderStatusBadge(selectedStudentForDetail.status)}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70">
                  <span className="text-stone-400 font-medium">
                    Nilai Rata-rata
                  </span>
                  <p className="mt-1 font-bold text-stone-900 text-sm">
                    {selectedStudentForDetail.latestNilai || "-"}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-500">Sekolah:</span>
                  <span className="font-semibold text-stone-800">
                    {selectedStudentForDetail.schoolName} (
                    {selectedStudentForDetail.gradeLevel})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Wilayah:</span>
                  <span className="font-semibold text-stone-800">
                    {selectedStudentForDetail.wilayah}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Pengawas:</span>
                  <span className="font-semibold text-stone-800">
                    {selectedStudentForDetail.pengawasName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Update Rapor:</span>
                  <span
                    className={`font-semibold ${
                      selectedStudentForDetail.hasAcademicUpdate
                        ? "text-emerald-700"
                        : "text-amber-700"
                    }`}
                  >
                    {selectedStudentForDetail.hasAcademicUpdate
                      ? "Sudah ada update nilai"
                      : "Belum pernah update nilai"}
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-orange-50 border border-orange-200 p-3 text-orange-900">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-orange-600" />
                  Informasi Fase 2
                </p>
                <p className="mt-1 text-[11px] text-orange-800 leading-relaxed">
                  Panel detail per-anak yang mendalam (arsip dokumen rapor,
                  riwayat audit finansial, rincian SPP, dan catatan pengawas)
                  akan aktif pada pengerjaan Fase 2 berikutnya.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedStudentForDetail(null)}
                className="rounded-xl bg-stone-100 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-200"
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
