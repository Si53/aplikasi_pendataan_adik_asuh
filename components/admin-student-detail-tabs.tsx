"use client"

import { useState, useTransition } from "react"
import {
  Sparkles,
  GraduationCap,
  Home,
  ReceiptText,
  UserCheck,
  Calendar,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  Clock,
  FileText,
  ExternalLink,
  Phone,
  AlertCircle,
  MapPin,
  Heart,
  TrendingUp,
  ShieldCheck,
  Plus,
  Coins,
  History,
} from "lucide-react"
import { createAdminNoteAction, verifyDisbursementAction } from "@/app/actions/admin"

export interface AdminStudentDetailData {
  student: {
    id: number
    username: string
    nik: string
    fullName: string
    dateOfBirth: string
    gender: string
    citaCita: string
    wilayah: string
    alamatLengkap: string
    noHp: string
    riwayatPenyakit: string
    schoolName: string
    gradeLevel: string
    nilaiRataRata: string
    jumlahSaudara: number
    status: string
    createdAt: string
  }
  pengawas: {
    id: number
    name: string
    wilayah: string
    noHp: string | null
  } | null
  latestNilai: string
  hasAcademicUpdate: boolean
  latestAcademicDate: string | null
  father: {
    name: string
    status: string
    occupation: string
    incomePerMonth: string
    address: string
    phone: string
    medicalHistory: string
  } | null
  mother: {
    name: string
    status: string
    occupation: string
    incomePerMonth: string
    address: string
    phone: string
    medicalHistory: string
  } | null
  guardian: {
    name: string
    status: string
    occupation: string
    incomePerMonth: string
    address: string
    phone: string
    medicalHistory: string
  } | null
  academicUpdates: Array<{
    id: number
    tanggalInput: string
    kelasSaatItu: string
    nilaiRataRata: string
    namaSekolahBaru: string | null
    dokumenRaporUrl: string | null
  }>
  disbursements: Array<{
    id: number
    tanggal: string
    pengawasName: string
    fileUrl: string
    status: string
    processedAt: string | null
  }>
  adminNotes: Array<{
    id: number
    adminName: string
    note: string
    createdAt: string
  }>
  bantuanAdjustments: Array<{
    id: number
    adminName: string
    nominalLama: number
    nominalBaru: number
    catatan: string | null
    createdAt: string
  }>
  latestVisit: {
    tanggal: string
    visitorName: string
    visitorRole: string
    catatan: string | null
  } | null
  educationCosts: Array<{
    id: number
    label: string
    amount: number
  }>
}

export function AdminStudentDetailTabs({
  data,
}: {
  data: AdminStudentDetailData
}) {
  const [activeTab, setActiveTab] = useState<
    "ringkasan" | "akademik" | "wali" | "dana"
  >("ringkasan")

  // Note form state
  const [newNote, setNewNote] = useState("")
  const [noteError, setNoteError] = useState<string | null>(null)
  const [isSubmittingNote, startNoteTransition] = useTransition()

  // Verify disbursement state
  const [verifyingId, setVerifyingId] = useState<number | null>(null)
  const [isVerifying, startVerifyTransition] = useTransition()

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return

    setNoteError(null)
    startNoteTransition(async () => {
      const res = await createAdminNoteAction(data.student.id, newNote)
      if (res.success) {
        setNewNote("")
      } else {
        setNoteError(res.error || "Gagal menyimpan catatan.")
      }
    })
  }

  const handleVerifyDisbursement = (proofId: number) => {
    setVerifyingId(proofId)
    startVerifyTransition(async () => {
      await verifyDisbursementAction(proofId, data.student.id)
      setVerifyingId(null)
    })
  }

  // Format clean WhatsApp phone
  const cleanPengawasPhone = data.pengawas?.noHp
    ? data.pengawas.noHp.replace(/\D/g, "").replace(/^0/, "62")
    : null

  const waPengawasUrl = cleanPengawasPhone
    ? `https://wa.me/${cleanPengawasPhone}?text=${encodeURIComponent(
        `Halo ${data.pengawas?.name || "Pengawas"}, kami dari Admin Portal Kakak Asuh ingin berkoordinasi terkait adik asuh ${data.student.fullName}.`
      )}`
    : null

  const totalEducationCost = data.educationCosts.reduce(
    (sum, c) => sum + c.amount,
    0
  )

  const tabs = [
    { id: "ringkasan", label: "Ringkasan", icon: Sparkles },
    { id: "akademik", label: "Akademik", icon: GraduationCap },
    { id: "wali", label: "Wali & Tempat Tinggal", icon: Home },
    { id: "dana", label: "Log Dana", icon: ReceiptText },
  ] as const

  return (
    <div className="space-y-6">
      {/* Tab Header Navigation */}
      <div className="flex border-b border-stone-200/90 bg-white rounded-2xl p-1.5 shadow-xs overflow-x-auto print:hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-orange-500 text-white shadow-xs shadow-orange-500/25"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: RINGKASAN */}
      {/* ========================================================================= */}
      {activeTab === "ringkasan" && (
        <div className="space-y-6">
          {/* 3 Metric Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Rata-rata Semester */}
            <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Rata-rata Semester
                </span>
                <div className="flex size-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <TrendingUp className="size-4.5" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-black text-stone-900">
                {data.latestNilai}
              </p>
              <p className="mt-1 text-xs text-stone-500">
                {data.hasAcademicUpdate
                  ? `Rapor terbaru (${new Date(
                      data.latestAcademicDate!
                    ).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })})`
                  : "Nilai awal pendaftaran (belum ada update)"}
              </p>
            </div>

            {/* 2. Pengawas Pendamping */}
            <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Pengawas Pendamping
                  </span>
                  <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <UserCheck className="size-4.5" />
                  </div>
                </div>
                <p className="mt-2 text-base font-bold text-stone-900 truncate">
                  {data.pengawas?.name || "Belum Ditugaskan"}
                </p>
                <p className="text-xs text-stone-500">
                  Wilayah: {data.pengawas?.wilayah || data.student.wilayah}
                </p>
                <p className="mt-1 text-xs font-mono text-stone-600 flex items-center gap-1">
                  <Phone className="size-3 text-stone-400" />
                  {data.pengawas?.noHp || "Nomor belum tersedia"}
                </p>
              </div>

              {waPengawasUrl ? (
                <div className="mt-3 pt-3 border-t border-stone-100">
                  <a
                    href={waPengawasUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    <span>Hubungi via WhatsApp</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              ) : (
                <div className="mt-3 pt-3 border-t border-stone-100 text-[11px] text-stone-400">
                  Kontak WhatsApp belum diatur
                </div>
              )}
            </div>

            {/* 3. Kunjungan Terakhir */}
            <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Kunjungan Terakhir
                </span>
                <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Calendar className="size-4.5" />
                </div>
              </div>
              {data.latestVisit ? (
                <div className="mt-3 space-y-1">
                  <p className="text-lg font-bold text-stone-900">
                    {new Date(data.latestVisit.tanggal).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>
                  <p className="text-xs text-stone-600">
                    Oleh:{" "}
                    <strong>{data.latestVisit.visitorName}</strong> (
                    {data.latestVisit.visitorRole})
                  </p>
                  {data.latestVisit.catatan && (
                    <p className="text-xs text-stone-500 italic truncate mt-1">
                      &quot;{data.latestVisit.catatan}&quot;
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-stone-700">
                    Belum ada kunjungan tercatat
                  </p>
                  <p className="mt-1 text-xs text-stone-400">
                    Catatan visitasi dari Pengawas atau Admin akan muncul di
                    sini.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section: Catatan Evaluasi Kakak Asuh */}
          <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <MessageSquare className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Catatan Evaluasi Kakak Asuh
                  </h3>
                  <p className="text-xs text-stone-500">
                    Riwayat catatan internal dan arahan pembinaan untuk anak
                    asuh ini
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-bold text-stone-600">
                {data.adminNotes.length} Catatan
              </span>
            </div>

            {/* Form Tambah Catatan Baru */}
            <form onSubmit={handleAddNote} className="space-y-3 print:hidden">
              <div className="relative">
                <textarea
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Tulis catatan evaluasi atau instruksi pembinaan baru untuk anak asuh ini..."
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/60 p-3.5 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition resize-none"
                  disabled={isSubmittingNote}
                />
              </div>

              {noteError && (
                <p className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                  <AlertCircle className="size-3.5" />
                  {noteError}
                </p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingNote || !newNote.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 transition cursor-pointer shadow-xs shadow-orange-500/20"
                >
                  {isSubmittingNote ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                  <span>{isSubmittingNote ? "Menyimpan..." : "Kirim Catatan"}</span>
                </button>
              </div>
            </form>

            {/* List Riwayat Catatan */}
            <div className="space-y-3 pt-3 border-t border-stone-100">
              {data.adminNotes.length === 0 ? (
                <div className="py-6 text-center text-xs text-stone-400">
                  Belum ada catatan evaluasi untuk anak asuh ini. Tulis catatan
                  pertama di atas.
                </div>
              ) : (
                data.adminNotes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-xl bg-stone-50/80 border border-stone-200/70 p-4 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-900 flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-orange-500" />
                        {note.adminName}
                      </span>
                      <span className="text-stone-400 font-mono text-[11px]">
                        {new Date(note.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">
                      {note.note}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: AKADEMIK */}
      {/* ========================================================================= */}
      {activeTab === "akademik" && (
        <div className="space-y-6">
          {/* Info Sekolah Awal */}
          <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
              Informasi Pendaftaran Awal
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                <span className="text-stone-400 text-xs block">Sekolah Asal</span>
                <strong className="text-stone-800">{data.student.schoolName}</strong>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                <span className="text-stone-400 text-xs block">Jenjang / Kelas</span>
                <strong className="text-stone-800">{data.student.gradeLevel}</strong>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                <span className="text-stone-400 text-xs block">Nilai Awal</span>
                <strong className="text-orange-600 font-bold">
                  {data.student.nilaiRataRata || "-"}
                </strong>
              </div>
            </div>
          </div>

          {/* List Riwayat AcademicUpdate */}
          <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900">
                Riwayat Perkembangan Nilai & Rapor
              </h3>
              <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-bold text-stone-600">
                {data.academicUpdates.length} Update Tercatat
              </span>
            </div>

            {data.academicUpdates.length === 0 ? (
              <div className="py-10 text-center text-xs text-stone-400">
                <GraduationCap className="size-8 text-stone-300 mx-auto mb-2" />
                <p className="font-semibold text-stone-700">Belum Ada Riwayat Update Rapor</p>
                <p className="mt-1">
                  Pengawas wilayah belum menginput data pembaruan semester untuk anak asuh ini.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100 border border-stone-200/80 rounded-xl overflow-hidden">
                {data.academicUpdates.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/50 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-800">
                          {item.kelasSaatItu}
                        </span>
                        {idx === 0 && (
                          <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            Terbaru
                          </span>
                        )}
                        <span className="text-xs text-stone-400 font-mono">
                          {new Date(item.tanggalInput).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      {item.namaSekolahBaru && (
                        <p className="text-xs text-stone-600">
                          Pindah ke: <strong>{item.namaSekolahBaru}</strong>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                          Nilai Rata-rata
                        </span>
                        <span className="text-lg font-black text-stone-900">
                          {item.nilaiRataRata}
                        </span>
                      </div>

                      {item.dokumenRaporUrl ? (
                        <a
                          href={item.dokumenRaporUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-orange-50 border border-orange-200 px-3 py-2 text-xs font-bold text-orange-700 hover:bg-orange-100 transition shadow-2xs"
                        >
                          <FileText className="size-3.5" />
                          <span>Lihat Rapor</span>
                          <ExternalLink className="size-3 text-orange-500" />
                        </a>
                      ) : (
                        <span className="text-xs text-stone-400 italic">
                          Tanpa Lampiran
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: WALI & TEMPAT TINGGAL */}
      {/* ========================================================================= */}
      {activeTab === "wali" && (
        <div className="space-y-6">
          {/* Identitas Pribadi & Alamat Siswa */}
          <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-stone-900">
              Profil Domisili & Pribadi Siswa
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/60 sm:col-span-2 md:col-span-3">
                <span className="text-stone-400 text-xs block font-medium">Alamat Lengkap</span>
                <p className="mt-0.5 font-semibold text-stone-800 leading-relaxed">
                  {data.student.alamatLengkap || "-"}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/60">
                <span className="text-stone-400 text-xs block font-medium">Nomor Telepon Siswa</span>
                <p className="mt-0.5 font-semibold text-stone-800">
                  {data.student.noHp || "-"}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/60">
                <span className="text-stone-400 text-xs block font-medium">Tanggal Lahir & Usia</span>
                <p className="mt-0.5 font-semibold text-stone-800">
                  {new Date(data.student.dateOfBirth).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/60">
                <span className="text-stone-400 text-xs block font-medium">Jenis Kelamin</span>
                <p className="mt-0.5 font-semibold text-stone-800">{data.student.gender}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/60">
                <span className="text-stone-400 text-xs block font-medium">Jumlah Saudara</span>
                <p className="mt-0.5 font-semibold text-stone-800">
                  {data.student.jumlahSaudara} Orang
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/60">
                <span className="text-stone-400 text-xs block font-medium">Cita-cita</span>
                <p className="mt-0.5 font-semibold text-stone-800">
                  {data.student.citaCita || "-"}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/60 sm:col-span-2 md:col-span-3">
                <span className="text-stone-400 text-xs block font-medium">Riwayat Penyakit</span>
                <p className="mt-0.5 font-semibold text-stone-800">
                  {data.student.riwayatPenyakit || "Tidak ada riwayat penyakit khusus"}
                </p>
              </div>
            </div>
          </div>

          {/* Data Orang Tua & Wali */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ayah */}
            <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h4 className="font-bold text-stone-900 text-sm">Data Ayah</h4>
                <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-bold text-stone-700">
                  {data.father?.status || "Belum Diisi"}
                </span>
              </div>
              {data.father ? (
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-stone-400">Nama:</span>{" "}
                    <strong className="text-stone-800">{data.father.name}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400">Pekerjaan:</span>{" "}
                    <span className="text-stone-700">{data.father.occupation || "-"}</span>
                  </div>
                  <div>
                    <span className="text-stone-400">Penghasilan:</span>{" "}
                    <span className="text-stone-700">{data.father.incomePerMonth || "-"}</span>
                  </div>
                  <div>
                    <span className="text-stone-400">Telepon:</span>{" "}
                    <span className="text-stone-700">{data.father.phone || "-"}</span>
                  </div>
                  <div>
                    <span className="text-stone-400">Alamat:</span>{" "}
                    <span className="text-stone-700">{data.father.address || "-"}</span>
                  </div>
                  <div>
                    <span className="text-stone-400">Riwayat Medis:</span>{" "}
                    <span className="text-stone-700">{data.father.medicalHistory || "-"}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-stone-400">Data ayah belum diinput.</p>
              )}
            </div>

            {/* Ibu */}
            <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h4 className="font-bold text-stone-900 text-sm">Data Ibu</h4>
                <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-bold text-stone-700">
                  {data.mother?.status || "Belum Diisi"}
                </span>
              </div>
              {data.mother ? (
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-stone-400">Nama:</span>{" "}
                    <strong className="text-stone-800">{data.mother.name}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400">Pekerjaan:</span>{" "}
                    <span className="text-stone-700">{data.mother.occupation || "-"}</span>
                  </div>
                  <div>
                    <span className="text-stone-400">Penghasilan:</span>{" "}
                    <span className="text-stone-700">{data.mother.incomePerMonth || "-"}</span>
                  </div>
                  <div>
                    <span className="text-stone-400">Telepon:</span>{" "}
                    <span className="text-stone-700">{data.mother.phone || "-"}</span>
                  </div>
                  <div>
                    <span className="text-stone-400">Alamat:</span>{" "}
                    <span className="text-stone-700">{data.mother.address || "-"}</span>
                  </div>
                  <div>
                    <span className="text-stone-400">Riwayat Medis:</span>{" "}
                    <span className="text-stone-700">{data.mother.medicalHistory || "-"}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-stone-400">Data ibu belum diinput.</p>
              )}
            </div>

            {/* Wali (Jika ada) */}
            {data.guardian && data.guardian.name && (
              <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs space-y-3 md:col-span-2">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <h4 className="font-bold text-stone-900 text-sm">Data Wali</h4>
                  <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-bold text-stone-700">
                    {data.guardian.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-stone-400">Nama Wali:</span>{" "}
                    <strong className="text-stone-800">{data.guardian.name}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400">Pekerjaan:</span>{" "}
                    <span className="text-stone-700">{data.guardian.occupation || "-"}</span>
                  </div>
                  <div>
                    <span className="text-stone-400">Penghasilan:</span>{" "}
                    <span className="text-stone-700">{data.guardian.incomePerMonth || "-"}</span>
                  </div>
                  <div>
                    <span className="text-stone-400">Telepon:</span>{" "}
                    <span className="text-stone-700">{data.guardian.phone || "-"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: LOG DANA */}
      {/* ========================================================================= */}
      {activeTab === "dana" && (
        <div className="space-y-6">
          {/* Komponen Biaya Pendidikan */}
          {data.educationCosts.length > 0 && (
            <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Estimasi Biaya Pendidikan Terdaftar
                </h3>
                <span className="text-xs font-bold text-orange-600">
                  {data.educationCosts.length} Komponen
                </span>
              </div>
              <div className="divide-y divide-stone-100 text-xs sm:text-sm">
                {data.educationCosts.map((c) => (
                  <div key={c.id} className="flex justify-between py-2">
                    <span className="text-stone-600">{c.label}</span>
                    <strong className="text-stone-900">
                      Rp {c.amount.toLocaleString("id-ID")}
                    </strong>
                  </div>
                ))}
                <div className="flex justify-between pt-2.5 text-sm font-extrabold text-orange-600">
                  <span>Total Kebutuhan</span>
                  <span>Rp {totalEducationCost.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          )}

          {/* List Bukti Penyaluran Dana (Disbursement Proofs) */}
          <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Bukti Penyaluran Dana Beasiswa
                </h3>
                <p className="text-xs text-stone-500">
                  Verifikasi transfer dana dan tanda terima dari Pengawas Wilayah
                </p>
              </div>
              <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-bold text-stone-600">
                {data.disbursements.length} Bukti
              </span>
            </div>

            {data.disbursements.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-400">
                Belum ada bukti penyaluran dana yang diunggah untuk siswa ini.
              </div>
            ) : (
              <div className="divide-y divide-stone-100 border border-stone-200/80 rounded-xl overflow-hidden">
                {data.disbursements.map((proof) => (
                  <div
                    key={proof.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/50 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {proof.status === "verified" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="size-3 text-emerald-500" />
                            Terverifikasi
                          </span>
                        ) : proof.status === "rejected" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-200">
                            <AlertCircle className="size-3 text-rose-500" />
                            Ditolak
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
                            <Clock className="size-3 text-amber-500" />
                            Menunggu Audit
                          </span>
                        )}
                        <span className="text-xs text-stone-500 font-mono">
                          {new Date(proof.tanggal).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600">
                        Diunggah oleh: <strong>{proof.pengawasName}</strong>
                        {proof.processedAt && (
                          <span className="text-stone-400 ml-1.5">
                            • Diproses:{" "}
                            {new Date(proof.processedAt).toLocaleDateString(
                              "id-ID"
                            )}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {proof.fileUrl && (
                        <a
                          href={proof.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-xl bg-stone-100 px-3 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-200 transition"
                        >
                          <FileText className="size-3.5" />
                          <span>Lihat Bukti</span>
                          <ExternalLink className="size-3 text-stone-400" />
                        </a>
                      )}

                      {proof.status === "pending" && (
                        <button
                          type="button"
                          onClick={() => handleVerifyDisbursement(proof.id)}
                          disabled={isVerifying && verifyingId === proof.id}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition cursor-pointer disabled:opacity-50 shadow-2xs"
                        >
                          {isVerifying && verifyingId === proof.id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <ShieldCheck className="size-3.5" />
                          )}
                          <span>Tandai Terverifikasi</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Riwayat Penyesuaian Bantuan (BantuanAdjustment) */}
          <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Riwayat Penyesuaian Nominal Bantuan
                </h3>
                <p className="text-xs text-stone-500">
                  Catatan perubahan alokasi dana beasiswa oleh Administrator
                </p>
              </div>
              <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-bold text-stone-600">
                {data.bantuanAdjustments.length} Riwayat
              </span>
            </div>

            {data.bantuanAdjustments.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-400">
                Belum ada catatan perubahan nominal bantuan untuk siswa ini.
              </div>
            ) : (
              <div className="divide-y divide-stone-100 border border-stone-200/80 rounded-xl overflow-hidden">
                {data.bantuanAdjustments.map((adj) => (
                  <div key={adj.id} className="p-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900">
                          {adj.adminName}
                        </span>
                        <span className="text-stone-400">•</span>
                        <span className="text-stone-500 font-mono">
                          {new Date(adj.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="font-semibold text-xs">
                        <span className="line-through text-stone-400 mr-2">
                          Rp {adj.nominalLama.toLocaleString("id-ID")}
                        </span>
                        <span className="text-emerald-600 font-bold">
                          Rp {adj.nominalBaru.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    {adj.catatan && (
                      <p className="text-xs text-stone-600 italic">
                        Catatan: &quot;{adj.catatan}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
