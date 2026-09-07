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
  UserCheck,
  Calendar,
  Sparkles,
  X,
  FileCheck,
  ShieldCheck,
} from "lucide-react"
import { createPengawasDisbursementProofAction } from "@/app/actions/pengawas"

export interface PengawasStudentOption {
  id: number
  fullName: string
  schoolName: string
  gradeLevel: string
  wilayah: string
}

export interface PengawasProofHistoryItem {
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
}

interface PengawasPenyaluranFormProps {
  students: PengawasStudentOption[]
  history: PengawasProofHistoryItem[]
  pengawasName: string
  wilayah: string
}

function formatNominal(val: string | number): string {
  if (!val) return ""
  const num = typeof val === "string" ? parseInt(val.replace(/\D/g, ""), 10) : val
  if (isNaN(num)) return ""
  return num.toLocaleString("id-ID")
}

export function PengawasPenyaluranForm({
  students,
  history,
  pengawasName,
  wilayah,
}: PengawasPenyaluranFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form states
  const [selectedStudentId, setSelectedStudentId] = useState<string>("")
  const [nominalRaw, setNominalRaw] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null)

  // Feedback states
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!selectedStudentId) {
      setErrorMessage("Silakan pilih adik asuh penerima dana.")
      return
    }

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
    formData.append("studentId", selectedStudentId)
    formData.append("nominal", String(num))
    formData.append("file", selectedFile)

    startTransition(async () => {
      const res = await createPengawasDisbursementProofAction(formData)
      if (res.success) {
        setSuccessMessage(res.message)
        // Reset form
        setSelectedStudentId("")
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
    <div className="space-y-8">
      {/* 1. Header & Navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/pengawas"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/90 border border-orange-200/80 px-3 py-1.5 text-xs font-bold text-orange-950 hover:bg-white shadow-2xs transition"
            >
              <ArrowLeft className="size-3.5 text-orange-600" />
              <span>Kembali ke Dashboard</span>
            </Link>
            <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-800">
              Wilayah {wilayah}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight pt-1">
            Input Bukti Penyaluran Dana
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
            Unggah bukti penyerahan atau transfer dana beasiswa untuk adik asuh
            binaan Anda guna diverifikasi oleh Administrator Pusat.
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-xs sm:text-sm text-emerald-900 flex items-start justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-emerald-950">
                Bukti Berhasil Dikirim!
              </p>
              <p className="text-emerald-800 leading-relaxed">
                {successMessage}
              </p>
            </div>
          </div>
          <Link
            href="/pengawas"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition shrink-0 shadow-2xs"
          >
            <span>Ke Dashboard</span>
          </Link>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs sm:text-sm text-rose-900 flex items-start gap-3 shadow-xs animate-in fade-in">
          <AlertCircle className="size-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-rose-950">Perhatian</p>
            <p className="text-rose-800">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* 2. Main Form Card */}
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
              Lengkapi data penerima, nominal, dan lampiran bukti penyerahan
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Dropdown Pilih Adik Asuh */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1">
              <UserCheck className="size-4 text-orange-500" />
              <span>Pilih Adik Asuh Penerima Dana *</span>
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full h-13 rounded-2xl border border-orange-200/80 bg-orange-50/30 px-4 text-sm font-semibold text-foreground focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition cursor-pointer"
              required
            >
              <option value="">-- Pilih Adik Asuh Binaan --</option>
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.fullName} — {st.schoolName} ({st.gradeLevel}) [Wilayah: {st.wilayah}]
                </option>
              ))}
            </select>
            <p className="text-[11px] text-muted-foreground">
              Menampilkan adik asuh binaan di wilayah tugas {wilayah}.
            </p>
          </div>

          {/* 2. Input Nominal Format Rupiah Otomatis */}
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

          {/* 3. Upload File / Foto Bukti Transfer */}
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
              id="file-disbursement-input"
            />

            {!selectedFile ? (
              <label
                htmlFor="file-disbursement-input"
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

          {/* Tombol Kirim */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <Link
              href="/pengawas"
              className="rounded-2xl border border-orange-200/80 bg-white px-5 py-3 text-xs sm:text-sm font-bold text-muted-foreground hover:bg-orange-50 hover:text-foreground transition"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 hover:bg-orange-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-500/25 transition disabled:opacity-50 cursor-pointer"
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

      {/* 3. LIST RIWAYAT BUKTI YANG SUDAH PERNAH DIUPLOAD PENGAWAS INI */}
      <div className="rounded-3xl border border-orange-100/90 bg-white/95 p-6 sm:p-8 shadow-md backdrop-blur-md space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-orange-100">
          <div className="space-y-0.5">
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              Riwayat Pengajuan Bukti Anda
            </h2>
            <p className="text-xs text-muted-foreground">
              Pantau status audit dan persetujuan berkas yang telah Anda kirimkan
            </p>
          </div>
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800">
            {history.length} Berkas
          </span>
        </div>

        {history.length === 0 ? (
          <div className="py-10 text-center text-xs text-muted-foreground rounded-2xl bg-orange-50/30 border border-dashed border-orange-200">
            <Clock className="size-8 text-orange-300 mx-auto mb-2" />
            <p className="font-bold text-foreground text-sm">
              Belum Ada Bukti Diunggah
            </p>
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
                    <span className="font-bold text-foreground text-sm">
                      {item.student.fullName}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      ({item.student.schoolName})
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-bold text-orange-600 font-mono text-sm">
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

                  {/* Tombol Lihat Bukti File */}
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
  )
}
