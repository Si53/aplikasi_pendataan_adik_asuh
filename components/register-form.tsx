"use client"

import { useState, useEffect, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { registerAction, updateStudentRegistrationAction, type RegisterPayload } from "@/app/actions/auth"
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
  ChevronDown,
  FileCheck,
  Info,
  Loader2,
  LogIn,
  PartyPopper,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
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

const DRAFT_STORAGE_KEY = "adik-asuh-draft-pendaftaran"
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

type RegistrationDraft = {
  version: 1
  step: number
  data: {
    username: string
    nik: string
    fullName: string
    birthDay: string
    birthMonth: string
    birthYear: string
    gender: string
    citaCita: string
    wilayah: string
    pengawasName: string
    alamatLengkap: string
    noHp: string
    riwayatPenyakit: string
    schoolName: string
    jenjang?: string
    gradeLevel: string
    nilaiRataRata: string
    jumlahSaudara: string
  }
  educationLevelType: "Sekolah" | "Kuliah"
  father: Family
  mother: Family
  guardian: Family
  costs: Cost[]
  consentAgreed: boolean
  savedAt: number
}

export type RegisterFormProps = {
  isEditMode?: boolean
  originalIdentifier?: string
  revisionNote?: string | null
  initialStudentData?: {
    id: number
    username: string
    nik: string
    fullName: string
    dateOfBirth: Date | string
    gender: string
    citaCita?: string | null
    wilayah: string
    pengawasId?: number | null
    pengawas?: { name: string } | null
    alamatLengkap: string
    noHp: string
    riwayatPenyakit?: string | null
    schoolName: string
    jenjang?: string | null
    gradeLevel: string
    nilaiRataRata: string
    jumlahSaudara?: number | null
    father?: Family | null
    mother?: Family | null
    guardian?: Family | null
    educationCosts?: { label: string; amount: number }[]
    documents?: { type: string; fileUrl: string }[]
  }
}

export function RegisterForm({
  isEditMode = false,
  originalIdentifier,
  revisionNote,
  initialStudentData,
}: RegisterFormProps = {}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")

  const initDate = initialStudentData?.dateOfBirth ? new Date(initialStudentData.dateOfBirth) : null
  const isValidDate = Boolean(initDate && !isNaN(initDate.getTime()))

  const [educationLevelType, setEducationLevelType] = useState<"Sekolah" | "Kuliah">(
    initialStudentData?.jenjang === "Kuliah" ? "Kuliah" : "Sekolah"
  )

  // Draft storage states
  const [pendingDraft, setPendingDraft] = useState<RegistrationDraft | null>(null)
  const [showResumeBanner, setShowResumeBanner] = useState(false)
  const [hasLoadedDraft, setHasLoadedDraft] = useState(isEditMode)

  // Form state
  const [data, setData] = useState({
    username: initialStudentData?.username || "",
    nik: initialStudentData?.nik || "",
    fullName: initialStudentData?.fullName || "",
    birthDay: isValidDate ? String(initDate!.getDate()) : "1",
    birthMonth: isValidDate ? months[initDate!.getMonth()] || "Januari" : "Januari",
    birthYear: isValidDate ? String(initDate!.getFullYear()) : "2010",
    gender: initialStudentData?.gender || "",
    citaCita: initialStudentData?.citaCita || "",
    wilayah: initialStudentData?.wilayah || "",
    pengawasName: initialStudentData?.pengawas?.name || "",
    alamatLengkap: initialStudentData?.alamatLengkap || "",
    noHp: initialStudentData?.noHp || "",
    riwayatPenyakit: initialStudentData?.riwayatPenyakit || "",
    schoolName: initialStudentData?.schoolName || "",
    jenjang: initialStudentData?.jenjang || "",
    gradeLevel: initialStudentData?.gradeLevel || "",
    nilaiRataRata: initialStudentData?.nilaiRataRata || "",
    jumlahSaudara: String(initialStudentData?.jumlahSaudara ?? "0"),
  })

  const [father, setFather] = useState<Family>(
    initialStudentData?.father
      ? {
          name: initialStudentData.father.name || "",
          status: initialStudentData.father.status || "Hidup",
          occupation: initialStudentData.father.occupation || "",
          incomePerMonth: initialStudentData.father.incomePerMonth || "",
          address: initialStudentData.father.address || "",
          phone: initialStudentData.father.phone || "",
          medicalHistory: initialStudentData.father.medicalHistory || "",
        }
      : emptyFamily()
  )

  const [mother, setMother] = useState<Family>(
    initialStudentData?.mother
      ? {
          name: initialStudentData.mother.name || "",
          status: initialStudentData.mother.status || "Hidup",
          occupation: initialStudentData.mother.occupation || "",
          incomePerMonth: initialStudentData.mother.incomePerMonth || "",
          address: initialStudentData.mother.address || "",
          phone: initialStudentData.mother.phone || "",
          medicalHistory: initialStudentData.mother.medicalHistory || "",
        }
      : emptyFamily()
  )

  const [guardian, setGuardian] = useState<Family>(
    initialStudentData?.guardian
      ? {
          name: initialStudentData.guardian.name || "",
          status: initialStudentData.guardian.status || "Hidup",
          occupation: initialStudentData.guardian.occupation || "",
          incomePerMonth: initialStudentData.guardian.incomePerMonth || "",
          address: initialStudentData.guardian.address || "",
          phone: initialStudentData.guardian.phone || "",
          medicalHistory: initialStudentData.guardian.medicalHistory || "",
        }
      : emptyFamily()
  )

  // Accordion state untuk Langkah 4 (Data Keluarga) - default Ayah terbuka
  const [openFamilyAccordions, setOpenFamilyAccordions] = useState<{
    father: boolean
    mother: boolean
    guardian: boolean
  }>({
    father: true,
    mother: Boolean(initialStudentData?.mother?.name),
    guardian: Boolean(initialStudentData?.guardian?.name),
  })

  const toggleFamilyAccordion = (key: "father" | "mother" | "guardian") => {
    setOpenFamilyAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const [costs, setCosts] = useState<Cost[]>(
    initialStudentData?.educationCosts && initialStudentData.educationCosts.length > 0
      ? initialStudentData.educationCosts.map((c) => ({
          label: c.label,
          amount: String(c.amount),
        }))
      : [
          { label: "Biaya SPP Bulanan", amount: "" },
          { label: "Uang Buku & Seragam", amount: "" },
        ]
  )

  type PrestasiItem = {
    id: string
    name: string
    url: string
    uploading: boolean
  }

  const initialDocsMap: {
    [key in "KK" | "RAPOR" | "FOTO_ANAK" | "SKTM"]?: { name: string; url: string; uploading: boolean }
  } = {}
  if (initialStudentData?.documents) {
    for (const doc of initialStudentData.documents) {
      if (doc.type === "KK" || doc.type === "RAPOR" || doc.type === "FOTO_ANAK" || doc.type === "SKTM") {
        initialDocsMap[doc.type] = {
          name: `${doc.type}_terlampir.file`,
          url: doc.fileUrl,
          uploading: false,
        }
      }
    }
  }

  const [uploadedFiles, setUploadedFiles] = useState<{
    [key in "KK" | "RAPOR" | "FOTO_ANAK" | "SKTM"]?: { name: string; url: string; uploading: boolean }
  }>(initialDocsMap)

  const initialPrestasiItems: PrestasiItem[] = (initialStudentData?.documents || [])
    .filter((d) => d.type === "PRESTASI")
    .map((d, index) => ({
      id: `existing-prestasi-${index}-${d.fileUrl.slice(-6)}`,
      name: `Sertifikat Prestasi ${index + 1}`,
      url: d.fileUrl,
      uploading: false,
    }))

  const [prestasiFiles, setPrestasiFiles] = useState<PrestasiItem[]>(initialPrestasiItems)
  const [consentAgreed, setConsentAgreed] = useState(isEditMode)

  const set = (key: string, value: string) => setData((d) => ({ ...d, [key]: value }))

  // 1. Cek draft di localStorage saat halaman pertama kali dibuka (HANYA jika BUKAN mode edit)
  useEffect(() => {
    if (isEditMode) return
    if (typeof window === "undefined") return

    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY)
      if (raw) {
        const parsed: RegistrationDraft = JSON.parse(raw)
        const age = Date.now() - (parsed.savedAt || 0)

        if (age > SEVEN_DAYS_MS) {
          // Draft sudah lebih dari 7 hari: hapus otomatis
          localStorage.removeItem(DRAFT_STORAGE_KEY)
          setHasLoadedDraft(true)
        } else if (parsed && parsed.data) {
          setPendingDraft(parsed)
          setShowResumeBanner(true)
        } else {
          localStorage.removeItem(DRAFT_STORAGE_KEY)
          setHasLoadedDraft(true)
        }
      } else {
        setHasLoadedDraft(true)
      }
    } catch (err) {
      console.warn("Failed to check draft from localStorage", err)
      setHasLoadedDraft(true)
    }
  }, [isEditMode])

  const handleResumeDraft = () => {
    if (!pendingDraft) return
    if (pendingDraft.data) {
      setData((prev) => ({ ...prev, ...pendingDraft.data }))
    }
    if (pendingDraft.educationLevelType) {
      setEducationLevelType(pendingDraft.educationLevelType)
    }
    if (pendingDraft.father) {
      setFather(pendingDraft.father)
    }
    if (pendingDraft.mother) {
      setMother(pendingDraft.mother)
    }
    if (pendingDraft.guardian) {
      setGuardian(pendingDraft.guardian)
    }
    if (pendingDraft.costs && pendingDraft.costs.length > 0) {
      setCosts(pendingDraft.costs)
    }
    if (typeof pendingDraft.consentAgreed === "boolean") {
      setConsentAgreed(pendingDraft.consentAgreed)
    }
    if (pendingDraft.step && pendingDraft.step >= 1 && pendingDraft.step <= 5) {
      setStep(pendingDraft.step)
    }
    setShowResumeBanner(false)
    setHasLoadedDraft(true)
  }

  const handleDiscardDraft = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(DRAFT_STORAGE_KEY)
      }
    } catch {
      // ignore
    }
    setPendingDraft(null)
    setShowResumeBanner(false)
    setHasLoadedDraft(true)
  }

  // 2. Auto-save ke localStorage dengan debounce 800ms (HANYA jika BUKAN mode edit)
  useEffect(() => {
    if (isEditMode) return
    if (!hasLoadedDraft) return

    const timer = setTimeout(() => {
      try {
        if (typeof window === "undefined") return

        const hasAnyData =
          Boolean(data.username.trim()) ||
          Boolean(data.nik.trim()) ||
          Boolean(data.fullName.trim()) ||
          Boolean(data.schoolName.trim()) ||
          step > 1 ||
          Boolean(father.name.trim()) ||
          Boolean(mother.name.trim()) ||
          Boolean(guardian.name.trim())

        if (!hasAnyData) return

        const draft: RegistrationDraft = {
          version: 1,
          step,
          data,
          educationLevelType,
          father,
          mother,
          guardian,
          costs,
          consentAgreed,
          savedAt: Date.now(),
        }

        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft))
      } catch (err) {
        console.warn("Auto-save draft failed", err)
      }
    }, 800)

    return () => clearTimeout(timer)
  }, [
    isEditMode,
    hasLoadedDraft,
    step,
    data,
    educationLevelType,
    father,
    mother,
    guardian,
    costs,
    consentAgreed,
  ])

  const handleEducationLevelChange = (lvl: "Sekolah" | "Kuliah") => {
    setEducationLevelType(lvl)
    setData((prev) => ({
      ...prev,
      jenjang: lvl === "Kuliah" ? "Kuliah" : "",
      gradeLevel: "",
    }))
    setCosts((prev) => {
      if (prev.length === 0) {
        return [{ label: lvl === "Kuliah" ? "Biaya Kuliah per Semester" : "Biaya SPP Bulanan", amount: "" }]
      }
      const updated = [...prev]
      const currentFirstLabel = updated[0].label
      if (
        !currentFirstLabel ||
        currentFirstLabel === "Biaya SPP Bulanan" ||
        currentFirstLabel === "Biaya Kuliah per Semester" ||
        currentFirstLabel === "Biaya SPP Bulanan / Uang Kuliah"
      ) {
        updated[0] = {
          ...updated[0],
          label: lvl === "Kuliah" ? "Biaya Kuliah per Semester" : "Biaya SPP Bulanan",
        }
      }
      return updated
    })
  }

  const handleFileUpload = async (type: "KK" | "RAPOR" | "FOTO_ANAK" | "SKTM", file: File) => {
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

  const handlePrestasiUpload = async (file: File) => {
    setError("")

    if (file.size > 15 * 1024 * 1024) {
      setError(`Ukuran file "${file.name}" terlalu besar (maksimal 15 MB). Silakan pilih file yang lebih kecil atau kompres terlebih dahulu.`)
      return
    }

    const tempId = `prestasi-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setPrestasiFiles((prev) => [
      ...prev,
      { id: tempId, name: file.name, url: "", uploading: true },
    ])

    try {
      const processedFile = await compressImageClientSide(file)
      const formData = new FormData()
      formData.append("type", "PRESTASI")
      formData.append("username", data.username.trim() || "temp")
      formData.append("file", processedFile)

      const res = await uploadRegistrationDocumentAction(formData)
      if (res.success) {
        setPrestasiFiles((prev) =>
          prev.map((item) =>
            item.id === tempId ? { ...item, url: res.fileUrl, uploading: false } : item
          )
        )
      } else {
        setError(res.error || "Gagal mengunggah berkas prestasi. Silakan coba lagi.")
        setPrestasiFiles((prev) => prev.filter((item) => item.id !== tempId))
      }
    } catch (err) {
      console.error("Upload prestasi failed", err)
      setError("Gagal mengunggah berkas prestasi. Periksa koneksi internet Anda.")
      setPrestasiFiles((prev) => prev.filter((item) => item.id !== tempId))
    }
  }

  const handleRemovePrestasi = (id: string) => {
    setPrestasiFiles((prev) => prev.filter((item) => item.id !== id))
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
      if (!data.wilayah) return setError("Silakan pilih wilayah penempatan.")
      if (!data.pengawasName.trim()) return setError("Silakan pilih pengawas wilayah.")
      if (!data.alamatLengkap.trim()) return setError("Alamat lengkap wajib diisi.")
      if (!data.noHp.trim()) return setError("Nomor WhatsApp / HP wajib diisi.")
    }

    // Step 3 validation
    if (step === 3) {
      if (educationLevelType === "Sekolah" && !data.jenjang.trim()) {
        return setError("Silakan pilih jenjang pendidikan (SD, SMP, SMA, atau SMK).")
      }
      if (!data.schoolName.trim()) {
        return setError(
          educationLevelType === "Kuliah"
            ? "Nama Universitas / Perguruan Tinggi wajib diisi."
            : "Nama Sekolah wajib diisi."
        )
      }
      if (!data.gradeLevel.trim()) {
        return setError(
          educationLevelType === "Kuliah"
            ? "Silakan pilih Semester saat ini."
            : "Silakan pilih Kelas saat ini."
        )
      }
      if (!data.nilaiRataRata.trim()) {
        return setError(
          educationLevelType === "Kuliah"
            ? "IPK terakhir wajib diisi."
            : "Nilai Rata-Rata Rapor wajib diisi."
        )
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
    if (!uploadedFiles.KK?.url || !uploadedFiles.RAPOR?.url || !uploadedFiles.FOTO_ANAK?.url || !uploadedFiles.SKTM?.url) {
      return setError("Seluruh berkas wajib (Kartu Keluarga, Raport Terakhir, Foto Anak, dan SKTM) wajib diunggah.")
    }

    if (!consentAgreed) {
      return setError("Harap setujui ketentuan penggunaan data sebelum menyelesaikan pendaftaran.")
    }

    // Build birth date ISO string
    const monthIndex = months.indexOf(data.birthMonth)
    const birthDateObj = new Date(
      Number(data.birthYear),
      monthIndex >= 0 ? monthIndex : 0,
      Number(data.birthDay)
    )
    const dateOfBirthStr = birthDateObj.toISOString().split("T")[0]

    const singleDocsPayload = Object.entries(uploadedFiles)
      .filter(([_, item]) => item && item.url)
      .map(([type, item]) => ({
        type,
        fileUrl: item!.url,
      }))

    const prestasiPayload = prestasiFiles
      .filter((item) => item.url)
      .map((item) => ({
        type: "PRESTASI",
        fileUrl: item.url,
      }))

    const documentsPayload = [...singleDocsPayload, ...prestasiPayload]

    const finalJenjang = educationLevelType === "Kuliah" ? "Kuliah" : (data.jenjang.trim() || null)

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
      jenjang: finalJenjang,
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
      let result
      if (isEditMode) {
        result = await updateStudentRegistrationAction({
          ...payload,
          studentId: initialStudentData?.id,
          originalIdentifier: originalIdentifier || initialStudentData?.username,
        })
      } else {
        result = await registerAction(payload)
      }

      if (result.error) {
        setError(result.error)
      } else {
        if (!isEditMode) {
          try {
            if (typeof window !== "undefined") {
              localStorage.removeItem(DRAFT_STORAGE_KEY)
            }
          } catch {
            // ignore
          }
        }
        router.push(
          `/daftar/sukses?name=${encodeURIComponent(payload.fullName)}&username=${encodeURIComponent(payload.username)}`
        )
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
    data.pengawasName.trim() &&
    data.alamatLengkap.trim() &&
    data.noHp.trim()
  )

  const isStep3Complete = Boolean(
    data.schoolName.trim() &&
    (educationLevelType === "Kuliah" || data.jenjang.trim()) &&
    data.gradeLevel.trim() &&
    data.nilaiRataRata.trim()
  )

  const isStep4Complete = Boolean(
    father.name.trim() || mother.name.trim() || guardian.name.trim()
  )

  const isStep5Complete = Boolean(
    uploadedFiles.KK?.url &&
    uploadedFiles.RAPOR?.url &&
    uploadedFiles.FOTO_ANAK?.url &&
    uploadedFiles.SKTM?.url &&
    consentAgreed
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
      {/* BANNER CATATAN REVISI DARI ADMIN (Hanya tampil saat mode perbaikan pendaftaran) */}
      {isEditMode && (
        <div
          role="region"
          aria-label="Catatan revisi dari admin"
          className="relative overflow-hidden rounded-3xl border-2 border-blue-400/80 bg-gradient-to-br from-blue-50/95 via-sky-50/90 to-blue-100/80 p-5 sm:p-6 shadow-lg shadow-blue-500/10 backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-300"
        >
          <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-blue-500/10 blur-xl" />

          <div className="relative z-10 flex flex-col gap-3.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-xs">
                <Info className="size-3.5" />
                <span>Catatan Revisi dari Admin</span>
              </span>
              <span className="rounded-full bg-white/85 px-2.5 py-0.5 text-xs font-bold text-blue-900 border border-blue-200">
                Mode Perbaikan Data
              </span>
            </div>

            <div className="rounded-2xl border border-blue-200/90 bg-white/90 p-4 shadow-xs">
              <p className="text-sm sm:text-base font-bold text-blue-950 leading-relaxed whitespace-pre-wrap">
                &ldquo;{revisionNote || "Mohon periksa dan perbaiki kelengkapan formulir pendaftaran kamu."}&rdquo;
              </p>
            </div>

            <p className="text-xs font-medium text-blue-950/80 flex items-start sm:items-center gap-1.5">
              <span className="shrink-0 text-blue-600 font-bold">💡</span>
              <span>
                Kamu bebas memperbaiki data di setiap langkah (1–5) atau mengunggah ulang dokumen, lalu klik <strong>&ldquo;Kirim Perbaikan&rdquo;</strong> di langkah terakhir.
              </span>
            </p>
          </div>
        </div>
      )}

      {/* BANNER RESUME DRAFT (Tampil ramah jika ada draft belum selesai < 7 hari dan bukan mode edit) */}
      {!isEditMode && showResumeBanner && pendingDraft && (
        <div
          role="region"
          aria-label="Pemulihan draft pendaftaran"
          className="relative overflow-hidden rounded-3xl border-2 border-orange-300/80 bg-gradient-to-br from-amber-50/95 via-orange-50/90 to-amber-100/80 p-5 sm:p-6 shadow-lg shadow-orange-500/10 backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-300"
        >
          {/* Subtle Decorative Circle on top right for desktop aesthetic */}
          <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-orange-500/10 blur-xl" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
            {/* Left: Icon & Text Information */}
            <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
              <div className="flex size-12 sm:size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25">
                <RotateCcw className="size-6" />
              </div>
              <div className="space-y-1 sm:space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-200/90 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-orange-900 border border-orange-300/60">
                    <Sparkles className="size-3 text-orange-700" />
                    <span>Draft Otomatis Ditemukan</span>
                  </span>
                  <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-orange-800 border border-orange-200/80 shadow-2xs">
                    Langkah {pendingDraft.step} dari 5: {stepTitles[pendingDraft.step - 1]}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-foreground">
                  Sepertinya kamu punya pendaftaran yang belum selesai. Mau lanjutkan?
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap">
                  <span>
                    Terakhir disimpan:{" "}
                    <strong className="text-foreground font-bold">
                      {new Date(pendingDraft.savedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      WIB
                    </strong>
                  </span>
                </p>
              </div>
            </div>

            {/* Right: Actions Buttons */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t border-orange-200/60 sm:border-t-0">
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-stone-700 hover:bg-stone-100 hover:text-stone-900 border border-stone-200 transition shadow-xs cursor-pointer active:scale-95"
              >
                <Trash2 className="size-4 text-stone-500" />
                <span>Mulai Baru</span>
              </button>

              <button
                type="button"
                onClick={handleResumeDraft}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-black text-white hover:from-orange-600 hover:to-amber-600 transition shadow-md shadow-orange-500/25 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Check className="size-4 stroke-[3]" />
                <span>Lanjutkan Draft</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Taskbar Informatif & Interaktif */}
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
                    set("pengawasName", "")
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
            <Field label={`Pengawas Wilayah ${data.wilayah} *`}>
              <select
                value={data.pengawasName}
                onChange={(e) => set("pengawasName", e.target.value)}
                className="h-14 w-full rounded-2xl border border-border bg-white px-4 text-sm font-semibold text-foreground shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                aria-label={`Pilih Pengawas Wilayah ${data.wilayah}`}
              >
                <option value="">-- Pilih Pengawas --</option>
                {wilayahPengawasMap[data.wilayah]?.map((pName) => (
                  <option key={pName} value={pName}>
                    {pName}
                  </option>
                ))}
              </select>
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
          note="Data pendidikan dan estimasi kebutuhan biaya pendidikan."
        >
          {/* 1. Radio Button Paling Atas: Sekolah vs Kuliah */}
          <Field label="Kategori Pendidikan *">
            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Pilih Kategori Pendidikan">
              {(["Sekolah", "Kuliah"] as const).map((lvl) => {
                const isSelected = educationLevelType === lvl
                return (
                  <label
                    key={lvl}
                    className={`flex items-center gap-3 rounded-2xl border p-3.5 transition cursor-pointer shadow-sm select-none ${
                      isSelected
                        ? "border-orange-500 bg-orange-50/80 text-orange-950 font-bold ring-2 ring-orange-500/20"
                        : "border-border/80 bg-white/90 text-foreground hover:bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="educationLevelType"
                      value={lvl}
                      checked={isSelected}
                      onChange={() => handleEducationLevelChange(lvl)}
                      className="sr-only"
                    />
                    <div
                      className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                        isSelected
                          ? "border-orange-500 bg-orange-500"
                          : "border-stone-300 bg-white"
                      }`}
                    >
                      {isSelected && <span className="size-2 rounded-full bg-white shadow-xs" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{lvl}</span>
                      <span className="text-[11px] text-muted-foreground font-normal">
                        {lvl === "Sekolah" ? "SD, SMP, SMA, atau SMK" : "Perguruan Tinggi / Universitas"}
                      </span>
                    </div>
                  </label>
                )
              })}
            </div>
          </Field>

          {/* 2. JIKA "Sekolah" dipilih: Pilihan tombol jenjang SD, SMP, SMA, SMK */}
          {educationLevelType === "Sekolah" && (
            <Field label="Jenjang Sekolah *">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(["SD", "SMP", "SMA", "SMK"] as const).map((j) => {
                  const isSelected = data.jenjang === j
                  return (
                    <button
                      key={j}
                      type="button"
                      onClick={() => {
                        set("jenjang", j)
                        set("gradeLevel", "")
                      }}
                      className={`flex items-center justify-center gap-2 rounded-2xl border py-3.5 px-4 font-bold text-sm transition cursor-pointer shadow-sm ${
                        isSelected
                          ? "border-orange-500 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/25 ring-2 ring-orange-500/30"
                          : "border-border/80 bg-white text-foreground hover:border-orange-300 hover:bg-orange-50/50"
                      }`}
                    >
                      {isSelected && <Check className="size-4 stroke-[3]" />}
                      <span>{j}</span>
                    </button>
                  )
                })}
              </div>
            </Field>
          )}

          {/* 3. Input Nama Sekolah / Universitas */}
          <Field label={educationLevelType === "Kuliah" ? "Nama Universitas / Perguruan Tinggi *" : "Nama Sekolah *"}>
            <Input
              value={data.schoolName}
              onChange={(e) => set("schoolName", e.target.value)}
              placeholder={
                educationLevelType === "Kuliah"
                  ? "Contoh: Universitas Diponegoro"
                  : data.jenjang === "SD"
                  ? "Contoh: SD Negeri 1 Pati"
                  : data.jenjang === "SMP"
                  ? "Contoh: SMP Negeri 1 Pati"
                  : data.jenjang === "SMA"
                  ? "Contoh: SMA Negeri 1 Pati"
                  : data.jenjang === "SMK"
                  ? "Contoh: SMK Negeri 1 Pati"
                  : "Contoh: SMP Negeri 1 Pati"
              }
              className="h-14 rounded-2xl bg-white text-base shadow-sm"
            />
          </Field>

          {/* 4. Dropdown Kelas (untuk Sekolah) / Semester (untuk Kuliah) */}
          {educationLevelType === "Sekolah" ? (
            <Field label={`Tingkat / Kelas ${data.jenjang ? `(${data.jenjang})` : ""} *`}>
              <select
                disabled={!data.jenjang}
                value={data.gradeLevel}
                onChange={(e) => set("gradeLevel", e.target.value)}
                className="h-14 w-full rounded-2xl border border-border bg-white px-4 text-base font-semibold text-foreground shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:bg-muted/50 disabled:text-muted-foreground disabled:cursor-not-allowed cursor-pointer"
              >
                <option value="">
                  {data.jenjang ? `-- Pilih Kelas (${data.jenjang}) --` : "-- Pilih Jenjang Sekolah di Atas Dulu --"}
                </option>
                {data.jenjang === "SD" && (
                  <>
                    <option value="1">Kelas 1</option>
                    <option value="2">Kelas 2</option>
                    <option value="3">Kelas 3</option>
                    <option value="4">Kelas 4</option>
                    <option value="5">Kelas 5</option>
                    <option value="6">Kelas 6</option>
                  </>
                )}
                {(data.jenjang === "SMP" || data.jenjang === "SMA" || data.jenjang === "SMK") && (
                  <>
                    <option value="1">Kelas 1</option>
                    <option value="2">Kelas 2</option>
                    <option value="3">Kelas 3</option>
                  </>
                )}
              </select>
            </Field>
          ) : (
            <Field label="Semester *">
              <select
                value={data.gradeLevel}
                onChange={(e) => set("gradeLevel", e.target.value)}
                className="h-14 w-full rounded-2xl border border-border bg-white px-4 text-base font-semibold text-foreground shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer"
              >
                <option value="">-- Pilih Semester Kuliah --</option>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((s) => (
                  <option key={s} value={String(s)}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </Field>
          )}

          {/* 5. Input Nilai Rata-Rata / IPK */}
          <Field label={educationLevelType === "Kuliah" ? "IPK *" : "Nilai Rata-Rata Rapor *"}>
            <Input
              value={data.nilaiRataRata}
              onChange={(e) => set("nilaiRataRata", e.target.value)}
              placeholder={educationLevelType === "Kuliah" ? "Contoh: 3.80" : "Contoh: 88.5"}
              className="h-14 rounded-2xl bg-white text-base shadow-sm"
              required
            />
          </Field>

          {/* Rincian Biaya Pendidikan dengan Format Nominal Titik */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-white/80 p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col gap-1">
              <Label className="font-bold text-foreground text-sm sm:text-base">
                Komponen Biaya Pendidikan
              </Label>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                Tuliskan estimasi kebutuhan biaya pendidikan (contoh:{" "}
                <strong className="text-foreground">
                  {educationLevelType === "Kuliah" ? "Biaya Kuliah per Semester, Buku Kuliah" : "SPP Bulanan, Seragam, Uang Buku"}
                </strong>
                ).
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {costs.map((c, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2.5 rounded-2xl bg-secondary/50 p-3.5 sm:p-4 shadow-sm border border-border/60"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Jenis / Keterangan Biaya #{i + 1}
                    </span>
                    <Input
                      placeholder={
                        i === 0
                          ? educationLevelType === "Kuliah"
                            ? "Biaya Kuliah per Semester"
                            : "Biaya SPP Bulanan"
                          : "Contoh: Uang Buku / Seragam"
                      }
                      value={c.label}
                      onChange={(e) =>
                        setCosts((arr) =>
                          arr.map((x, j) => (j === i ? { ...x, label: e.target.value } : x))
                        )
                      }
                      className="h-12 w-full rounded-xl bg-white text-sm sm:text-base font-medium text-foreground shadow-xs placeholder:text-muted-foreground/70"
                    />
                  </div>

                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider sm:hidden">
                        Nominal Estimasi (Rp)
                      </span>
                      <div className="relative w-full">
                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-bold text-stone-500">
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
                          className="h-12 w-full rounded-xl bg-white pl-10 text-sm sm:text-base font-bold text-foreground shadow-xs placeholder:text-muted-foreground/70"
                        />
                      </div>
                    </div>

                    {costs.length > 1 && (
                      <div className="flex justify-end pt-1 sm:pt-0 sm:pl-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setCosts((arr) => arr.filter((_, j) => j !== i))}
                          aria-label="Hapus baris biaya"
                          className="h-10 px-3 text-xs font-semibold text-destructive hover:bg-destructive/10 rounded-xl cursor-pointer"
                        >
                          <Trash2 className="size-4 mr-1" /> Hapus
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setCosts((arr) => [...arr, { label: "", amount: "" }])}
              className="mt-1 h-12 rounded-xl text-xs sm:text-sm font-bold border-dashed border-orange-300 bg-orange-50/60 text-orange-700 hover:bg-orange-100/70 shadow-xs cursor-pointer"
            >
              <Plus className="size-4 mr-1.5" />
              Tambah Komponen Biaya
            </Button>
          </div>
        </Section>
      )}

      {/* LANGKAH 4: DATA ORANG TUA / WALI (ACCORDION COLLAPSIBLE) */}
      {step === 4 && (
        <Section
          title="4. Informasi Keluarga & Orang Tua"
          note="Data orang tua atau wali calon adik asuh. Klik masing-masing bagian untuk membuka formulir."
        >
          {/* Field Jumlah Saudara di luar accordion */}
          <Field label="Berapa Bersaudara (Termasuk kamu)">
            <Input
              type="number"
              min="0"
              value={data.jumlahSaudara}
              onChange={(e) => set("jumlahSaudara", e.target.value)}
              placeholder="Contoh: 2"
              className="h-14 rounded-2xl bg-white text-base shadow-sm"
            />
          </Field>

          {/* 3 Header Collapsible: Data Ayah, Data Ibu, Data Wali */}
          <div className="flex flex-col gap-3 pt-1">
            <FamilyAccordionSection
              title="Data Ayah"
              subtitle="Nama, kondisi, pekerjaan & nomor telepon ayah"
              value={father}
              onChange={setFather}
              isOpen={openFamilyAccordions.father}
              onToggle={() => toggleFamilyAccordion("father")}
            />

            <FamilyAccordionSection
              title="Data Ibu"
              subtitle="Nama, kondisi, pekerjaan & nomor telepon ibu"
              value={mother}
              onChange={setMother}
              isOpen={openFamilyAccordions.mother}
              onToggle={() => toggleFamilyAccordion("mother")}
            />

            <FamilyAccordionSection
              title="Data Wali"
              subtitle="Data wali (jika diasuh selain orang tua kandung)"
              value={guardian}
              onChange={setGuardian}
              isOpen={openFamilyAccordions.guardian}
              onToggle={() => toggleFamilyAccordion("guardian")}
              isOptional={true}
            />
          </div>

          <Hint>
            Harap isi setidaknya data salah satu orang tua (Ayah atau Ibu) atau Wali yang bertanggung jawab.
          </Hint>
        </Section>
      )}

      {/* LANGKAH 5: UNGGAH DOKUMEN PENDUKUNG DENGAN BUTTON (+) DAN WAJIB */}
      {step === 5 && (
        <Section
          title="5. Unggah Dokumen Pendukung"
          note={
            <span>
              Unggah berkas fisik (Format Gambar atau PDF, maksimal 15 MB per file). Tanda bintang (
              <span className="text-red-500 font-extrabold">*</span>) menandakan berkas wajib.
            </span>
          }
        >
          {(
            [
              ["KK", "1. Kartu Keluarga (KK) *"],
              ["RAPOR", "2. Foto Raport Terakhir (Halaman Nilai & Identitas) *"],
              ["FOTO_ANAK", "3. Foto Anak (Formal / Bebas) *"],
              ["SKTM", "4. Surat Keterangan Tidak Mampu (SKTM) *"],
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
                    {renderLabelWithAsterisk(label)}
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

          {/* DOKUMEN PRESTASI (OPSIONAL - MULTI-UPLOAD) */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-white/80 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-bold text-foreground text-sm">
                  5. Dokumen Prestasi (Sertifikat / Piagam)
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Opsional — Unggah sertifikat, piala, atau piagam penghargaan jika ada (dapat lebih dari 1 file).
                </p>
              </div>
              <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-bold text-stone-600 border border-stone-200">
                Opsional
              </span>
            </div>

            {/* Daftar Berkas Prestasi Terunggah */}
            {prestasiFiles.length > 0 && (
              <div className="space-y-2 pt-1">
                {prestasiFiles.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-border/70 bg-white p-3 shadow-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
                        {item.uploading ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <FileCheck className="size-4 text-emerald-600" />
                        )}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <p className="text-xs font-semibold text-foreground truncate max-w-xs sm:max-w-md">
                          {idx + 1}. {item.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {item.uploading ? "Sedang mengunggah..." : "Siap dikirim"}
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemovePrestasi(item.id)}
                      disabled={item.uploading}
                      className="size-8 p-0 text-muted-foreground hover:text-destructive hover:bg-red-50 rounded-lg shrink-0 cursor-pointer"
                      title="Hapus file ini"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Tombol Tambah File Prestasi */}
            <div>
              <input
                id="file-upload-prestasi"
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handlePrestasiUpload(file)
                    e.target.value = ""
                  }
                }}
              />
              <label
                htmlFor="file-upload-prestasi"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary/10 px-4 py-2.5 text-xs sm:text-sm font-bold text-primary hover:bg-primary/20 cursor-pointer transition shadow-sm"
              >
                <Plus className="size-4" /> Tambah File Prestasi
              </label>
            </div>
          </div>

          {/* NOTICE KETENTUAN PENGGUNAAN DATA (PROMINENT & HIGH VISIBILITY) */}
          <div
            className={`rounded-2xl border-2 p-4 sm:p-5 transition-all shadow-sm ${
              consentAgreed
                ? "border-emerald-500/80 bg-emerald-50/90 ring-2 ring-emerald-500/20"
                : "border-amber-400 bg-amber-50/95 ring-2 ring-amber-400/25"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <input
                id="consent-agreement-checkbox"
                type="checkbox"
                checked={consentAgreed}
                onChange={(e) => setConsentAgreed(e.target.checked)}
                className="mt-1 size-5 shrink-0 rounded-md border-2 border-amber-500 text-orange-600 focus:ring-orange-500 cursor-pointer accent-orange-600"
              />
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <label
                    htmlFor="consent-agreement-checkbox"
                    className="font-extrabold text-foreground text-sm sm:text-base cursor-pointer flex items-center gap-1.5"
                  >
                    <ShieldCheck className="size-4 text-orange-600 shrink-0" />
                    Persetujuan Penggunaan Data Calon Adik Asuh
                  </label>
                  <span className="rounded-full bg-red-100 text-red-700 px-2.5 py-0.5 text-[11px] font-bold border border-red-200">
                    Wajib Dicentang <span className="text-red-600 font-black">*</span>
                  </span>
                </div>
                <label
                  htmlFor="consent-agreement-checkbox"
                  className="block text-xs sm:text-sm font-medium leading-relaxed text-stone-800 cursor-pointer"
                >
                  Saya menyetujui bahwa data yang saya berikan akan digunakan untuk keperluan verifikasi dan penyaluran bantuan pendidikan oleh <strong>Vihara Vimala Dharma</strong>.
                </label>
                {!consentAgreed && (
                  <p className="text-[11px] font-semibold text-amber-800/90">
                    💡 Centang kotak persetujuan di atas untuk mengaktifkan tombol pendaftaran.
                  </p>
                )}
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* Tombol Aksi Bawah (Langkah 1 - 5) */}
      <div className="flex flex-col gap-3 rounded-3xl bg-white/85 p-4 shadow-sm backdrop-blur-md border border-white/80">
          {/* Pesan Error Validasi: Muncul tepat di dekat tombol aksi bawah */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-2xl bg-red-500/15 border border-red-500/30 p-4 text-sm font-medium text-destructive backdrop-blur-md shadow-sm animate-in fade-in"
            >
              <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

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
              disabled={pending || !consentAgreed}
              className={`h-14 rounded-2xl text-base font-bold text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                isEditMode
                  ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/25"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25"
              }`}
            >
              {pending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-5 animate-spin" />{" "}
                  {isEditMode ? "Sedang Mengirim Perbaikan..." : "Sedang Mendaftarkan..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Check className="size-5" /> {isEditMode ? "Kirim Perbaikan" : "Selesaikan Pendaftaran"}
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
              render={
                <Link href={isEditMode ? "/cek-status" : "/"}>
                  {isEditMode ? "Batal & Cek Status" : "Batal & Kembali ke Beranda"}
                </Link>
              }
              className="h-12 rounded-2xl text-sm font-semibold text-muted-foreground hover:text-foreground"
            />
          )}
        </div>
    </div>
  )
}

export function renderLabelWithAsterisk(label: string) {
  if (!label.includes("*")) return label

  const parts = label.split("*")
  return (
    <span>
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 && (
            <span className="text-red-500 font-extrabold ml-0.5 select-none" aria-hidden="true">
              *
            </span>
          )}
        </span>
      ))}
    </span>
  )
}

function Section({
  title,
  note,
  children,
}: {
  title: string
  note: string | React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-5 rounded-3xl bg-white/90 p-5 sm:p-6 shadow-md backdrop-blur-md border border-white/80">
      <div className="flex flex-col gap-1 border-b border-border/60 pb-3">
        <h2 className="text-xl font-extrabold text-foreground">{title}</h2>
        <div className="text-xs leading-relaxed text-muted-foreground sm:text-sm">{note}</div>
      </div>
      {children}
    </section>
  )
}

function Field({ label, children }: { label: string | React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="font-bold text-foreground text-sm">
        {typeof label === "string" ? renderLabelWithAsterisk(label) : label}
      </Label>
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

function FamilyAccordionSection({
  title,
  subtitle,
  value,
  onChange,
  isOpen,
  onToggle,
  isOptional = false,
}: {
  title: string
  subtitle?: string
  value: Family
  onChange: (v: Family) => void
  isOpen: boolean
  onToggle: () => void
  isOptional?: boolean
}) {
  const setVal = (p: Partial<Family>) => onChange({ ...value, ...p })
  const isDeceased = value.status === "Meninggal Dunia"
  const isCompleted = Boolean(value.name.trim())

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
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-white/85 shadow-sm transition-all">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 text-left hover:bg-orange-50/40 transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs transition-colors ${
              isCompleted
                ? "bg-emerald-100 text-emerald-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {isCompleted ? <Check className="size-4 stroke-[3]" /> : <User className="size-4" />}
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-foreground text-sm truncate">{title}</h3>
              {isOptional && (
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  Opsional
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {isCompleted ? (
                <span className="font-medium text-foreground">
                  {value.name} ({value.status})
                </span>
              ) : (
                subtitle || "Klik untuk mengisi data"
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 pl-2">
          {isCompleted ? (
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              <span>Terisi</span>
            </span>
          ) : (
            <span className="hidden sm:inline-block text-xs font-medium text-muted-foreground">
              {isOptional ? "Belum diisi" : "Belum diisi"}
            </span>
          )}

          <div
            className={`flex size-7 items-center justify-center rounded-lg bg-stone-100 text-stone-600 transition-transform duration-200 ${
              isOpen ? "rotate-180 bg-orange-100 text-orange-700" : ""
            }`}
          >
            <ChevronDown className="size-4" />
          </div>
        </div>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="border-t border-border/60 p-4 space-y-4 bg-white/95 animate-in fade-in slide-in-from-top-2 duration-200">
          <Field label="Nama Lengkap">
            <Input
              value={value.name}
              onChange={(e) => setVal({ name: e.target.value })}
              placeholder={`Isi nama lengkap ${title.toLowerCase()}`}
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
              placeholder={isDeceased ? "Tidak berlaku (Meninggal Dunia)" : "Contoh: Petani, Wiraswasta, Buruh"}
              className="h-12 rounded-xl bg-white text-sm shadow-sm disabled:bg-muted/60 disabled:text-muted-foreground disabled:cursor-not-allowed"
            />
          </Field>
          <Field label="Penghasilan per Bulan">
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
              placeholder={isDeceased ? "Tidak berlaku" : "Nomor WhatsApp / HP aktif"}
              className="h-12 rounded-xl bg-white text-sm shadow-sm disabled:bg-muted/60 disabled:text-muted-foreground disabled:cursor-not-allowed"
            />
          </Field>
          <Field label="Alamat Domisili">
            <Textarea
              disabled={isDeceased}
              value={isDeceased ? "-" : value.address}
              onChange={(e) => setVal({ address: e.target.value })}
              placeholder={isDeceased ? "Tidak berlaku" : "Kota atau alamat tempat tinggal saat ini"}
              className="min-h-16 rounded-xl bg-white text-sm shadow-sm disabled:bg-muted/60 disabled:text-muted-foreground disabled:cursor-not-allowed"
            />
          </Field>
          <Field label='Riwayat Penyakit (isi dengan " - " bila tidak ada)'>
            <Textarea
              disabled={isDeceased}
              value={isDeceased ? "-" : value.medicalHistory}
              onChange={(e) => setVal({ medicalHistory: e.target.value })}
              placeholder={isDeceased ? "Tidak berlaku" : 'Isi " - " jika tidak ada riwayat penyakit berat'}
              className="min-h-16 rounded-xl bg-white text-sm shadow-sm disabled:bg-muted/60 disabled:text-muted-foreground disabled:cursor-not-allowed"
            />
          </Field>
        </div>
      )}
    </div>
  )
}
