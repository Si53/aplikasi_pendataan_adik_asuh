"use client"

import { useState } from "react"
import Image from "next/image"
import {
  FileText,
  Home,
  MessageCircle,
  UserRound,
  ExternalLink,
  Download,
  MapPin,
  Sparkles,
} from "lucide-react"

export type StudentData = {
  id: number
  fullName: string
  nik: string
  gender: string
  dateOfBirth: string
  alamatLengkap: string
  noHp: string
  schoolName: string
  gradeLevel: string
  nilaiRataRata: string
  citaCita: string
  wilayah: string
  riwayatPenyakit: string
  jumlahSaudara: number
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
  documents: { id: number; type: string; fileUrl: string }[]
}

export function StudentDashboard({ student }: { student: StudentData }) {
  const [activeTab, setActiveTab] = useState<"beranda" | "profil" | "dokumen">("beranda")

  const totalCost = student.educationCosts.reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="flex flex-col gap-6">
      {/* ============================================================ */}
      {/* 1. KONTEN TAB BERANDA ====================================== */}
      {/* ============================================================ */}
      {activeTab === "beranda" && (
        <section className="flex flex-col gap-5 animate-in fade-in duration-200">
          {/* Kartu "Selamat Datang" dengan Gambar Ilustrasi Biksu & Anak */}
          <div className="flex flex-col md:flex-row items-center gap-6 rounded-3xl bg-white/95 p-6 shadow-xl backdrop-blur-md border border-orange-100/90">
            {/* Sisi Kiri: Gambar Ilustrasi */}
            <div className="relative w-full max-w-[200px] h-[260px] shrink-0 overflow-hidden rounded-2xl shadow-sm border border-orange-100/80 bg-amber-50">
              <Image
                src="/illustrasi-biksu-anak.png"
                alt="Ilustrasi Biksu dan Anak"
                fill
                priority
                sizes="(max-width: 768px) 200px, 220px"
                className="object-cover"
              />
            </div>

            {/* Sisi Kanan: Teks Sambutan & Info Pengawas */}
            <div className="flex flex-1 flex-col justify-center text-center md:text-left gap-3 w-full">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800">
                  <Sparkles className="size-3" /> Program Bantuan Dana Pendidikan
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  Selamat datang di Program Adik Asuh!
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground font-medium">
                  Bersama Vihara Vimala Dharma, raih cita-cita setinggi mungkin melalui
                  pendidikan yang berkelanjutan.
                </p>
              </div>

              {/* Info Pengawas Pendamping Asli dari Relasi Database */}
              <div className="rounded-2xl bg-orange-50/80 p-4 border border-orange-200/80 text-left">
                <span className="text-xs font-bold text-orange-900 block">
                  Pengawas Pendamping Wilayah {student.wilayah}:
                </span>
                <p className="mt-1 text-base sm:text-lg font-extrabold text-orange-600 flex items-center gap-1.5">
                  <MapPin className="size-4 shrink-0 text-orange-500" />
                  <span>{student.pengawasName}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Tombol Hijau Besar Full-Width (WhatsApp) */}
          <a
            href="https://wa.me/6282129741793"
            target="_blank"
            rel="noreferrer"
            className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 hover:from-emerald-700 hover:to-green-600 px-6 text-base font-extrabold text-white shadow-lg shadow-emerald-600/25 active:scale-[0.98] transition duration-200 cursor-pointer"
          >
            <MessageCircle className="size-5" />
            <span>Hubungi Kakak Asuh (WhatsApp)</span>
          </a>
        </section>
      )}

      {/* ============================================================ */}
      {/* 2. KONTEN TAB PROFIL SAYA ================================== */}
      {/* ============================================================ */}
      {activeTab === "profil" && (
        <section className="flex flex-col gap-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-l-4 border-orange-500 pl-3">
            <div>
              <h2 className="text-xl font-black text-foreground">Profil Saya</h2>
              <span className="text-xs text-muted-foreground">Informasi pribadi dan data pendaftaran</span>
            </div>
          </div>

          {/* Data Pribadi & Kontak */}
          <div className="rounded-3xl bg-white/90 p-5 sm:p-6 shadow-md backdrop-blur-md border border-orange-100/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <Info label="Nomor Induk Kependudukan (NIK)" value={student.nik} />
              <Info label="Tanggal Lahir" value={student.dateOfBirth} />
              <Info label="Jenis Kelamin" value={student.gender} />
              <Info label="Cita-cita" value={student.citaCita} />
              <Info label="Sekolah / Universitas" value={student.schoolName} />
              <Info label="Kelas / Tingkat" value={student.gradeLevel} />
              <Info label="Nilai Rata-rata / IPK" value={student.nilaiRataRata} />
              <Info label="Nomor WhatsApp" value={student.noHp} />
              <Info label="Wilayah" value={student.wilayah} />
              <Info label="Jumlah Saudara" value={`${student.jumlahSaudara} orang`} />
              <div className="sm:col-span-2">
                <Info label="Alamat Lengkap" value={student.alamatLengkap} />
              </div>
              <div className="sm:col-span-2">
                <Info label="Riwayat Penyakit" value={student.riwayatPenyakit} />
              </div>
            </div>
          </div>

          {/* Rincian Biaya Pendidikan */}
          {student.educationCosts.length > 0 && (
            <div className="rounded-3xl bg-white/90 p-5 sm:p-6 shadow-md backdrop-blur-md border border-orange-100/80 flex flex-col gap-3">
              <h3 className="text-base font-bold text-foreground">Rincian Kebutuhan Biaya</h3>
              <div className="flex flex-col divide-y divide-border/60 text-sm">
                {student.educationCosts.map((cost) => (
                  <div key={cost.id} className="flex justify-between py-2">
                    <span className="text-muted-foreground">{cost.label}</span>
                    <span className="font-bold text-foreground">
                      Rp {cost.amount.toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
                <div className="mt-1 flex justify-between pt-2 text-base font-extrabold text-orange-600">
                  <span>Total Estimasi Biaya</span>
                  <span>Rp {totalCost.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ============================================================ */}
      {/* 3. KONTEN TAB DOKUMEN SAYA ================================= */}
      {/* ============================================================ */}
      {activeTab === "dokumen" && (
        <section className="flex flex-col gap-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-l-4 border-orange-500 pl-3">
            <div>
              <h2 className="text-xl font-black text-foreground">Dokumen Saya</h2>
              <span className="text-xs text-muted-foreground">Berkas persyaratan yang telah diunggah</span>
            </div>
          </div>

          <div className="rounded-3xl bg-white/90 p-5 sm:p-6 shadow-md backdrop-blur-md border border-orange-100/80">
            <div className="flex flex-col gap-3">
              {student.documents.length ? (
                student.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-orange-50/60 p-4 border border-orange-200/60 transition hover:bg-orange-50/90"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {doc.type === "FOTO_ANAK" && doc.fileUrl ? (
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border-2 border-orange-300 bg-amber-100 shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={doc.fileUrl}
                            alt="Foto Anak"
                            className="size-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-600 shadow-sm border border-orange-200/60">
                          <FileText className="size-6" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-extrabold text-sm text-foreground truncate">
                          {doc.type === "FOTO_ANAK"
                            ? "Foto Anak"
                            : doc.type === "RAPOR"
                            ? "Rapor Terakhir"
                            : "Kartu Keluarga (KK)"}
                        </p>
                        <span className="text-[11px] font-semibold text-orange-700 block">
                          Tipe: {doc.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-orange-950 shadow-sm border border-orange-200 hover:bg-orange-100/60 hover:text-orange-900 transition"
                      >
                        <ExternalLink className="size-3.5" />
                        <span>Buka / Lihat</span>
                      </a>
                      <a
                        href={doc.fileUrl}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs font-bold text-white shadow-sm hover:from-orange-600 hover:to-amber-600 transition"
                      >
                        <Download className="size-3.5" />
                        <span>Unduh</span>
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-orange-200 p-6 text-center text-sm text-muted-foreground">
                  Belum ada dokumen yang diunggah.
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 4. BOTTOM NAVIGATION BAR DENGAN WARNA & HALO AKTIF ========= */}
      {/* ============================================================ */}
      <nav
        aria-label="Navigasi Bawah Dashboard"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-orange-200/80 shadow-2xl px-4 py-2 max-w-lg mx-auto sm:rounded-t-3xl"
      >
        <div className="flex items-center justify-around">
          {/* Menu 1: Beranda */}
          <button
            type="button"
            onClick={() => setActiveTab("beranda")}
            className={`flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-2xl transition-all duration-200 cursor-pointer ${
              activeTab === "beranda"
                ? "text-orange-600 font-extrabold bg-orange-100/90 shadow-sm border border-orange-200/60"
                : "text-muted-foreground hover:text-foreground font-medium hover:bg-orange-50/50"
            }`}
          >
            <div className={`transition-transform duration-200 ${activeTab === "beranda" ? "scale-110" : ""}`}>
              <Home className="size-5" />
            </div>
            <span className="text-[11px]">Beranda</span>
          </button>

          {/* Menu 2: Profil */}
          <button
            type="button"
            onClick={() => setActiveTab("profil")}
            className={`flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-2xl transition-all duration-200 cursor-pointer ${
              activeTab === "profil"
                ? "text-orange-600 font-extrabold bg-orange-100/90 shadow-sm border border-orange-200/60"
                : "text-muted-foreground hover:text-foreground font-medium hover:bg-orange-50/50"
            }`}
          >
            <div className={`transition-transform duration-200 ${activeTab === "profil" ? "scale-110" : ""}`}>
              <UserRound className="size-5" />
            </div>
            <span className="text-[11px]">Profil</span>
          </button>

          {/* Menu 3: Dokumen */}
          <button
            type="button"
            onClick={() => setActiveTab("dokumen")}
            className={`flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-2xl transition-all duration-200 cursor-pointer ${
              activeTab === "dokumen"
                ? "text-orange-600 font-extrabold bg-orange-100/90 shadow-sm border border-orange-200/60"
                : "text-muted-foreground hover:text-foreground font-medium hover:bg-orange-50/50"
            }`}
          >
            <div className={`transition-transform duration-200 ${activeTab === "dokumen" ? "scale-110" : ""}`}>
              <FileText className="size-5" />
            </div>
            <span className="text-[11px]">Dokumen</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-orange-50/50 p-3.5 border border-orange-100/60">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-bold text-foreground">{value || "-"}</p>
    </div>
  )
}
