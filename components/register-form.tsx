"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { registerAction, type RegisterPayload } from "@/app/actions/auth"
import { uploadRegistrationDocumentAction } from "@/app/actions/documents"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileCheck,
  Info,
  Loader2,
  LogIn,
  PartyPopper,
  Plus,
  Trash2,
} from "lucide-react"

type Family = {
  name: string
  status: string
  occupation: string
  incomePerMonth: string
  address: string
  phone: string
  medicalHistory: string
}

type Cost = { label: string; amount: string }

const emptyFamily = (): Family => ({
  name: "",
  status: "Hidup",
  occupation: "",
  incomePerMonth: "",
  address: "",
  phone: "",
  medicalHistory: "",
})

const wilayahPengawasMap: Record<string, string[]> = {
  Pati: ["Pak Kusnadi", "Pak Sukijo", "Ibu Nugraheni"],
  Jepara: ["Ibu Susilo"],
  Ampel: ["Ibu Nining", "Ibu Marni"],
  Wonosobo: ["Pak Narman"],
  Sukabumi: ["Ibu Deasy"],
  Bandung: ["Pak Sutrisno"],
}

const regions = Object.keys(wilayahPengawasMap)

const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
]

const formatNominal = (val: string) => {
  const digits = val.replace(/\D/g, "")
  return digits ? Number(digits).toLocaleString("id-ID") : ""
}

/**
 * Kompresi gambar di sisi klien sebelum dikirim ke server.
 * Memperkecil resolusi foto kamera HP (3-10MB) menjadi < 800KB secara otomatis
 * dan mengonversi format foto (termasuk foto iPhone) menjadi JPEG standar.
 */
async function compressImageClientSide(file: File): Promise<File> {
  // Jika file PDF, jangan kompres dengan canvas
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    return file
  }

  // Jika ukuran file sudah kecil (< 500 KB), tidak perlu dikompres
  if (file.size < 500 * 1024) {
    return file
  }

  try {
    return await new Promise<File>((resolve) => {
      const img = new window.Image()
      const url = URL.createObjectURL(file)

      img.onload = () => {
        URL.revokeObjectURL(url)
        const maxDimension = 1920
        let { width, height } = img

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          } else {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }

        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          return resolve(file)
        }

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              const baseName = file.name.replace(/\.[^/.]+$/, "")
              const compressedFile = new File([blob], `${baseName}.jpg`, {
                type: "image/jpeg",
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              resolve(file)
            }
          },
          "image/jpeg",
          0.82
        )
      }

      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(file) // Fallback file asli jika tidak bisa dimuat di canvas
      }

      img.src = url
    })
  } catch (err) {
    console.warn("Client-side image compression fallback", err)
    return file
  }
}

export function RegisterForm() {
  const [pending, startTransition] = useTransition()
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")

  // Form state
  const [data, setData] = useState({
    username: "",
    nik: "",
    fullName: "",
    birthDay: "1",
    birthMonth: "Januari",
    birthYear: "2010",
    gender: "",
    citaCita: "",
    wilayah: "",
    pengawasName: "",
    alamatLengkap: "",
    noHp: "",
    riwayatPenyakit: "",
    schoolName: "",
    gradeLevel: "",
    nilaiRataRata: "",
    jumlahSaudara: "0",
  })

  const [father, setFather] = useState(emptyFamily())
  const [mother, setMother] = useState(emptyFamily())
  const [guardian, setGuardian] = useState(emptyFamily())

  const [costs, setCosts] = useState<Cost[]>([
    { label: "Biaya SPP Bulanan / Uang Kuliah", amount: "" },
    { label: "Uang Buku & Seragam", amount: "" },
  ])

  const [uploadedFiles, setUploadedFiles] = useState<{
    [key in "KK" | "RAPOR" | "FOTO_ANAK"]?: { name: string; url: string; uploading: boolean }
  }>({})

  const set = (key: string, value: string) => setData((d) => ({ ...d, [key]: value }))

  const handleFileUpload = async (type: "KK" | "RAPOR" | "FOTO_ANAK", file: File) => {
    setError("")

    if (file.size > 15 * 1024 * 1024) {
      setError(`Ukuran file "${file.name}" terlalu besar (maksimal 15 MB). Silakan pilih file yang lebih kecil atau kompres terlebih dahulu.`)
      return
    }

    setUploadedFiles((prev) => ({
      ...prev,
      [type]: { name: file.name, url: "", uploading: true },
    }))

    try {
      // Kompresi otomatis di sisi browser untuk foto kamera HP berukuran besar
      const processedFile = await compressImageClientSide(file)

      const formData = new FormData()
      formData.append("type", type)
      formData.append("username", data.username.trim() || "temp")
      formData.append("file", processedFile)

      const res = await uploadRegistrationDocumentAction(formData)
      if (res.success) {
        setUploadedFiles((prev) => ({
          ...prev,
          [type]: { name: file.name, url: res.fileUrl, uploading: false },
        }))
      } else {
        setError(res.error || "Gagal mengunggah berkas. Silakan coba lagi.")
        setUploadedFiles((prev) => {
          const copy = { ...prev }
          delete copy[type]
          return copy
        })
      }
    } catch (err) {
      console.error("Upload failed", err)
      setError("Gagal mengunggah berkas. Periksa koneksi internet Anda atau coba kompres berkas terlebih dahulu.")
      setUploadedFiles((prev) => {
        const copy = { ...prev }
        delete copy[type]
        return copy
      })
    }
  }

  const next = () => {
    setError("")

    // Step 1 validation
    if (step === 1) {
      if (!data.username.trim()) return setError("Username wajib diisi.")
      if (/\s/.test(data.username)) return setError("Username tidak boleh mengandung spasi.")
      if (!/^\d{16}$/.test(data.nik.trim())) {
        return setError(`NIK harus terdiri dari 16 angka (saat ini ${data.nik.length} angka).`)
      }
    }

    // Step 2 validation
    if (step === 2) {
      if (!data.fullName.trim()) return setError("Nama lengkap wajib diisi.")
      if (!data.birthDay || !data.birthMonth || !data.birthYear) {
        return setError("Tanggal lahir lengkap (Tanggal-Bulan-Tahun) wajib dipilih.")
      }
      if (!data.gender) return setError("Silakan pilih jenis kelamin (Laki-laki / Perempuan).")
      if (!data.wilayah) return setError("Silakan pilih wilayah tugas.")
      if (!data.alamatLengkap.trim()) return setError("Alamat lengkap wajib diisi.")
      if (!data.noHp.trim()) return setError("Nomor WhatsApp / HP wajib diisi.")
    }

    // Step 3 validation
    if (step === 3) {
      if (!data.schoolName.trim()) return setError("Nama Sekolah / Universitas wajib diisi.")
      if (!data.gradeLevel.trim()) return setError("Kelas / Tingkat / Semester wajib diisi.")
      if (!data.nilaiRataRata.trim()) {
        return setError("Nilai Rata-Rata Raport / IPK terakhir wajib diisi.")
      }
    }

    // Step 4 validation
    if (step === 4) {
      if (!father.name.trim() && !mother.name.trim() && !guardian.name.trim()) {
        return setError("Harap isi setidaknya data salah satu orang tua atau wali.")
      }
    }

    setStep((s) => s + 1)
  }

  const submitRegistration = () => {
    setError("")

    // Step 5 validation: seluruh dokumen wajib diupload
    if (!uploadedFiles.KK?.url || !uploadedFiles.RAPOR?.url || !uploadedFiles.FOTO_ANAK?.url) {
      return setError("Seluruh berkas (Kartu Keluarga, Foto Raport Terakhir, dan Foto Anak) wajib diunggah.")
    }

    // Build birth date ISO string
    const monthIndex = months.indexOf(data.birthMonth)
    const birthDateObj = new Date(
      Number(data.birthYear),
      monthIndex >= 0 ? monthIndex : 0,
      Number(data.birthDay)
    )
    const dateOfBirthStr = birthDateObj.toISOString().split("T")[0]

    const documentsPayload = Object.entries(uploadedFiles)
      .filter(([_, item]) => item && item.url)
      .map(([type, item]) => ({
        type,
        fileUrl: item!.url,
      }))

    const payload: RegisterPayload = {
      username: data.username.trim(),
      nik: data.nik.trim(),
      fullName: data.fullName.trim(),
      dateOfBirth: dateOfBirthStr,
      gender: data.gender,
      citaCita: data.citaCita.trim(),
      wilayah: data.wilayah.trim(),
      pengawasName: data.pengawasName.trim(),
      alamatLengkap: data.alamatLengkap.trim(),
      noHp: data.noHp.trim(),
      riwayatPenyakit: data.riwayatPenyakit.trim() || "-",
      schoolName: data.schoolName.trim(),
      gradeLevel: data.gradeLevel.trim(),
      nilaiRataRata: data.nilaiRataRata.trim(),
      jumlahSaudara: Number(data.jumlahSaudara) || 0,
      educationCosts: costs
        .filter((c) => c.label.trim() && Number(c.amount) > 0)
        .map((c) => ({
          label: c.label.trim(),
          amount: Number(c.amount) || 0,
        })),
      documents: documentsPayload,
      father,
      mother,
      guardian,
    }

    startTransition(async () => {
      const result = await registerAction(payload)
      if (result.error) {
        setError(result.error)
      } else {
        // Pindah ke Langkah 6 (Selesai Pendaftaran & Selamat)
        setStep(6)
      }
    })
  }

  // Cek kelengkapan data per langkah secara real-time (mengikuti logic validasi wajib)
  const stepTitles = [
    "Kredensial Akun",
    "Profil Siswa",
    "Pendidikan & Biaya",
    "Data Orang Tua / Wali",
    "Unggah Dokumen",
  ]

  const isStep1Complete = Boolean(
    data.username.trim() &&
    !/\s/.test(data.username) &&
    /^\d{16}$/.test(data.nik.trim())
  )

  const isStep2Complete = Boolean(
    data.fullName.trim() &&
    data.birthDay &&
    data.birthMonth &&
    data.birthYear &&
    data.gender &&
    data.wilayah &&
    data.alamatLengkap.trim() &&
    data.noHp.trim()
  )

  const isStep3Complete = Boolean(
    data.schoolName.trim() &&
    data.gradeLevel.trim() &&
    data.nilaiRataRata.trim()
  )

  const isStep4Complete = Boolean(
    father.name.trim() || mother.name.trim() || guardian.name.trim()
  )

  const isStep5Complete = Boolean(
    uploadedFiles.KK?.url &&
    uploadedFiles.RAPOR?.url &&
    uploadedFiles.FOTO_ANAK?.url
  )

  const stepsStatus = [
    isStep1Complete,
    isStep2Complete,
    isStep3Complete,
    isStep4Complete,
    isStep5Complete,
  ]

  return (
    <div className="flex flex-1 flex-col gap-5 px-4 sm:px-5 py-4">
      {/* Progress Taskbar Informatif & Interaktif */}
      {step < 6 && (
        <div className="flex flex-col gap-3 rounded-3xl bg-white/90 p-4 shadow-sm backdrop-blur-md border border-white/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-black text-orange-800 shrink-0">
                Langkah {step} / 5
              </span>
              <span className="text-xs font-bold text-foreground truncate">
                {stepTitles[step - 1]}
              </span>
            </div>
          </div>

          {/* 5 Tombol Kotak Progress Bar (Oranye = Belum Lengkap, Hijau = Lengkap, Ring = Aktif) */}
          <div className="grid grid-cols-5 gap-2" role="group" aria-label="Progress langkah pendaftaran">
            {stepsStatus.map((isComplete, i) => {
              const stepNum = i + 1
              const isActive = step === stepNum
              const statusText = isComplete ? "Sudah lengkap" : "Belum lengkap"

              return (
                <button
                  key={stepNum}
                  type="button"
                  onClick={() => {
                    setError("")
                    setStep(stepNum)
                  }}
                  aria-label={`Langkah ${stepNum}: ${stepTitles[i]}, ${statusText}${isActive ? " (Sedang aktif)" : ""}`}
                  className={`group relative flex h-9 items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${
                    isComplete
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/25"
                      : "bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-500/25"
                  } ${
                    isActive
                      ? "ring-2 ring-orange-600 ring-offset-2 ring-offset-white font-black scale-105 shadow-md"
                      : "opacity-85 hover:opacity-100"
                  }`}
                >
                  <span className="text-xs font-extrabold flex items-center gap-1">
                    {stepNum}
                    {isComplete && <Check className="size-3 stroke-[3]" />}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Legend Indikator Status & Navigasi */}
          <div className="flex items-center justify-between border-t border-border/40 pt-2 text-[10px] font-semibold text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span className="text-emerald-700">Hijau: Lengkap</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-orange-500" />
                <span className="text-orange-700">Oranye: Belum Lengkap</span>
              </div>
            </div>
            <span className="text-orange-600 font-bold hidden sm:inline">Klik angka untuk loncat</span>
          </div>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-2xl bg-red-500/15 border border-red-500/30 p-4 text-sm font-medium text-destructive backdrop-blur-md shadow-sm"
        >
          <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* LANGKAH 1: KREDENSIAL SISTEM */}
      {step === 1 && (
        <Section
          title="1. Informasi Akun"
          note="Data yang akan digunakan untuk masuk ke aplikasi nanti."
        >
          <Field label="Username *">
            <Input
              value={data.username}
              onChange={(e) => set("username", e.target.value.replace(/\s+/g, "").toLowerCase())}
              placeholder="Contoh: yuhen01"
              className="h-14 rounded-2xl bg-white text-base shadow-sm"
              required
            />
          </Field>

          <Field label="Nomor Induk Kependudukan (NIK) *">
            <div className="flex flex-col gap-1.5">
              <Input
                inputMode="numeric"
                maxLength={16}
                value={data.nik}
                onChange={(e) => set("nik", e.target.value.replace(/\D/g, ""))}
                placeholder="Masukkan 16 digit angka"
                className="h-14 rounded-2xl bg-white text-base shadow-sm"
                required
              />
              {/* Indikator jumlah angka yang diinputkan */}
              <div className="flex items-center justify-between text-xs font-semibold">
                <span
                  className={
                    data.nik.length === 16
                      ? "text-emerald-600 font-bold"
                      : "text-muted-foreground"
                  }
                >
                  {data.nik.length === 16 ? (
                    <span className="flex items-center gap-1">
                      <Check className="size-3.5" /> 16 angka lengkap
                    </span>
                  ) : (
                    `Sudah diisi: ${data.nik.length} dari 16 angka`
                  )}
                </span>
                <span className="text-muted-foreground">Maks. 16 angka</span>
              </div>
            </div>
          </Field>

          <Hint>
            Simpan <strong>Username</strong> atau <strong>NIK</strong> ini baik-baik. Anda dapat masuk
            menggunakan salah satunya nanti.
          </Hint>
        </Section>
      )}

      {/* LANGKAH 2: PROFIL SISWA */}
      {step === 2 && (
        <Section
          title="2. Profil Siswa"
          note="Identitas pribadi calon adik asuh dan pemilihan pengawas wilayah."
        >
          <Field label="Nama Lengkap (Sesuai Akta / Identitas) *">
            <Input
              value={data.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="Contoh: Yuhen Aditya Gunawan"
              className="h-14 rounded-2xl bg-white text-base shadow-sm"
            />
          </Field>

          {/* Tanggal Lahir Format Tanggal-Bulan-Tahun (Tanpa Kalender) */}
          <Field label="Tanggal Lahir (Format: Tanggal - Bulan - Tahun) *">
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-3 gap-2">
                {/* Tanggal */}
                <select
                  value={data.birthDay}
                  onChange={(e) => set("birthDay", e.target.value)}
                  className="h-14 rounded-2xl border border-border bg-white px-3 text-sm font-semibold text-foreground shadow-sm"
                  aria-label="Pilih Tanggal"
                >
                  {Array.from({ length: 31 }, (_, i) => String(i + 1)).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                {/* Bulan */}
                <select
                  value={data.birthMonth}
                  onChange={(e) => set("birthMonth", e.target.value)}
                  className="h-14 rounded-2xl border border-border bg-white px-3 text-sm font-semibold text-foreground shadow-sm"
                  aria-label="Pilih Bulan"
                >
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>

                {/* Tahun */}
                <select
                  value={data.birthYear}
                  onChange={(e) => set("birthYear", e.target.value)}
                  className="h-14 rounded-2xl border border-border bg-white px-3 text-sm font-semibold text-foreground shadow-sm"
                  aria-label="Pilih Tahun"
                >
                  {Array.from({ length: 30 }, (_, i) => String(2026 - i)).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Format terpilih: <strong>{`${data.birthDay}-${data.birthMonth}-${data.birthYear}`}</strong>
              </p>
            </div>
          </Field>

          <Field label="Jenis Kelamin *">
            <div className="grid grid-cols-2 gap-2">
              {["Laki-laki", "Perempuan"].map((x) => (
                <Button
                  key={x}
                  type="button"
                  variant={data.gender === x ? "default" : "outline"}
                  onClick={() => set("gender", x)}
                  className={`h-12 rounded-2xl text-sm font-bold shadow-sm ${
                    data.gender !== x ? "bg-white/90 hover:bg-white" : ""
                  }`}
                >
                  {x}
                </Button>
              ))}
            </div>
          </Field>

          <Field label="Cita-cita">
            <Input
              value={data.citaCita}
              onChange={(e) => set("citaCita", e.target.value)}
              placeholder="Contoh: Dokter, Chef, Insinyur"
              className="h-14 rounded-2xl bg-white text-base shadow-sm"
            />
          </Field>

          <Field label="Wilayah Penempatan (Pilih Kota) *">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {regions.map((reg) => (
                <Button
                  key={reg}
                  type="button"
                  variant={data.wilayah === reg ? "default" : "outline"}
                  onClick={() => {
                    set("wilayah", reg)
                    set("pengawasName", wilayahPengawasMap[reg]?.[0] || "")
                  }}
                  className={`h-12 rounded-2xl text-sm font-bold shadow-sm ${
                    data.wilayah !== reg ? "bg-white/90 hover:bg-white" : ""
                  }`}
                >
                  {reg}
                </Button>
              ))}
            </div>
          </Field>

          {data.wilayah && (
            <Field label={`Pengawas Wilayah ${data.wilayah}`}>
              <div className="flex flex-col gap-2">
                {wilayahPengawasMap[data.wilayah]?.map((pName) => (
                  <Button
                    key={pName}
                    type="button"
                    variant={data.pengawasName === pName ? "default" : "outline"}
                    onClick={() => set("pengawasName", pName)}
                    className={`h-12 justify-start rounded-2xl px-4 text-sm font-semibold shadow-sm ${
                      data.pengawasName !== pName ? "bg-white/90 hover:bg-white" : ""
                    }`}
                  >
                    {pName}
                  </Button>
                ))}
              </div>
            </Field>
          )}

          <Field label="Alamat Lengkap (Domisili saat ini) *">
            <Textarea
              value={data.alamatLengkap}
              onChange={(e) => set("alamatLengkap", e.target.value)}
              placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota"
              className="min-h-24 rounded-2xl bg-white text-base shadow-sm"
            />
          </Field>

          <Field label="Nomor WhatsApp / HP Aktif *">
            <Input
              inputMode="tel"
              value={data.noHp}
              onChange={(e) => set("noHp", e.target.value)}
              placeholder="Contoh: 08123456789"
              className="h-14 rounded-2xl bg-white text-base shadow-sm"
            />
          </Field>

          <Field label='Riwayat Penyakit (isi dengan " - " bila tidak ada)'>
            <Textarea
              value={data.riwayatPenyakit}
              onChange={(e) => set("riwayatPenyakit", e.target.value)}
              className="min-h-20 rounded-2xl bg-white text-base shadow-sm"
            />
          </Field>
        </Section>
      )}

      {/* LANGKAH 3: INFORMASI PENDIDIKAN & BIAYA */}
      {step === 3 && (
        <Section
          title="3. Informasi Pendidikan & Biaya"
          note="Data sekolah dan estimasi kebutuhan biaya pendidikan."
        >
          <Field label="Nama Sekolah / Universitas *">
            <Input
              value={data.schoolName}
              onChange={(e) => set("schoolName", e.target.value)}
              placeholder="Contoh: SMP Negeri 1 Pati"
              className="h-14 rounded-2xl bg-white text-base shadow-sm"
            />
          </Field>

          <Field label="Kelas / Semester *">
            <Input
              value={data.gradeLevel}
              onChange={(e) => set("gradeLevel", e.target.value)}
              placeholder="Contoh: 7 SMP / Semester 6"
              className="h-14 rounded-2xl bg-white text-base shadow-sm"
            />
          </Field>

          <Field label="Nilai Rata-Rata Raport / IPK Terakhir * (Wajib Diisi)">
            <Input
              value={data.nilaiRataRata}
              onChange={(e) => set("nilaiRataRata", e.target.value)}
              placeholder="Contoh: 88.5 atau 3.80"
              className="h-14 rounded-2xl bg-white text-base shadow-sm"
              required
            />
          </Field>

          <Field label="Berapa Bersaudara">
            <Input
              type="number"
              min="0"
              value={data.jumlahSaudara}
              onChange={(e) => set("jumlahSaudara", e.target.value)}
              className="h-14 rounded-2xl bg-white text-base shadow-sm"
            />
          </Field>

          {/* Rincian Biaya Pendidikan dengan Format Nominal Titik */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-white/80 p-4 shadow-sm">
            <div className="flex flex-col gap-1">
              <Label className="font-bold text-foreground">Komponen Biaya Pendidikan</Label>
              <p className="text-xs text-muted-foreground">
                Tuliskan kebutuhan biaya pendidikan (misal SPP, Uang Buku, dsb).
              </p>
            </div>

            {costs.map((c, i) => (
              <div key={i} className="flex flex-col gap-2 rounded-xl bg-secondary/40 p-3 sm:flex-row shadow-sm border border-border/50">
                <Input
                  placeholder="Keterangan biaya (contoh: SPP Bulanan)"
                  value={c.label}
                  onChange={(e) =>
                    setCosts((arr) =>
                      arr.map((x, j) => (j === i ? { ...x, label: e.target.value } : x))
                    )
                  }
                  className="h-12 flex-1 rounded-xl bg-white text-sm"
                />
                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:w-44">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                      Rp
                    </span>
                    <Input
                      inputMode="numeric"
                      placeholder="0"
                      value={formatNominal(c.amount)}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "")
                        setCosts((arr) =>
                          arr.map((x, j) => (j === i ? { ...x, amount: raw } : x))
                        )
                      }}
                      className="h-12 rounded-xl bg-white pl-9 text-sm font-semibold"
                    />
                  </div>
                  {costs.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setCosts((arr) => arr.filter((_, j) => j !== i))}
                      aria-label="Hapus baris biaya"
                      className="shrink-0 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => setCosts((arr) => [...arr, { label: "", amount: "" }])}
              className="mt-1 h-11 rounded-xl font-semibold bg-white/90 hover:bg-white shadow-sm"
            >
              <Plus className="size-4 mr-1.5" />
              Tambah Komponen Biaya
            </Button>
          </div>
        </Section>
      )}

      {/* LANGKAH 4: DATA ORANG TUA / WALI */}
      {step === 4 && (
        <Section
          title="4. Informasi Keluarga & Orang Tua"
          note="Data orang tua atau wali."
        >
          <FamilyFields title="Data Ayah" value={father} onChange={setFather} />
          <FamilyFields title="Data Ibu" value={mother} onChange={setMother} />
          <FamilyFields
            title="Data Wali (Opsional / Jika Ada)"
            value={guardian}
            onChange={setGuardian}
          />
        </Section>
      )}

      {/* LANGKAH 5: UNGGAH DOKUMEN PENDUKUNG DENGAN BUTTON (+) DAN WAJIB */}
      {step === 5 && (
        <Section
          title="5. Unggah Dokumen Pendukung (Wajib Seluruhnya)"
          note="Seluruh berkas fisik (Format Gambar atau PDF, maksimal 10 MB per file) wajib diunggah."
        >
          {(
            [
              ["KK", "1. Kartu Keluarga (KK) *"],
              ["RAPOR", "2. Foto Raport Terakhir (Halaman Nilai & Identitas) *"],
              ["FOTO_ANAK", "3. Foto Anak (Formal / Bebas) *"],
            ] as const
          ).map(([key, label]) => {
            const item = uploadedFiles[key]
            const inputId = `file-upload-${key}`
            return (
              <div
                key={key}
                className={`flex flex-col gap-3 rounded-2xl border p-4 transition shadow-sm ${
                  item?.url
                    ? "border-emerald-500/50 bg-emerald-50/70"
                    : "border-border/80 bg-white/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor={inputId} className="font-bold text-foreground text-sm cursor-pointer">
                    {label}
                  </Label>
                  {item?.url ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <CheckCircle2 className="size-4" /> Terunggah
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-destructive">Wajib diunggah</span>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  id={inputId}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(key, file)
                  }}
                />

                {/* Custom upload button (+) */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between">
                  <label
                    htmlFor={inputId}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs sm:text-sm font-bold cursor-pointer transition shadow-sm ${
                      item?.url
                        ? "border-emerald-500 bg-emerald-100/80 text-emerald-800 hover:bg-emerald-100"
                        : "border-primary bg-primary/10 text-primary hover:bg-primary/20"
                    }`}
                  >
                    {item?.uploading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" /> Sedang Mengunggah...
                      </span>
                    ) : item?.url ? (
                      <span className="flex items-center gap-2">
                        <FileCheck className="size-4" /> Ganti Berkas ({item.name})
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Plus className="size-4" /> Pilih & Unggah Berkas
                      </span>
                    )}
                  </label>

                  {item?.name && !item.uploading && (
                    <p className="truncate text-xs text-muted-foreground font-medium max-w-xs">
                      {item.name}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </Section>
      )}

      {/* LANGKAH 6: SELAMAT MENJADI ADIK ASUH & LOGIN */}
      {step === 6 && (
        <div className="flex flex-col items-center justify-center gap-6 rounded-3xl bg-white/95 p-6 sm:p-8 text-center shadow-lg backdrop-blur-md border border-white/80 animate-in fade-in zoom-in-95">
          <div className="flex size-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
            <PartyPopper className="size-12" />
          </div>

          <div className="space-y-3 max-w-md">
            <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
              Selamat, Pendaftaran Berhasil!
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Selamat datang di keluarga besar <strong>Adik Asuh Vihara Vimala Dharma</strong>.
              Data dan seluruh berkas pendaftaranmu telah berhasil kami terima.
            </p>
          </div>

          <div className="w-full max-w-sm rounded-2xl bg-secondary/60 p-4 text-xs text-left space-y-1.5 border border-border/50">
            <p className="font-bold text-foreground">Kredensial Masuk Anda:</p>
            <p className="text-muted-foreground">
              Username: <strong className="text-foreground">{data.username}</strong>
            </p>
            <p className="text-muted-foreground">
              NIK: <strong className="text-foreground">{data.nik}</strong>
            </p>
          </div>

          <Button
            size="lg"
            nativeButton={false}
            className="h-14 w-full max-w-sm rounded-2xl text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
            render={
              <Link href="/login" className="flex items-center justify-center gap-2">
                <LogIn className="size-5" />
                <span>Masuk ke Halaman Login</span>
              </Link>
            }
          />
        </div>
      )}

      {/* Tombol Aksi Bawah (Hanya untuk Langkah 1 - 5) */}
      {step < 6 && (
        <div className="flex flex-col gap-3 rounded-3xl bg-white/85 p-4 shadow-sm backdrop-blur-md border border-white/80">
          {step < 5 ? (
            <Button
              type="button"
              size="lg"
              onClick={next}
              className="h-14 rounded-2xl text-base font-bold shadow-md bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
            >
              <span>Lanjut</span>
              <ArrowRight className="size-5 ml-1.5" />
            </Button>
          ) : (
            <Button
              type="button"
              size="lg"
              onClick={submitRegistration}
              disabled={pending}
              className="h-14 rounded-2xl text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
            >
              {pending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-5 animate-spin" /> Sedang Mendaftarkan...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Check className="size-5" /> Selesaikan Pendaftaran
                </span>
              )}
            </Button>
          )}

          {step > 1 ? (
            <Button
              type="button"
              size="lg"
              variant="secondary"
              onClick={() => setStep((s) => s - 1)}
              className="h-14 rounded-2xl text-base font-bold bg-white/90 hover:bg-white border border-border/80 text-foreground shadow-sm"
            >
              <ArrowLeft className="size-5 mr-1.5" />
              <span>Kembali</span>
            </Button>
          ) : (
            <Button
              size="lg"
              variant="ghost"
              nativeButton={false}
              render={<Link href="/">Batal & Kembali ke Beranda</Link>}
              className="h-12 rounded-2xl text-sm font-semibold text-muted-foreground hover:text-foreground"
            />
          )}
        </div>
      )}
    </div>
  )
}

function Section({
  title,
  note,
  children,
}: {
  title: string
  note: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-5 rounded-3xl bg-white/90 p-5 sm:p-6 shadow-md backdrop-blur-md border border-white/80">
      <div className="flex flex-col gap-1 border-b border-border/60 pb-3">
        <h2 className="text-xl font-extrabold text-foreground">{title}</h2>
        <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">{note}</p>
      </div>
      {children}
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="font-bold text-foreground text-sm">{label}</Label>
      {children}
    </div>
  )
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs leading-relaxed text-amber-950 sm:text-sm">
      <Info className="size-5 shrink-0 text-amber-600 mt-0.5" aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}

function FamilyFields({
  title,
  value,
  onChange,
}: {
  title: string
  value: Family
  onChange: (v: Family) => void
}) {
  const setVal = (p: Partial<Family>) => onChange({ ...value, ...p })
  const isDeceased = value.status === "Meninggal Dunia"

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === "Meninggal Dunia") {
      onChange({
        ...value,
        status: newStatus,
        occupation: "-",
        incomePerMonth: "-",
        phone: "-",
        address: "-",
        medicalHistory: "-",
      })
    } else {
      onChange({
        ...value,
        status: newStatus,
        occupation: value.occupation === "-" ? "" : value.occupation,
        incomePerMonth: value.incomePerMonth === "-" ? "" : value.incomePerMonth,
        phone: value.phone === "-" ? "" : value.phone,
        address: value.address === "-" ? "" : value.address,
        medicalHistory: value.medicalHistory === "-" ? "" : value.medicalHistory,
      })
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/80 p-4 bg-white/80 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/60 pb-2">
        <h3 className="font-bold text-foreground text-sm">{title}</h3>
      </div>
      <Field label="Nama Lengkap">
        <Input
          value={value.name}
          onChange={(e) => setVal({ name: e.target.value })}
          placeholder="Isi Nama lengkap Orang tua"
          className="h-12 rounded-xl bg-white text-sm shadow-sm"
        />
      </Field>
      <Field label="Kondisi / Status">
        <select
          value={value.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="h-12 rounded-xl border border-border bg-white px-3 text-sm font-semibold text-foreground shadow-sm"
        >
          <option value="Hidup">Hidup</option>
          <option value="Meninggal Dunia">Meninggal Dunia</option>
        </select>
      </Field>
      <Field label="Pekerjaan">
        <Input
          disabled={isDeceased}
          value={isDeceased ? "-" : value.occupation}
          onChange={(e) => setVal({ occupation: e.target.value })}
          placeholder={isDeceased ? "Tidak berlaku (Meninggal Dunia)" : "Contoh: Petani, Peternak"}
          className="h-12 rounded-xl bg-white text-sm shadow-sm disabled:bg-muted/60 disabled:text-muted-foreground disabled:cursor-not-allowed"
        />
      </Field>
      <Field label="Penghasilan per Bulan ">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
            Rp
          </span>
          <Input
            disabled={isDeceased}
            inputMode="numeric"
            value={isDeceased ? "-" : formatNominal(value.incomePerMonth)}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "")
              setVal({ incomePerMonth: raw ? `Rp ${Number(raw).toLocaleString("id-ID")}` : "" })
            }}
            placeholder={isDeceased ? "-" : "0"}
            className="h-12 rounded-xl bg-white pl-9 text-sm font-semibold shadow-sm disabled:bg-muted/60 disabled:text-muted-foreground disabled:cursor-not-allowed"
          />
        </div>
      </Field>
      <Field label="Nomor Telepon / HP">
        <Input
          disabled={isDeceased}
          value={isDeceased ? "-" : value.phone}
          onChange={(e) => setVal({ phone: e.target.value })}
          placeholder={isDeceased ? "Tidak berlaku" : "Nomor HP aktif"}
          className="h-12 rounded-xl bg-white text-sm shadow-sm disabled:bg-muted/60 disabled:text-muted-foreground disabled:cursor-not-allowed"
        />
      </Field>
      <Field label="Alamat Domisili">
        <Textarea
          disabled={isDeceased}
          value={isDeceased ? "-" : value.address}
          onChange={(e) => setVal({ address: e.target.value })}
          placeholder={isDeceased ? "Tidak berlaku" : "Kota Tempat Tinggal saat ini"}
          className="min-h-16 rounded-xl bg-white text-sm shadow-sm disabled:bg-muted/60 disabled:text-muted-foreground disabled:cursor-not-allowed"
        />
      </Field>
      <Field label='Riwayat Penyakit (isi dengan " - " bila tidak ada)'>
        <Textarea
          disabled={isDeceased}
          value={isDeceased ? "-" : value.medicalHistory}
          onChange={(e) => setVal({ medicalHistory: e.target.value })}
          placeholder={isDeceased ? "Tidak berlaku" : ""}
          className="min-h-16 rounded-xl bg-white text-sm shadow-sm disabled:bg-muted/60 disabled:text-muted-foreground disabled:cursor-not-allowed"
        />
      </Field>
    </div>
  )
}
