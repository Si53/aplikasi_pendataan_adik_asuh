"use client"

import { useState, useMemo, useTransition } from "react"
import Link from "next/link"
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  UserCheck,
  UserX,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Check,
  X,
  Users,
  Building2,
  Calendar,
  Sparkles,
  Loader2,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  Phone,
  Eye,
  GraduationCap,
} from "lucide-react"
import {
  updateStudentStatusAction,
  updatePengawasStatusAction,
} from "@/app/actions/admin"

export interface StudentStatusItem {
  id: number
  username: string
  nik: string
  fullName: string
  schoolName: string
  gradeLevel: string
  wilayah: string
  createdAt: string
  status: "pending" | "approved" | "rejected" | "nonaktif" | "alumni" | string
  pengawasName: string
}

export interface PengawasStatusItem {
  id: number
  username: string
  name: string
  wilayah: string
  noHp: string | null
  status: "aktif" | "nonaktif" | string
  totalBinaanCount: number
}

interface AdminKontrolStatusViewProps {
  students: StudentStatusItem[]
  pengawas: PengawasStatusItem[]
  wilayahList: string[]
}

type ModalTarget =
  | {
      type: "student"
      id: number
      name: string
      currentStatus: string
      targetStatus: "approved" | "nonaktif" | "rejected" | "alumni"
      actionLabel: string
      isDeactivation?: boolean
    }
  | {
      type: "pengawas"
      id: number
      name: string
      currentStatus: string
      targetStatus: "aktif" | "nonaktif"
      actionLabel: string
    }

export function AdminKontrolStatusView({
  students,
  pengawas,
  wilayahList,
}: AdminKontrolStatusViewProps) {
  // Tab Switcher state
  const [activeTab, setActiveTab] = useState<"student" | "pengawas">("student")

  // Student Filter state
  const [studentSearch, setStudentSearch] = useState("")
  const [studentWilayah, setStudentWilayah] = useState("all")
  const [studentStatusFilter, setStudentStatusFilter] = useState("all")
  const [studentPage, setStudentPage] = useState(1)
  const studentPageSize = 10

  // Pengawas Filter state
  const [pengawasSearch, setPengawasSearch] = useState("")
  const [pengawasWilayah, setPengawasWilayah] = useState("all")
  const [pengawasStatusFilter, setPengawasStatusFilter] = useState("all")
  const [pengawasPage, setPengawasPage] = useState(1)
  const pengawasPageSize = 10

  // Confirmation Modal state
  const [modalTarget, setModalTarget] = useState<ModalTarget | null>(null)
  const [deactivationType, setDeactivationType] = useState<"alumni" | "nonaktif">("alumni")
  const [reason, setReason] = useState("")
  const [isPending, startTransition] = useTransition()
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  // 1. STATISTIK ADIK ASUH
  const studentStats = useMemo(() => {
    let approved = 0
    let nonaktif = 0
    let alumni = 0
    let pending = 0
    let rejected = 0

    students.forEach((s) => {
      if (s.status === "approved") approved++
      else if (s.status === "nonaktif") nonaktif++
      else if (s.status === "alumni") alumni++
      else if (s.status === "pending") pending++
      else if (s.status === "rejected") rejected++
    })

    return { approved, nonaktif, alumni, pending, rejected, total: students.length }
  }, [students])

  // 2. STATISTIK PENGAWAS
  const pengawasStats = useMemo(() => {
    let aktif = 0
    let nonaktif = 0

    pengawas.forEach((p) => {
      if (p.status === "aktif") aktif++
      else if (p.status === "nonaktif") nonaktif++
    })

    return { aktif, nonaktif, total: pengawas.length }
  }, [pengawas])

  // 3. FILTERED STUDENTS
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (studentSearch.trim()) {
        const q = studentSearch.toLowerCase().trim()
        const matchName = s.fullName.toLowerCase().includes(q)
        const matchNik = s.nik.toLowerCase().includes(q)
        const matchSchool = s.schoolName.toLowerCase().includes(q)
        const matchUser = s.username.toLowerCase().includes(q)
        if (!matchName && !matchNik && !matchSchool && !matchUser) return false
      }

      if (studentWilayah !== "all" && s.wilayah !== studentWilayah) {
        return false
      }

      if (studentStatusFilter !== "all" && s.status !== studentStatusFilter) {
        return false
      }

      return true
    })
  }, [students, studentSearch, studentWilayah, studentStatusFilter])

  // Paginated Students
  const totalStudentPages = Math.ceil(filteredStudents.length / studentPageSize) || 1
  const validStudentPage = Math.min(Math.max(1, studentPage), totalStudentPages)
  const paginatedStudents = useMemo(() => {
    const start = (validStudentPage - 1) * studentPageSize
    return filteredStudents.slice(start, start + studentPageSize)
  }, [filteredStudents, validStudentPage, studentPageSize])

  // 4. FILTERED PENGAWAS
  const filteredPengawas = useMemo(() => {
    return pengawas.filter((p) => {
      if (pengawasSearch.trim()) {
        const q = pengawasSearch.toLowerCase().trim()
        const matchName = p.name.toLowerCase().includes(q)
        const matchUser = p.username.toLowerCase().includes(q)
        const matchWilayah = p.wilayah.toLowerCase().includes(q)
        if (!matchName && !matchUser && !matchWilayah) return false
      }

      if (pengawasWilayah !== "all" && p.wilayah !== pengawasWilayah) {
        return false
      }

      if (pengawasStatusFilter !== "all" && p.status !== pengawasStatusFilter) {
        return false
      }

      return true
    })
  }, [pengawas, pengawasSearch, pengawasWilayah, pengawasStatusFilter])

  // Paginated Pengawas
  const totalPengawasPages = Math.ceil(filteredPengawas.length / pengawasPageSize) || 1
  const validPengawasPage = Math.min(Math.max(1, pengawasPage), totalPengawasPages)
  const paginatedPengawas = useMemo(() => {
    const start = (validPengawasPage - 1) * pengawasPageSize
    return filteredPengawas.slice(start, start + pengawasPageSize)
  }, [filteredPengawas, validPengawasPage, pengawasPageSize])

  // Handle Submit Modal Konfirmasi
  const handleConfirmStatusChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (!modalTarget) return

    const cleanReason = reason.trim()
    if (!cleanReason) {
      setActionError("Alasan perubahan status wajib diisi sebelum menyimpan.")
      return
    }

    setActionError(null)
    setActionSuccess(null)

    const resolvedTargetStatus =
      modalTarget.type === "student" && modalTarget.isDeactivation
        ? deactivationType
        : modalTarget.targetStatus

    startTransition(async () => {
      if (modalTarget.type === "student") {
        const res = await updateStudentStatusAction(
          modalTarget.id,
          resolvedTargetStatus,
          cleanReason
        )
        if (res.success) {
          setActionSuccess(
            `Status adik asuh ${modalTarget.name} berhasil diperbarui menjadi "${resolvedTargetStatus.toUpperCase()}".`
          )
          setModalTarget(null)
          setReason("")
          setTimeout(() => setActionSuccess(null), 4000)
        } else {
          setActionError(res.error || "Gagal memperbarui status adik asuh.")
        }
      } else {
        const res = await updatePengawasStatusAction(
          modalTarget.id,
          modalTarget.targetStatus,
          cleanReason
        )
        if (res.success) {
          setActionSuccess(
            `Status pengawas ${modalTarget.name} berhasil diperbarui menjadi "${modalTarget.targetStatus.toUpperCase()}".`
          )
          setModalTarget(null)
          setReason("")
          setTimeout(() => setActionSuccess(null), 4000)
        } else {
          setActionError(res.error || "Gagal memperbarui status pengawas.")
        }
      }
    })
  }

  return (
    <div className="space-y-8">
      {/* 1. Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-700">
              <Sparkles className="size-3 text-orange-600" />
              KONTROL & STATUS AKUN
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Kontrol Status
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl">
            Kelola status keaktifan adik asuh dan pengawas lapangan, serta lakukan
            persetujuan pendaftaran baru adik asuh dengan pencatatan alasan evaluasi.
          </p>
        </div>
      </div>

      {/* Feedback Notifications */}
      {actionSuccess && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs sm:text-sm text-emerald-900 flex items-center gap-3 shadow-xs animate-in fade-in">
          <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}
      {actionError && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs sm:text-sm text-rose-900 flex items-center gap-3 shadow-xs animate-in fade-in">
          <AlertCircle className="size-5 text-rose-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* 2. TAB SWITCHER (Adik Asuh vs Pengawas) */}
      <div className="flex items-center gap-2 rounded-2xl bg-stone-200/70 p-1.5 w-fit border border-stone-300/60 shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab("student")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeTab === "student"
              ? "bg-white text-orange-600 shadow-sm"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <Users className="size-4" />
          <span>Adik Asuh</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
              activeTab === "student"
                ? "bg-orange-100 text-orange-800"
                : "bg-stone-300/80 text-stone-700"
            }`}
          >
            {students.length}
          </span>
          {studentStats.pending > 0 && (
            <span className="rounded-full bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 animate-pulse">
              {studentStats.pending} baru
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pengawas")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeTab === "pengawas"
              ? "bg-white text-orange-600 shadow-sm"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <ShieldCheck className="size-4" />
          <span>Pengawas Lapangan</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
              activeTab === "pengawas"
                ? "bg-orange-100 text-orange-800"
                : "bg-stone-300/80 text-stone-700"
            }`}
          >
            {pengawas.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. KONTEN TAB 1: ADIK ASUH */}
      {/* ========================================================================= */}
      {activeTab === "student" && (
        <div className="space-y-6">
          {/* 4 Kartu Statistik Adik Asuh */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Kartu 1: Total Aktif (approved) */}
            <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Total Aktif
                </span>
                <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="size-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  {studentStats.approved}{" "}
                  <span className="text-sm font-bold text-stone-400">Adik Asuh</span>
                </p>
                <p className="mt-1 text-xs text-stone-500 font-medium">
                  Menerima manfaat aktif beasiswa
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold bg-emerald-50/80 rounded-lg px-2.5 py-1 w-fit">
                <ShieldCheck className="size-3" />
                <span>Status Approved</span>
              </div>
            </div>

            {/* Kartu 2: Alumni */}
            <div className="relative overflow-hidden rounded-3xl border border-blue-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
                  Alumni
                </span>
                <div className="flex size-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <GraduationCap className="size-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  {studentStats.alumni}{" "}
                  <span className="text-sm font-bold text-stone-400">Alumni</span>
                </p>
                <p className="mt-1 text-xs text-stone-500 font-medium">
                  Lulus / menyelesaikan program
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-blue-700 font-semibold bg-blue-50 rounded-lg px-2.5 py-1 w-fit">
                <GraduationCap className="size-3" />
                <span>Status Alumni</span>
              </div>
            </div>

            {/* Kartu 3: Nonaktif */}
            <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Akun Nonaktif
                </span>
                <div className="flex size-10 items-center justify-center rounded-2xl bg-stone-100 text-stone-600">
                  <UserX className="size-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  {studentStats.nonaktif}{" "}
                  <span className="text-sm font-bold text-stone-400">Adik Asuh</span>
                </p>
                <p className="mt-1 text-xs text-stone-500 font-medium">
                  Bantuan dijeda sementara
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-stone-700 font-semibold bg-stone-100 rounded-lg px-2.5 py-1 w-fit">
                <ShieldX className="size-3" />
                <span>Status Nonaktif</span>
              </div>
            </div>

            {/* Kartu 4: Menunggu Persetujuan (pending) */}
            <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Menunggu Persetujuan
                </span>
                <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <Clock className="size-5 animate-pulse" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  {studentStats.pending}{" "}
                  <span className="text-sm font-bold text-stone-400">Pendaftar</span>
                </p>
                <p className="mt-1 text-xs text-stone-500 font-medium">
                  Pendaftaran baru menunggu review Admin
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-800 font-semibold bg-amber-50 rounded-lg px-2.5 py-1 w-fit">
                <AlertTriangle className="size-3" />
                <span>Perlu Tindakan</span>
              </div>
            </div>
          </div>

          {/* Tabel Adik Asuh & Controls */}
          <div className="rounded-3xl border border-stone-200/90 bg-white p-6 shadow-xs space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => {
                    setStudentSearch(e.target.value)
                    setStudentPage(1)
                  }}
                  placeholder="Cari nama adik asuh, NIK, atau sekolah..."
                  className="h-10.5 w-full rounded-2xl border border-stone-200 bg-stone-50/50 pl-10 pr-4 text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition"
                />
                {studentSearch && (
                  <button
                    type="button"
                    onClick={() => setStudentSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Wilayah Filter */}
                <select
                  value={studentWilayah}
                  onChange={(e) => {
                    setStudentWilayah(e.target.value)
                    setStudentPage(1)
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

                {/* Status Filter */}
                <select
                  value={studentStatusFilter}
                  onChange={(e) => {
                    setStudentStatusFilter(e.target.value)
                    setStudentPage(1)
                  }}
                  className="h-10.5 rounded-2xl border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Menunggu Persetujuan ({studentStats.pending})</option>
                  <option value="approved">Aktif / Approved ({studentStats.approved})</option>
                  <option value="alumni">Alumni ({studentStats.alumni})</option>
                  <option value="nonaktif">Nonaktif ({studentStats.nonaktif})</option>
                  <option value="rejected">Ditolak ({studentStats.rejected})</option>
                </select>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Nama Adik Asuh</th>
                    <th className="py-3.5 px-4">Sekolah & Jenjang</th>
                    <th className="py-3.5 px-4">Tanggal Daftar</th>
                    <th className="py-3.5 px-4 text-center">Status Saat Ini</th>
                    <th className="py-3.5 px-4 text-center">Kontrol Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 bg-white">
                  {paginatedStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-stone-400">
                        <Users className="size-8 text-stone-300 mx-auto mb-2" />
                        <p className="font-bold text-stone-600 text-sm">
                          Tidak ada data adik asuh
                        </p>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Coba sesuaikan filter status atau kata kunci pencarian.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedStudents.map((st) => {
                      const isPending = st.status === "pending"
                      const isApproved = st.status === "approved"
                      const isAlumni = st.status === "alumni"
                      const isNonaktif = st.status === "nonaktif"
                      const isRejected = st.status === "rejected"

                      const initials = st.fullName
                        .split(" ")
                        .slice(0, 2)
                        .map((w) => w[0])
                        .join("")
                        .toUpperCase()

                      return (
                        <tr
                          key={st.id}
                          className="hover:bg-orange-50/30 transition-colors"
                        >
                          {/* Nama & NIK */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 font-bold text-xs text-white shadow-2xs">
                                {initials}
                              </div>
                              <div className="space-y-0.5 min-w-0">
                                <Link
                                  href={`/admin/dashboard/data-anak-asuh/${st.id}`}
                                  className="font-bold text-stone-900 hover:text-orange-600 transition block truncate max-w-[220px]"
                                >
                                  {st.fullName}
                                </Link>
                                <p className="text-[11px] font-mono text-stone-400">
                                  NIK: {st.nik} • @{st.username}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Sekolah & Jenjang */}
                          <td className="py-4 px-4">
                            <div className="space-y-0.5">
                              <p className="font-semibold text-stone-800 truncate max-w-[200px]">
                                {st.schoolName}
                              </p>
                              <p className="text-[11px] text-stone-500">
                                Kelas: {st.gradeLevel} • Wilayah {st.wilayah}
                              </p>
                            </div>
                          </td>

                          {/* Tanggal Daftar */}
                          <td className="py-4 px-4">
                            <div className="space-y-0.5">
                              <span className="font-mono text-xs text-stone-700">
                                {new Date(st.createdAt).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                              <p className="text-[11px] text-stone-400">
                                Pengawas: {st.pengawasName}
                              </p>
                            </div>
                          </td>

                          {/* Status Saat Ini */}
                          <td className="py-4 px-4 text-center">
                            {isApproved && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                                <CheckCircle2 className="size-3.5 text-emerald-600" />
                                Aktif (Approved)
                              </span>
                            )}
                            {isAlumni && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700">
                                <GraduationCap className="size-3.5 text-blue-600" />
                                Alumni
                              </span>
                            )}
                            {isNonaktif && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 border border-stone-300 px-3 py-1 text-xs font-bold text-stone-600">
                                <UserX className="size-3.5 text-stone-500" />
                                Nonaktif
                              </span>
                            )}
                            {isPending && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-300 px-3 py-1 text-xs font-bold text-amber-800 animate-pulse">
                                <Clock className="size-3.5 text-amber-600" />
                                Menunggu Review
                              </span>
                            )}
                            {isRejected && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-bold text-rose-700">
                                <XCircle className="size-3.5 text-rose-600" />
                                Ditolak
                              </span>
                            )}
                          </td>

                          {/* Kontrol Status Action */}
                          <td className="py-4 px-4 text-center">
                            {isPending ? (
                              /* KHUSUS PENDING: Tombol Lihat Detail, Setujui & Tolak */
                              <div className="inline-flex items-center gap-2">
                                <Link
                                  href={`/admin/dashboard/data-anak-asuh/${st.id}`}
                                  className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 hover:text-orange-600 px-3 py-1.5 text-xs font-bold text-stone-700 shadow-2xs transition cursor-pointer"
                                >
                                  <Eye className="size-3.5 text-stone-400" />
                                  <span>Lihat Detail</span>
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setModalTarget({
                                      type: "student",
                                      id: st.id,
                                      name: st.fullName,
                                      currentStatus: "pending",
                                      targetStatus: "approved",
                                      actionLabel: "Setujui Pendaftaran",
                                    })
                                    setReason("")
                                    setActionError(null)
                                  }}
                                  className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-2xs transition cursor-pointer"
                                >
                                  <Check className="size-3.5" />
                                  <span>Setujui</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setModalTarget({
                                      type: "student",
                                      id: st.id,
                                      name: st.fullName,
                                      currentStatus: "pending",
                                      targetStatus: "rejected",
                                      actionLabel: "Tolak Pendaftaran",
                                    })
                                    setReason("")
                                    setActionError(null)
                                  }}
                                  className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 text-xs font-bold text-rose-700 transition cursor-pointer"
                                >
                                  <X className="size-3.5" />
                                  <span>Tolak</span>
                                </button>
                              </div>
                            ) : (
                              /* TOGGLE SWITCH untuk Approved / Nonaktif / Alumni / Rejected */
                              <div className="flex items-center justify-center gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (isApproved) {
                                      setModalTarget({
                                        type: "student",
                                        id: st.id,
                                        name: st.fullName,
                                        currentStatus: st.status,
                                        targetStatus: "alumni",
                                        actionLabel: "Nonaktifkan / Luluskan Adik Asuh",
                                        isDeactivation: true,
                                      })
                                      setDeactivationType("alumni")
                                    } else {
                                      setModalTarget({
                                        type: "student",
                                        id: st.id,
                                        name: st.fullName,
                                        currentStatus: st.status,
                                        targetStatus: "approved",
                                        actionLabel: "Aktifkan Kembali Adik Asuh",
                                        isDeactivation: false,
                                      })
                                    }
                                    setReason("")
                                    setActionError(null)
                                  }}
                                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                                    isApproved ? "bg-emerald-500" : "bg-stone-300"
                                  }`}
                                  role="switch"
                                  aria-checked={isApproved}
                                >
                                  <span className="sr-only">Toggle status</span>
                                  <span
                                    className={`pointer-events-none inline-block size-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                      isApproved ? "translate-x-5" : "translate-x-0"
                                    }`}
                                  />
                                </button>
                                <span
                                  className={`text-xs font-bold ${
                                    isApproved
                                      ? "text-emerald-700"
                                      : isAlumni
                                      ? "text-blue-700"
                                      : isNonaktif
                                      ? "text-stone-500"
                                      : "text-rose-600"
                                  }`}
                                >
                                  {isApproved
                                    ? "Aktif"
                                    : isAlumni
                                    ? "Alumni"
                                    : isNonaktif
                                    ? "Nonaktif"
                                    : "Ditolak"}
                                </span>
                              </div>
                            )}
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
                  {paginatedStudents.length > 0 ? (validStudentPage - 1) * studentPageSize + 1 : 0}
                </strong>{" "}
                -{" "}
                <strong>
                  {Math.min(validStudentPage * studentPageSize, filteredStudents.length)}
                </strong>{" "}
                dari <strong>{filteredStudents.length}</strong> adik asuh
              </p>

              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  type="button"
                  disabled={validStudentPage <= 1}
                  onClick={() => setStudentPage((p) => Math.max(1, p - 1))}
                  className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Sebelumnya
                </button>
                <span className="px-2 font-bold text-stone-700">
                  {validStudentPage} / {totalStudentPages}
                </span>
                <button
                  type="button"
                  disabled={validStudentPage >= totalStudentPages}
                  onClick={() => setStudentPage((p) => Math.min(totalStudentPages, p + 1))}
                  className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. KONTEN TAB 2: PENGAWAS */}
      {/* ========================================================================= */}
      {activeTab === "pengawas" && (
        <div className="space-y-6">
          {/* 3 Kartu Statistik Pengawas */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Kartu 1: Pengawas Aktif */}
            <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Pengawas Aktif
                </span>
                <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="size-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  {pengawasStats.aktif}{" "}
                  <span className="text-sm font-bold text-stone-400">Pengawas</span>
                </p>
                <p className="mt-1 text-xs text-stone-500 font-medium">
                  Dapat login dan mengelola binaan
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold bg-emerald-50/80 rounded-lg px-2.5 py-1 w-fit">
                <CheckCircle2 className="size-3" />
                <span>Akun Aktif</span>
              </div>
            </div>

            {/* Kartu 2: Pengawas Nonaktif */}
            <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Pengawas Nonaktif
                </span>
                <div className="flex size-10 items-center justify-center rounded-2xl bg-stone-100 text-stone-600">
                  <ShieldX className="size-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  {pengawasStats.nonaktif}{" "}
                  <span className="text-sm font-bold text-stone-400">Pengawas</span>
                </p>
                <p className="mt-1 text-xs text-stone-500 font-medium">
                  Akses login dinonaktifkan sementara
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-stone-700 font-semibold bg-stone-100 rounded-lg px-2.5 py-1 w-fit">
                <XCircle className="size-3" />
                <span>Status Nonaktif</span>
              </div>
            </div>

            {/* Kartu 3: Total Wilayah */}
            <div className="relative overflow-hidden rounded-3xl border border-orange-100 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Total Wilayah
                </span>
                <div className="flex size-10 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                  <Building2 className="size-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  {wilayahList.length}{" "}
                  <span className="text-sm font-bold text-stone-400">Wilayah Tugas</span>
                </p>
                <p className="mt-1 text-xs text-stone-500 font-medium">
                  Cakupan wilayah pengawasan lapangan
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-orange-700 font-semibold bg-orange-50/80 rounded-lg px-2.5 py-1 w-fit">
                <Users className="size-3" />
                <span>{pengawas.length} Total Pengawas</span>
              </div>
            </div>
          </div>

          {/* Tabel Pengawas & Controls */}
          <div className="rounded-3xl border border-stone-200/90 bg-white p-6 shadow-xs space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={pengawasSearch}
                  onChange={(e) => {
                    setPengawasSearch(e.target.value)
                    setPengawasPage(1)
                  }}
                  placeholder="Cari nama pengawas, username, atau wilayah..."
                  className="h-10.5 w-full rounded-2xl border border-stone-200 bg-stone-50/50 pl-10 pr-4 text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition"
                />
                {pengawasSearch && (
                  <button
                    type="button"
                    onClick={() => setPengawasSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Wilayah Filter */}
                <select
                  value={pengawasWilayah}
                  onChange={(e) => {
                    setPengawasWilayah(e.target.value)
                    setPengawasPage(1)
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

                {/* Status Filter */}
                <select
                  value={pengawasStatusFilter}
                  onChange={(e) => {
                    setPengawasStatusFilter(e.target.value)
                    setPengawasPage(1)
                  }}
                  className="h-10.5 rounded-2xl border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="all">Semua Status</option>
                  <option value="aktif">Aktif ({pengawasStats.aktif})</option>
                  <option value="nonaktif">Nonaktif ({pengawasStats.nonaktif})</option>
                </select>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Nama Pengawas</th>
                    <th className="py-3.5 px-4">Username Login</th>
                    <th className="py-3.5 px-4">Wilayah Tugas</th>
                    <th className="py-3.5 px-4">Adik Asuh Binaan</th>
                    <th className="py-3.5 px-4 text-center">Status Saat Ini</th>
                    <th className="py-3.5 px-4 text-center">Kontrol Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 bg-white">
                  {paginatedPengawas.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-stone-400">
                        <ShieldCheck className="size-8 text-stone-300 mx-auto mb-2" />
                        <p className="font-bold text-stone-600 text-sm">
                          Tidak ada data pengawas ditemukan
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedPengawas.map((p) => {
                      const isAktif = p.status === "aktif"
                      const initials = p.name
                        .split(" ")
                        .slice(0, 2)
                        .map((w) => w[0])
                        .join("")
                        .toUpperCase()

                      return (
                        <tr
                          key={p.id}
                          className="hover:bg-orange-50/30 transition-colors"
                        >
                          {/* Nama & Kontak */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 font-bold text-xs text-white shadow-2xs">
                                {initials}
                              </div>
                              <div className="space-y-0.5 min-w-0">
                                <span className="font-bold text-stone-900 block truncate">
                                  {p.name}
                                </span>
                                <p className="text-[11px] text-stone-400 flex items-center gap-1">
                                  <Phone className="size-3 text-stone-400" />
                                  <span>{p.noHp || "Nomor HP belum diisi"}</span>
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Username */}
                          <td className="py-4 px-4">
                            <span className="font-mono text-xs font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-lg">
                              @{p.username}
                            </span>
                          </td>

                          {/* Wilayah Tugas */}
                          <td className="py-4 px-4">
                            <span className="font-bold text-xs text-orange-800 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                              Wilayah {p.wilayah}
                            </span>
                          </td>

                          {/* Total Siswa Binaan */}
                          <td className="py-4 px-4">
                            <span className="font-bold text-stone-900 text-xs">
                              {p.totalBinaanCount} Adik Asuh
                            </span>
                          </td>

                          {/* Status Saat Ini */}
                          <td className="py-4 px-4 text-center">
                            {isAktif ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                                <CheckCircle2 className="size-3.5 text-emerald-600" />
                                Aktif
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 border border-stone-300 px-3 py-1 text-xs font-bold text-stone-600">
                                <ShieldX className="size-3.5 text-stone-500" />
                                Nonaktif
                              </span>
                            )}
                          </td>

                          {/* Toggle Switch */}
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-2.5">
                              <button
                                type="button"
                                onClick={() => {
                                  const nextStatus = isAktif ? "nonaktif" : "aktif"
                                  setModalTarget({
                                    type: "pengawas",
                                    id: p.id,
                                    name: p.name,
                                    currentStatus: p.status,
                                    targetStatus: nextStatus,
                                    actionLabel: isAktif ? "Nonaktifkan Pengawas" : "Aktifkan Kembali Pengawas",
                                  })
                                  setReason("")
                                  setActionError(null)
                                }}
                                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                                  isAktif ? "bg-emerald-500" : "bg-stone-300"
                                }`}
                                role="switch"
                                aria-checked={isAktif}
                              >
                                <span className="sr-only">Toggle status pengawas</span>
                                <span
                                  className={`pointer-events-none inline-block size-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                    isAktif ? "translate-x-5" : "translate-x-0"
                                  }`}
                                />
                              </button>
                              <span
                                className={`text-xs font-bold ${
                                  isAktif ? "text-emerald-700" : "text-stone-500"
                                }`}
                              >
                                {isAktif ? "Aktif" : "Nonaktif"}
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer Pengawas */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 text-xs text-stone-500">
              <p>
                Menampilkan{" "}
                <strong>
                  {paginatedPengawas.length > 0 ? (validPengawasPage - 1) * pengawasPageSize + 1 : 0}
                </strong>{" "}
                -{" "}
                <strong>
                  {Math.min(validPengawasPage * pengawasPageSize, filteredPengawas.length)}
                </strong>{" "}
                dari <strong>{filteredPengawas.length}</strong> pengawas
              </p>

              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  type="button"
                  disabled={validPengawasPage <= 1}
                  onClick={() => setPengawasPage((p) => Math.max(1, p - 1))}
                  className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Sebelumnya
                </button>
                <span className="px-2 font-bold text-stone-700">
                  {validPengawasPage} / {totalPengawasPages}
                </span>
                <button
                  type="button"
                  disabled={validPengawasPage >= totalPengawasPages}
                  onClick={() => setPengawasPage((p) => Math.min(totalPengawasPages, p + 1))}
                  className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL KONFIRMASI PERUBAHAN STATUS (WAJIB ALASAN) */}
      {/* ========================================================================= */}
      {modalTarget && (() => {
        const resolvedTarget =
          modalTarget.type === "student" && modalTarget.isDeactivation
            ? deactivationType
            : modalTarget.targetStatus

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-xs animate-in fade-in"
            onClick={() => {
              if (!isPending) setModalTarget(null)
            }}
          >
            <div
              className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden border border-stone-200 animate-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modal */}
              <div className="p-6 border-b border-stone-100 bg-gradient-to-r from-orange-50/70 via-amber-50/40 to-white flex items-start gap-4">
                <div
                  className={`flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-sm text-white ${
                    resolvedTarget === "approved" || resolvedTarget === "aktif"
                      ? "bg-emerald-600"
                      : resolvedTarget === "alumni"
                      ? "bg-blue-600"
                      : resolvedTarget === "rejected"
                      ? "bg-rose-600"
                      : "bg-stone-700"
                  }`}
                >
                  {resolvedTarget === "approved" || resolvedTarget === "aktif" ? (
                    <CheckCircle2 className="size-6" />
                  ) : resolvedTarget === "alumni" ? (
                    <GraduationCap className="size-6" />
                  ) : resolvedTarget === "rejected" ? (
                    <XCircle className="size-6" />
                  ) : (
                    <UserX className="size-6" />
                  )}
                </div>

                <div className="space-y-1 flex-1">
                  <h3 className="text-base sm:text-lg font-black text-stone-900">
                    {modalTarget.actionLabel}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {modalTarget.type === "student" ? "Adik Asuh" : "Pengawas Lapangan"}:{" "}
                    <strong className="text-stone-900">{modalTarget.name}</strong>
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setModalTarget(null)}
                  className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Form & Body */}
              <form onSubmit={handleConfirmStatusChange} className="p-6 space-y-5">
                {/* Radio Pilihan Penonaktifan: Alumni vs Nonaktif */}
                {modalTarget.type === "student" && modalTarget.isDeactivation && (
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-bold text-stone-800 flex items-center justify-between">
                      <span>Alasan Penonaktifan:</span>
                      <span className="text-[11px] font-semibold text-orange-600">Pilih salah satu</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <label
                        className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition ${
                          deactivationType === "alumni"
                            ? "border-blue-500 bg-blue-50/60 text-blue-900 font-bold ring-2 ring-blue-500/20"
                            : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="deactivationType"
                          value="alumni"
                          checked={deactivationType === "alumni"}
                          onChange={() => setDeactivationType("alumni")}
                          className="size-4 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex items-center gap-1.5 text-xs">
                          <GraduationCap className="size-4 text-blue-600 shrink-0" />
                          <span>Lulus / Selesai (Alumni)</span>
                        </div>
                      </label>

                      <label
                        className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition ${
                          deactivationType === "nonaktif"
                            ? "border-stone-500 bg-stone-100 text-stone-900 font-bold ring-2 ring-stone-500/20"
                            : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="deactivationType"
                          value="nonaktif"
                          checked={deactivationType === "nonaktif"}
                          onChange={() => setDeactivationType("nonaktif")}
                          className="size-4 text-stone-600 focus:ring-stone-500"
                        />
                        <div className="flex items-center gap-1.5 text-xs">
                          <UserX className="size-4 text-stone-600 shrink-0" />
                          <span>Alasan Lain (Nonaktif)</span>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Box Info Perubahan */}
                <div className="rounded-2xl bg-stone-50 border border-stone-200/80 p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-medium">Status Saat Ini:</span>
                    <span className="font-bold text-stone-800 uppercase font-mono">
                      {modalTarget.currentStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-medium">Status Baru yang Dituju:</span>
                    <span
                      className={`font-black uppercase font-mono ${
                        resolvedTarget === "approved" || resolvedTarget === "aktif"
                          ? "text-emerald-700"
                          : resolvedTarget === "alumni"
                          ? "text-blue-700"
                          : resolvedTarget === "rejected"
                          ? "text-rose-700"
                          : "text-stone-700"
                      }`}
                    >
                      {resolvedTarget}
                    </span>
                  </div>
                </div>

                {/* Textarea Alasan WAJIB */}
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-bold text-stone-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="size-4 text-orange-500" />
                      <span>Alasan Perubahan Status *</span>
                    </span>
                    <span className="text-[11px] font-semibold text-rose-500">Wajib Diisi</span>
                  </label>
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={
                      modalTarget.type === "student" && modalTarget.isDeactivation
                        ? deactivationType === "alumni"
                          ? "Contoh: Telah lulus jenjang pendidikan dan menyelesaikan program beasiswa..."
                          : "Contoh: Pindah domisili di luar wilayah jangkauan / Mengundurkan diri..."
                        : "Contoh: Mengaktifkan kembali setelah verifikasi dokumen lanjutan lengkap..."
                    }
                    required
                    className="w-full rounded-2xl border border-stone-300 bg-white p-3.5 text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition resize-none"
                  />
                  <p className="text-[11px] text-stone-400">
                    Alasan ini akan otomatis tercatat di log <strong>AdminNote</strong> sebagai riwayat audit.
                  </p>
                </div>

                {actionError && (
                  <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 flex items-center gap-2">
                    <AlertCircle className="size-4 text-rose-600 shrink-0" />
                    <span>{actionError}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => setModalTarget(null)}
                    className="rounded-2xl border border-stone-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-stone-600 hover:bg-stone-50 transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isPending || !reason.trim()}
                    className={`inline-flex items-center gap-2 rounded-2xl px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition disabled:opacity-50 cursor-pointer ${
                      resolvedTarget === "approved" || resolvedTarget === "aktif"
                        ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25"
                        : resolvedTarget === "alumni"
                        ? "bg-blue-600 hover:bg-blue-700 shadow-blue-600/25"
                        : resolvedTarget === "rejected"
                        ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/25"
                        : "bg-stone-700 hover:bg-stone-800 shadow-stone-700/25"
                    }`}
                  >
                    {isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Check className="size-4" />
                    )}
                    <span>{isPending ? "Memproses..." : "Konfirmasi & Simpan"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
