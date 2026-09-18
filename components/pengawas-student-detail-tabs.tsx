"use client"

import { useState, useTransition, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  GraduationCap,
  BookOpen,
  UploadCloud,
  Coins,
  Clock,
  Calendar,
  Building2,
  FileText,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  FileCheck,
  UserCheck,
  Info,
  X,
  Users,
  Phone,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { createPengawasDisbursementProofAction } from "@/app/actions/pengawas"

export type AcademicUpdateItem = {
  id: number
  tanggalInput: string
  kelasSaatItu: string
  nilaiRataRata: string
  namaSekolahBaru: string | null
  dokumenRaporUrl: string | null
}

export type DisbursementHistoryItem = {
  id: number
  tanggal: string
  fileUrl: string
  nominal: number | null
  status: "pending" | "verified" | "rejected" | string
  processedAt: string | null
}

export type StudentDetailFull = {
  id: number
  fullName: string
  nik: string
  gender: string
  dateOfBirth: string
  alamatLengkap: string
  noHp: string
  schoolName: string
  gradeLevel: string
  nilaiAwal: string
  citaCita: string
  wilayah: string
  riwayatPenyakit: string
  jumlahSaudara: number
  isBinaan: boolean
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
  academicUpdates: AcademicUpdateItem[]
  disbursementHistory: DisbursementHistoryItem[]
}

interface PengawasStudentDetailTabsProps {
  student: StudentDetailFull
  pengawasName: string
  wilayah: string
}

function formatNominal(val: string | number): string {
  if (!val) return ""
  const num = typeof val === "string" ? parseInt(val.replace(/\D/g, ""), 10) : val
  if (isNaN(num)) return ""
  return num.toLocaleString("id-ID")
}

export function PengawasStudentDetailTabs({
  student,
  pengawasName,
  wilayah,
}: PengawasStudentDetailTabsProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [activeTab, setActiveTab] = useState<"akademik" | "penyaluran">("akademik")
  const [showFullBiodata, setShowFullBiodata] = useState(false)

  // Form states for Penyaluran
  const [nominalRaw, setNominalRaw] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null)

  // Feedback states
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const totalCost = student.educationCosts.reduce((sum, c) => sum + c.amount, 0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null)
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage("Ukuran file terlalu besar (maksimal 15 MB). Silakan pilih file yang lebih kecil.")
      return
    }

    setSelectedFile(file)
    if (file.type.startsWith("image/")) {
      const preview = URL.createObjectURL(file)
      setFilePreviewUrl(preview)
    } else {
      setFilePreviewUrl(null)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl)
      setFilePreviewUrl(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmitDisbursement = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    const num = parseInt(nominalRaw.replace(/\D/g, ""), 10)
    if (isNaN(num) || num <= 0) {
      setErrorMessage("Silakan masukkan nominal bantuan yang diserahkan.")
      return
    }

    if (!selectedFile) {
      setErrorMessage("Silakan unggah foto atau file bukti transfer/penyerahan dana.")
      return
    }

    const formData = new FormData()
    formData.append("studentId", String(student.id))
    formData.append("nominal", String(num))
    formData.append("file", selectedFile)

    startTransition(async () => {
      const res = await createPengawasDisbursementProofAction(formData)
      if (res.success) {
        setSuccessMessage(res.message)
        // Reset form
        setNominalRaw("")
        handleRemoveFile()
        // Refresh page data
        router.refresh()
      } else {
        setErrorMessage(res.error || "Gagal mengunggah bukti penyaluran.")
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* SECTION BIODATA & DATA KELUARGA (ACCORDION / TOGGLE) */}
      <div className="overflow-hidden rounded-3xl border border-orange-100/90 bg-white/95 shadow-md backdrop-blur-md">
        <button
          type="button"
          onClick={() => setShowFullBiodata(!showFullBiodata)}
          className="flex w-full items-center justify-between p-5 text-left hover:bg-orange-50/40 transition cursor-pointer"
          aria-expanded={showFullBiodata}
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 font-bold shadow-xs">
              <Users className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-foreground">
                Biodata Pribadi & Data Keluarga
              </h3>
              <p className="text-xs text-muted-foreground">
                Kontak, riwayat kesehatan, dan data orang tua/wali
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-orange-600">
            <span>{showFullBiodata ? "Tutup" : "Lihat Selengkapnya"}</span>
            {showFullBiodata ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </div>
        </button>

        {showFullBiodata && (
          <div className="border-t border-orange-100/80 p-5 sm:p-6 bg-orange-50/20 flex flex-col gap-6 animate-in fade-in duration-200">
            {/* Identitas & Kontak */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Identitas & Kontak Pribadi
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs sm:text-sm">
                <div className="rounded-2xl bg-white p-3.5 border border-orange-100 shadow-2xs">
                  <span className="text-[11px] text-muted-foreground">Tanggal Lahir</span>
                  <p className="font-bold text-foreground mt-0.5">{student.dateOfBirth}</p>
                </div>
                <div className="rounded-2xl bg-white p-3.5 border border-orange-100 shadow-2xs">
                  <span className="text-[11px] text-muted-foreground">Jenis Kelamin</span>
                  <p className="font-bold text-foreground mt-0.5">{student.gender}</p>
                </div>
                <div className="rounded-2xl bg-white p-3.5 border border-orange-100 shadow-2xs">
                  <span className="text-[11px] text-muted-foreground">Jumlah Saudara</span>
                  <p className="font-bold text-foreground mt-0.5">{student.jumlahSaudara} orang</p>
                </div>
                <div className="rounded-2xl bg-white p-3.5 border border-orange-100 shadow-2xs">
                  <span className="text-[11px] text-muted-foreground">Nomor WhatsApp / HP</span>
                  <p className="font-bold text-foreground mt-0.5 flex items-center gap-1">
                    <Phone className="size-3.5 text-orange-500" />
                    {student.noHp || "-"}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-3.5 border border-orange-100 shadow-2xs sm:col-span-2">
                  <span className="text-[11px] text-muted-foreground">Riwayat Penyakit</span>
                  <p className="font-bold text-foreground mt-0.5">{student.riwayatPenyakit || "-"}</p>
                </div>
                <div className="rounded-2xl bg-white p-3.5 border border-orange-100 shadow-2xs sm:col-span-3">
                  <span className="text-[11px] text-muted-foreground">Alamat Domisili</span>
                  <p className="font-bold text-foreground mt-0.5">{student.alamatLengkap || "-"}</p>
                </div>
              </div>
            </div>

            {/* Data Orang Tua & Wali */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Data Orang Tua & Wali
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Ayah */}
                <div className="rounded-2xl bg-white p-4 border border-orange-100 shadow-2xs flex flex-col gap-2">
                  <div className="flex items-center justify-between border-b border-orange-100/60 pb-2">
                    <h5 className="font-bold text-foreground text-xs sm:text-sm">Data Ayah</h5>
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-800">
                      {student.father?.status || "-"}
                    </span>
                  </div>
                  {student.father ? (
                    <div className="flex flex-col gap-1 text-xs">
                      <div>
                        <span className="text-muted-foreground">Nama:</span>{" "}
                        <strong className="text-foreground">{student.father.name}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pekerjaan:</span>{" "}
                        <strong className="text-foreground">{student.father.occupation || "-"}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Penghasilan:</span>{" "}
                        <strong className="text-foreground">{student.father.incomePerMonth || "-"}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground">No HP:</span>{" "}
                        <strong className="text-foreground">{student.father.phone || "-"}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Alamat:</span>{" "}
                        <span className="text-foreground">{student.father.address || "-"}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Data belum diisi.</p>
                  )}
                </div>

                {/* Ibu */}
                <div className="rounded-2xl bg-white p-4 border border-orange-100 shadow-2xs flex flex-col gap-2">
                  <div className="flex items-center justify-between border-b border-orange-100/60 pb-2">
                    <h5 className="font-bold text-foreground text-xs sm:text-sm">Data Ibu</h5>
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-800">
                      {student.mother?.status || "-"}
                    </span>
                  </div>
                  {student.mother ? (
                    <div className="flex flex-col gap-1 text-xs">
                      <div>
                        <span className="text-muted-foreground">Nama:</span>{" "}
                        <strong className="text-foreground">{student.mother.name}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pekerjaan:</span>{" "}
                        <strong className="text-foreground">{student.mother.occupation || "-"}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Penghasilan:</span>{" "}
                        <strong className="text-foreground">{student.mother.incomePerMonth || "-"}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground">No HP:</span>{" "}
                        <strong className="text-foreground">{student.mother.phone || "-"}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Alamat:</span>{" "}
                        <span className="text-foreground">{student.mother.address || "-"}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Data belum diisi.</p>
                  )}
                </div>

                {/* Wali */}
                {student.guardian && student.guardian.name && (
                  <div className="rounded-2xl bg-white p-4 border border-orange-100 shadow-2xs flex flex-col gap-2 sm:col-span-2">
                    <div className="flex items-center justify-between border-b border-orange-100/60 pb-2">
                      <h5 className="font-bold text-foreground text-xs sm:text-sm">Data Wali</h5>
                      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-800">
                        {student.guardian.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Nama:</span>{" "}
                        <strong className="text-foreground">{student.guardian.name}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pekerjaan:</span>{" "}
                        <strong className="text-foreground">{student.guardian.occupation || "-"}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Penghasilan:</span>{" "}
                        <strong className="text-foreground">{student.guardian.incomePerMonth || "-"}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground">No HP:</span>{" "}
                        <strong className="text-foreground">{student.guardian.phone || "-"}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2 TAB NAVIGATION HEADER */}
      <div className="flex items-center rounded-2xl bg-white/90 p-1.5 shadow-sm border border-orange-100/80 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setActiveTab("akademik")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === "akademik"
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25"
              : "text-muted-foreground hover:text-foreground hover:bg-orange-50/60"
          }`}
        >
          <GraduationCap className="size-4 sm:size-5" />
          <span>Pemantauan Akademik</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              activeTab === "akademik"
                ? "bg-white/20 text-white"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {student.academicUpdates.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("penyaluran")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === "penyaluran"
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25"
              : "text-muted-foreground hover:text-foreground hover:bg-orange-50/60"
          }`}
        >
          <UploadCloud className="size-4 sm:size-5" />
          <span>Input Penyaluran Dana</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              activeTab === "penyaluran"
                ? "bg-white/20 text-white"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {student.disbursementHistory.length}
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: PEMANTAUAN AKADEMIK                               */}
      {/* ======================================================== */}
      {activeTab === "akademik" && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Nilai Awal Pendaftaran */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/5 p-5 sm:p-6 border border-orange-200 shadow-sm backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-md shadow-orange-500/25">
                  <BookOpen className="size-6" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-950">
                    Nilai Awal Pendaftaran
                  </span>
                  <h4 className="text-sm sm:text-base font-extrabold text-foreground">
                    Nilai Rata-rata Rapor / IPK Awal
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Data nilai yang tercatat saat calon adik asuh pertama kali melakukan pendaftaran.
                  </p>
                </div>
              </div>

              <div className="self-end sm:self-center flex items-baseline gap-1.5 rounded-2xl bg-white px-5 py-3 shadow-sm border border-orange-200">
                <span className="text-xs font-bold text-muted-foreground">Skor:</span>
                <span className="text-2xl sm:text-3xl font-black text-orange-600">
                  {student.nilaiAwal || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Info Sekolah & Estimasi Biaya */}
          <div className={`grid grid-cols-1 gap-4 ${student.isBinaan ? "sm:grid-cols-2" : ""}`}>
            {/* Informasi Sekolah & Jenjang */}
            <div className="flex flex-col gap-3 rounded-3xl bg-white/90 p-5 shadow-sm backdrop-blur-md border border-orange-100/80">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <BookOpen className="size-4 text-orange-500" />
                Informasi Sekolah & Jenjang
              </h3>
              <div className="flex flex-col gap-2 text-sm">
                <div className="rounded-xl bg-orange-50/60 p-3">
                  <span className="text-xs text-muted-foreground">Nama Sekolah / Universitas</span>
                  <p className="font-bold text-foreground text-base">{student.schoolName || "-"}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-orange-50/60 p-3">
                    <span className="text-xs text-muted-foreground">Kelas / Semester</span>
                    <p className="font-bold text-foreground">{student.gradeLevel || "-"}</p>
                  </div>
                  <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 p-3">
                    <span className="text-xs text-amber-900 font-semibold">Nilai Rapor / IPK</span>
                    <p className="font-extrabold text-orange-600 text-base">{student.nilaiAwal || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rincian Kebutuhan Biaya Pendidikan (KHUSUS Adik Asuh Binaan Saya) */}
            {student.isBinaan && (
              <div className="flex flex-col gap-3 rounded-3xl bg-white/90 p-5 shadow-sm backdrop-blur-md border border-orange-100/80">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Estimasi Biaya Pendidikan</h3>
                  <span className="text-xs font-bold text-orange-600">
                    {student.educationCosts.length} Komponen
                  </span>
                </div>
                <div className="flex flex-col divide-y divide-border/60 text-sm">
                  {student.educationCosts.length > 0 ? (
                    student.educationCosts.map((cost) => (
                      <div key={cost.id} className="flex justify-between py-2">
                        <span className="text-muted-foreground">{cost.label}</span>
                        <span className="font-bold text-foreground">
                          Rp {cost.amount.toLocaleString("id-ID")}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="py-2 text-xs text-muted-foreground">
                      Tidak ada rincian biaya khusus.
                    </p>
                  )}
                  <div className="flex justify-between pt-2 text-base font-extrabold text-orange-600">
                    <span>Total Biaya</span>
                    <span>Rp {totalCost.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Riwayat Pembaruan Nilai & Rapor Berkala */}
          <div className="flex flex-col gap-4 rounded-3xl bg-white/90 p-5 sm:p-6 shadow-md backdrop-blur-md border border-orange-100/80">
            <div className="flex items-center justify-between border-b border-orange-100/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <Clock className="size-4" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-extrabold text-foreground">
                    Riwayat Pembaruan Nilai & Rapor
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Pembaruan nilai berkala yang diunggah oleh adik asuh per semester
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
                {student.academicUpdates.length} Pembaruan
              </span>
            </div>

            {/* List Riwayat / Kondisi Kosong */}
            {student.academicUpdates.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-400 border border-orange-200/60">
                  <FileText className="size-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">
                    Belum ada update nilai/rapor sejak pendaftaran
                  </p>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    Siswa ini belum mengunggah nilai semester baru. Pembaruan akan tampil otomatis di sini setelah diinput oleh siswa.
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
                          Tidak ada lampiran rapor
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* NOTICE INFORMASI READ-ONLY */}
          <div className="flex items-start gap-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs leading-relaxed text-amber-950 sm:text-sm">
            <Info className="size-5 shrink-0 text-amber-600 mt-0.5" aria-hidden="true" />
            <span>
              <strong>Informasi Pengawas:</strong> Modul ini bersifat <em>read-only</em> untuk memantau perkembangan nilai dan berkas rapor adik asuh. Pembaruan nilai berkala diinput secara mandiri oleh siswa melalui dashboard masing-masing.
            </span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: INPUT PENYALURAN DANA                             */}
      {/* ======================================================== */}
      {activeTab === "penyaluran" && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Success Notification */}
          {successMessage && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-xs sm:text-sm text-emerald-900 flex items-start justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-emerald-950">Bukti Berhasil Dikirim!</p>
                  <p className="text-emerald-800 leading-relaxed">{successMessage}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSuccessMessage(null)}
                className="text-emerald-700 hover:text-emerald-900 p-1 rounded-lg"
              >
                <X className="size-4" />
              </button>
            </div>
          )}

          {/* Error Notification */}
          {errorMessage && (
            <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs sm:text-sm text-rose-900 flex items-start gap-3 shadow-xs">
              <AlertCircle className="size-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-rose-950">Perhatian</p>
                <p className="text-rose-800">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="rounded-3xl border border-orange-100/90 bg-white/95 p-6 sm:p-8 shadow-md backdrop-blur-md space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-orange-100">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-orange-500 text-white font-bold shadow-xs">
                <UploadCloud className="size-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-foreground">
                  Formulir Penyerahan Dana
                </h2>
                <p className="text-xs text-muted-foreground">
                  Lengkapi nominal dan lampiran bukti penyerahan dana beasiswa untuk {student.fullName}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitDisbursement} className="space-y-5">
              {/* Penerima Dana (Preselected, No Dropdown Needed) */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1">
                  <UserCheck className="size-4 text-orange-500" />
                  <span>Adik Asuh Penerima Dana</span>
                </label>
                <div className="flex items-center justify-between rounded-2xl border border-orange-200/80 bg-orange-50/40 p-4">
                  <div className="space-y-0.5">
                    <p className="font-bold text-foreground text-sm sm:text-base">
                      {student.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {student.schoolName} ({student.gradeLevel}) • Wilayah: {student.wilayah}
                    </p>
                  </div>
                  <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow-2xs">
                    {student.isBinaan ? "Binaan Saya" : `Wilayah ${student.wilayah}`}
                  </span>
                </div>
              </div>

              {/* Input Nominal Format Rupiah Otomatis */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1">
                  <Coins className="size-4 text-orange-500" />
                  <span>Nominal Dana yang Diserahkan *</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-orange-600">
                    Rp
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatNominal(nominalRaw)}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "")
                      setNominalRaw(raw)
                    }}
                    placeholder="Contoh: 500.000"
                    className="w-full h-13 rounded-2xl border border-orange-200/80 bg-orange-50/30 pl-12 pr-4 text-base font-bold text-foreground focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition"
                    required
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Ketik angka nominal murni, tanda titik otomatis diformat.
                </p>
              </div>

              {/* Upload File / Foto Bukti Transfer */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1">
                  <FileCheck className="size-4 text-orange-500" />
                  <span>Upload Foto / Dokumen Bukti Transfer *</span>
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-disbursement-student-input"
                />

                {!selectedFile ? (
                  <label
                    htmlFor="file-disbursement-student-input"
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50/40 p-6 text-center hover:bg-orange-50 hover:border-orange-400 transition cursor-pointer group"
                  >
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm group-hover:scale-105 transition-transform">
                      <UploadCloud className="size-6" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs sm:text-sm font-bold text-foreground">
                        Klik untuk memilih foto struk transfer / nota / PDF
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Mendukung JPG, PNG, WEBP, atau PDF (Maksimal 15 MB)
                      </p>
                    </div>
                  </label>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-orange-200 bg-orange-50/50 p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {filePreviewUrl ? (
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-orange-200 bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={filePreviewUrl}
                            alt="Preview Bukti"
                            className="size-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 font-bold text-xs">
                          <FileText className="size-6" />
                        </div>
                      )}

                      <div className="min-w-0 space-y-0.5">
                        <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Siap Dikirim
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition cursor-pointer"
                    >
                      <X className="size-3.5" />
                      <span>Ganti File</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-3 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 px-7 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-500/25 transition disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <UploadCloud className="size-4" />
                  )}
                  <span>{isPending ? "Mengirim Bukti..." : "Kirim Bukti Penyaluran"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Riwayat Bukti Penyaluran Khusus Siswa Ini */}
          <div className="rounded-3xl border border-orange-100/90 bg-white/95 p-6 sm:p-8 shadow-md backdrop-blur-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-orange-100">
              <div className="space-y-0.5">
                <h2 className="text-base sm:text-lg font-bold text-foreground">
                  Riwayat Pengajuan Bukti Siswa Ini
                </h2>
                <p className="text-xs text-muted-foreground">
                  Daftar bukti penyaluran yang telah Anda kirimkan khusus untuk {student.fullName}
                </p>
              </div>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800">
                {student.disbursementHistory.length} Berkas
              </span>
            </div>

            {student.disbursementHistory.length === 0 ? (
              <div className="py-10 text-center text-xs text-muted-foreground rounded-2xl bg-orange-50/30 border border-dashed border-orange-200">
                <Clock className="size-8 text-orange-300 mx-auto mb-2" />
                <p className="font-bold text-foreground text-sm">
                  Belum Ada Bukti Diunggah untuk Siswa Ini
                </p>
                <p className="mt-1">
                  Gunakan formulir di atas untuk mengirimkan bukti penyaluran dana pertama kali.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-orange-100/80 border border-orange-100 rounded-2xl overflow-hidden">
                {student.disbursementHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-orange-50/40 transition"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-bold text-orange-600 font-mono text-base sm:text-lg">
                          {item.nominal
                            ? `Rp ${item.nominal.toLocaleString("id-ID")}`
                            : "-"}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-[11px]">
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
                            <span className="font-mono text-[11px]">
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
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="size-3.5 text-emerald-500" />
                          Terverifikasi
                        </span>
                      ) : item.status === "rejected" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 border border-rose-200">
                          <XCircle className="size-3.5 text-rose-500" />
                          Ditolak
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200">
                          <Clock className="size-3.5 text-amber-500" />
                          Menunggu Verifikasi
                        </span>
                      )}

                      {/* Tombol Lihat Bukti */}
                      {item.fileUrl && (
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-xl bg-white border border-orange-200 px-3 py-1.5 text-xs font-bold text-orange-950 hover:bg-orange-50 transition shadow-2xs"
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
      )}
    </div>
  )
}
