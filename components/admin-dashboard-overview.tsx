"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Users,
  Clock,
  ShieldCheck,
  ReceiptText,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Building2,
  UserCheck,
  AlertTriangle,
  Sparkles,
  Download,
  Plus,
  Calendar,
  ExternalLink,
  GraduationCap,
  BookOpen,
  MapPin,
  Check,
  X,
  Coins,
} from "lucide-react"

export interface JenjangBudgetItem {
  jenjang: "SD" | "SMP" | "SMA" | "SMK" | "Kuliah"
  tarif: number
  studentCount: number
  subtotal: number
}

export interface BudgetOverviewData {
  totalAnggaran: number
  totalApprovedStudents: number
  unassignedCount: number
  items: JenjangBudgetItem[]
}

export interface QuickAuditPendingItem {
  id: number
  tanggal: string
  nominal: number | null
  student: {
    id: number
    fullName: string
    schoolName: string
    wilayah: string
  }
  pengawas: {
    id: number
    name: string
    wilayah: string
  }
}

interface AdminDashboardOverviewProps {
  adminName: string
  stats: {
    totalStudents: number
    approvedStudents: number
    activePercentage: number
    pendingStudents: number
    totalPengawas: number
    distinctWilayahCount: number
    pendingAuditCount: number
    totalDanaVerifiedAll: number
    raporBelumDiunggahCount: number
    perluPerhatianAcademicCount: number
  }
  budgetOverview: BudgetOverviewData
  quickAuditItems: QuickAuditPendingItem[]
}

function formatRupiah(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID")
}

export function AdminDashboardOverview({
  adminName,
  stats,
  budgetOverview,
  quickAuditItems,
}: AdminDashboardOverviewProps) {
  const [exportNotice, setExportNotice] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  // Quick Export Summary to CSV
  const handleExportSummary = () => {
    const lines = [
      ["RINGKASAN EKSEKUTIF PORTAL ADIK ASUH PVVD", ""],
      ["Tanggal Ekspor", new Date().toLocaleDateString("id-ID", { dateStyle: "full" })],
      ["", ""],
      ["INDIKATOR KUNCI", "NILAI"],
      ["Total Adik Asuh Terdaftar", stats.totalStudents],
      ["Adik Asuh Aktif (Approved)", `${stats.approvedStudents} (${stats.activePercentage}%)`],
      ["Menunggu Konfirmasi Status", stats.pendingStudents],
      ["Total Pengawas Lapangan", stats.totalPengawas],
      ["Jumlah Wilayah Tugas", stats.distinctWilayahCount],
      ["Audit Finansial Menunggu Verifikasi", stats.pendingAuditCount],
      ["Total Dana Tersalurkan Terverifikasi", stats.totalDanaVerifiedAll],
      ["Adik Asuh Belum Ada Rapor", stats.raporBelumDiunggahCount],
      ["Adik Asuh Perlu Perhatian Akademik", stats.perluPerhatianAcademicCount],
      ["", ""],
      ["KEBUTUHAN ANGGARAN BEASISWA (BULANAN)", ""],
      ["Total Anggaran Diperlukan", formatRupiah(budgetOverview.totalAnggaran)],
      ["Siswa Approved Terhitung", `${budgetOverview.totalApprovedStudents - budgetOverview.unassignedCount} Siswa`],
      ["Siswa Belum Ditentukan Jenjang", `${budgetOverview.unassignedCount} Siswa`],
      ["", ""],
      ["RINCIAN PER JENJANG", "TARIF STANDAR (RP)", "JUMLAH SISWA", "SUBTOTAL (RP)"],
      ...budgetOverview.items.map((b) => [
        `"${b.jenjang}"`,
        b.tarif,
        b.studentCount,
        b.subtotal,
      ]),
    ]

    const csvContent =
      "data:text/csv;charset=utf-8," +
      lines.map((e) => e.join(",")).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute(
      "download",
      `ringkasan-dashboard-admin-${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setExportNotice(true)
    setTimeout(() => setExportNotice(false), 4000)
  }

  // Max student count for distribution progress bar
  const maxStudentInJenjang = Math.max(
    ...budgetOverview.items.map((w) => w.studentCount),
    1
  )

  return (
    <div className="space-y-8">
      {/* 1. Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-700">
              <Sparkles className="size-3 text-orange-600" />
              PORTAL ADMINISTRATOR PUSAT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Selamat Datang, {adminName}!
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl">
            Ringkasan holistik penyaluran beasiswa, pengawasan lapangan, dan status
            perkembangan adik asuh Vihara Vimala Dharma.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportSummary}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-stone-700 hover:bg-stone-50 hover:text-stone-900 shadow-2xs transition cursor-pointer"
          >
            <Download className="size-4 text-stone-500" />
            <span>Export Ringkasan</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-xs shadow-orange-500/25 transition cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Tambah Anak Asuh</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>Laporan ringkasan eksekutif berhasil diexport ke file CSV.</span>
        </div>
      )}

      {/* 2. 4 KARTU STATISTIK UTAMA */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Kartu 1: Adik Asuh Aktif */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-5.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Adik Asuh Aktif
            </span>
            <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Users className="size-5" />
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <p className="text-3xl font-black text-stone-900 tracking-tight">
              {stats.approvedStudents}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
              <span>
                {stats.activePercentage}% dari total {stats.totalStudents} siswa
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Status Approved</span>
            <Link
              href="/admin/dashboard/data-anak-asuh"
              className="font-bold text-orange-600 hover:underline flex items-center gap-0.5"
            >
              Lihat Data <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>

        {/* Kartu 2: Menunggu Konfirmasi (CLICKABLE -> Kontrol Status) */}
        <Link
          href="/admin/dashboard/kontrol-status"
          className="group relative overflow-hidden rounded-3xl border border-amber-200/90 bg-white p-5.5 shadow-xs flex flex-col justify-between transition hover:border-amber-400 hover:shadow-md cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Menunggu Konfirmasi
            </span>
            <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Clock className="size-5 animate-pulse" />
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-stone-900 tracking-tight">
                {stats.pendingStudents}
              </p>
              {stats.pendingStudents > 0 && (
                <span className="rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[10px] font-extrabold text-amber-800">
                  Perlu Tindakan
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 font-medium">
              Pendaftaran baru siap diverifikasi
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px]">
            <span className="text-amber-800 font-semibold">Kontrol Status</span>
            <span className="font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Buka Review <ArrowRight className="size-3" />
            </span>
          </div>
        </Link>

        {/* Kartu 3: Pengawas Wilayah */}
        <div className="relative overflow-hidden rounded-3xl border border-stone-200/90 bg-white p-5.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Pengawas Wilayah
            </span>
            <div className="flex size-10 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
              <ShieldCheck className="size-5" />
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <p className="text-3xl font-black text-stone-900 tracking-tight">
              {stats.totalPengawas}
            </p>
            <p className="text-xs text-stone-500 font-medium">
              Mencakup <strong>{stats.distinctWilayahCount}</strong> wilayah tugas
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Petugas Lapangan</span>
            <Link
              href="/admin/dashboard/kontrol-status"
              className="font-bold text-orange-600 hover:underline flex items-center gap-0.5"
            >
              Cek Status <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>

        {/* Kartu 4: Audit Finansial (CLICKABLE -> Audit Finansial) */}
        <Link
          href="/admin/dashboard/audit-finansial"
          className="group relative overflow-hidden rounded-3xl border border-orange-200/90 bg-white p-5.5 shadow-xs flex flex-col justify-between transition hover:border-orange-400 hover:shadow-md cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Audit Finansial
            </span>
            <div className="flex size-10 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
              <ReceiptText className="size-5" />
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-stone-900 tracking-tight">
                {stats.pendingAuditCount}
              </p>
              {stats.pendingAuditCount > 5 ? (
                <span className="rounded-full bg-rose-500 text-white px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide animate-pulse">
                  Urgen
                </span>
              ) : stats.pendingAuditCount > 0 ? (
                <span className="rounded-full bg-orange-100 text-orange-800 px-2 py-0.5 text-[10px] font-bold">
                  Antrean
                </span>
              ) : null}
            </div>
            <p className="text-xs text-stone-500 font-medium">
              Bukti transfer menunggu audit Admin
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px]">
            <span className="text-orange-700 font-semibold">Tindakan Diperlukan</span>
            <span className="font-bold text-orange-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Validasi Sekarang <ArrowRight className="size-3" />
            </span>
          </div>
        </Link>
      </div>

      {/* 3. TWO-COLUMN LAYOUT: Left (Distribusi Wilayah & Audit Cepat) | Right (Kondisi Akademik & Shortcuts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* KOLOM KIRI (7 Kolom): KEBUTUHAN ANGGARAN BEASISWA */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl border border-stone-200/90 bg-white p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                    <Coins className="size-4" />
                  </div>
                  <h2 className="text-base sm:text-lg font-extrabold text-stone-900">
                    Kebutuhan Anggaran Beasiswa
                  </h2>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Estimasi kebutuhan alokasi dana beasiswa per bulan berdasarkan jenjang siswa aktif
                </p>
              </div>

              <div className="text-left sm:text-right bg-orange-50/70 border border-orange-200/80 rounded-2xl px-4 py-2.5">
                <span className="text-[11px] font-bold uppercase text-stone-500 block">
                  Total Anggaran Diperlukan
                </span>
                <span className="text-base sm:text-xl font-black text-orange-600 font-mono">
                  {formatRupiah(budgetOverview.totalAnggaran)}
                </span>
              </div>
            </div>

            {/* List Breakdown per Jenjang */}
            <div className="space-y-4">
              {budgetOverview.items.map((item) => {
                const percentage =
                  maxStudentInJenjang > 0
                    ? Math.round((item.studentCount / maxStudentInJenjang) * 100)
                    : 0

                return (
                  <div key={item.jenjang} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="inline-flex items-center justify-center min-w-[52px] font-extrabold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-lg border border-stone-200/80">
                          {item.jenjang}
                        </span>
                        <span className="text-stone-700 font-semibold">
                          {item.studentCount} Anak Asuh
                        </span>
                        <span className="text-stone-400">×</span>
                        <span className="text-stone-500 font-mono text-[11px]">
                          {formatRupiah(item.tarif)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-stone-400 hidden sm:inline">=</span>
                        <span className="font-mono font-bold text-stone-900 text-xs sm:text-sm">
                          {formatRupiah(item.subtotal)}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-stone-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-500"
                        style={{
                          width: `${Math.max(percentage, item.studentCount > 0 ? 6 : 0)}%`,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Baris tambahan jika ada siswa approved dengan jenjang = NULL */}
            {budgetOverview.unassignedCount > 0 && (
              <div className="rounded-2xl border border-stone-200/90 bg-stone-50/90 p-3.5 flex items-start sm:items-center gap-3 text-xs text-stone-600 animate-in fade-in">
                <AlertCircle className="size-4.5 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
                <div className="flex-1">
                  <p className="font-semibold text-stone-800">
                    Belum Ditentukan Jenjangnya:{" "}
                    <strong className="text-amber-800 font-bold">
                      {budgetOverview.unassignedCount} Anak Asuh
                    </strong>{" "}
                    <span className="text-stone-500 font-normal">
                      (tidak termasuk dalam total anggaran)
                    </span>
                  </p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Data terdaftar sebelum fitur jenjang ditambahkan. Silakan lengkapi pada modul Kontrol Status / Data Anak Asuh.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* AUDIT CEPAT (WIDGET SHORTCUT 3 ITEM TERBARU) */}
          <div className="rounded-3xl border border-stone-200/90 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <ReceiptText className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-stone-900">
                    Audit Cepat Bukti Transfer
                  </h3>
                  <p className="text-xs text-stone-500">
                    3 berkas penyaluran dana pending terbaru
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-orange-50 border border-orange-200 px-2.5 py-0.5 text-xs font-bold text-orange-700">
                {stats.pendingAuditCount} Pending
              </span>
            </div>

            {quickAuditItems.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-400 rounded-2xl bg-stone-50 border border-dashed border-stone-200">
                <CheckCircle2 className="size-7 text-emerald-500 mx-auto mb-1.5" />
                <p className="font-bold text-stone-800 text-sm">
                  Semua Bukti Telah Diaudit
                </p>
                <p className="text-stone-400 mt-0.5">
                  Tidak ada antrean verifikasi bukti transfer saat ini.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {quickAuditItems.map((item) => (
                  <div
                    key={item.id}
                    className="py-3.5 flex items-center justify-between gap-3 hover:bg-orange-50/30 transition rounded-xl px-2 -mx-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 text-white font-bold text-xs shadow-2xs">
                        {item.student.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-xs font-bold text-stone-900 truncate">
                          {item.student.fullName}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          {item.pengawas.name} • Wilayah {item.student.wilayah}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono font-bold text-xs text-orange-600">
                        {item.nominal ? formatRupiah(item.nominal) : "-"}
                      </span>
                      <Link
                        href="/admin/dashboard/audit-finansial"
                        className="inline-flex items-center gap-1 rounded-xl bg-orange-500 hover:bg-orange-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs transition cursor-pointer"
                      >
                        <span>Validasi</span>
                        <ArrowRight className="size-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Link to Full Audit */}
            <div className="pt-2 text-center border-t border-stone-100">
              <Link
                href="/admin/dashboard/audit-finansial"
                className="text-xs font-bold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1.5"
              >
                <span>Lihat Seluruh {stats.pendingAuditCount} Berkas Pending</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* KOLOM KANAN (5 Kolom): KONDISI & STATUS BINAAN + PANDUAN CEPAT */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 space-y-6">
          {/* KONDISI & STATUS BINAAN */}
          <div className="rounded-3xl border border-stone-200/90 bg-white p-6 shadow-xs space-y-5">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-stone-900">
                Kondisi & Status Binaan
              </h2>
              <p className="text-xs text-stone-500">
                Pemantauan kedisiplinan rapor dan standar nilai adik asuh
              </p>
            </div>

            <div className="space-y-3">
              {/* Kategori 1: Rapor Belum Diunggah */}
              <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="size-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-950">
                      Rapor Belum Diunggah
                    </span>
                  </div>
                  <span className="rounded-full bg-amber-200/70 px-2.5 py-0.5 text-xs font-black text-amber-900">
                    {stats.raporBelumDiunggahCount} Siswa
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Adik asuh belum pernah memperbarui berkas nilai rapor semester di sistem.
                </p>
              </div>

              {/* Kategori 2: Perlu Perhatian (Nilai di Bawah Standar) */}
              <div className="rounded-2xl border border-rose-200/80 bg-rose-50/50 p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="size-4 text-rose-600" />
                    <span className="text-xs font-bold text-rose-950">
                      Perlu Perhatian Nilai
                    </span>
                  </div>
                  <span className="rounded-full bg-rose-200/70 px-2.5 py-0.5 text-xs font-black text-rose-900">
                    {stats.perluPerhatianAcademicCount} Siswa
                  </span>
                </div>
                <p className="text-[11px] text-rose-800 leading-relaxed">
                  Rapor semester terbaru berada di bawah ambang batas (IPK &lt; 2.75 atau Rapor &lt; 75).
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/admin/dashboard/kontrol-status"
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-stone-900 hover:bg-stone-800 py-3 text-xs sm:text-sm font-bold text-white shadow-sm transition"
              >
                <span>Buka Kontrol Status</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 p-6 text-white shadow-md shadow-orange-500/15 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-white" />
              <h3 className="text-sm font-bold text-white">
                Panduan Operasional Beasiswa
              </h3>
            </div>
            <p className="text-xs text-white/90 leading-relaxed">
              Penyaluran beasiswa dilakukan secara berkala <strong>setiap 6 bulan sekali (per semester)</strong>.
              Pastikan seluruh bukti transfer telah diaudit sebelum tanggal penutupan pembukuan semester berjalan.
            </p>
            <div className="pt-1">
              <Link
                href="/admin/dashboard/alokasi-dana"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 hover:bg-white/30 px-3.5 py-1.5 text-xs font-bold text-white transition backdrop-blur-md"
              >
                <span>Cek Alokasi Dana</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL PLACEHOLDER "+ Tambah Anak Asuh" */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-xs animate-in fade-in"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <Plus className="size-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900">
                  Tambah Pendaftaran Anak Asuh
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Pendaftaran calon adik asuh baru dapat dilakukan secara langsung melalui
              formulir pendaftaran online terpadu atau melalui bimbingan Pengawas Lapangan.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
              >
                Tutup
              </button>
              <Link
                href="/register"
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition"
              >
                <span>Buka Form Pendaftaran</span>
                <ExternalLink className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
