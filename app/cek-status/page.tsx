"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  checkRegistrationStatusAction,
  type CheckStatusResult,
} from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogIn,
  Home,
  User,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react"

export default function CekStatusPage() {
  const [identifier, setIdentifier] = useState("")
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<CheckStatusResult | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim()) return

    startTransition(async () => {
      const res = await checkRegistrationStatusAction(identifier)
      setResult(res)
    })
  }

  const handleReset = () => {
    setResult(null)
    setIdentifier("")
  }

  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-[#faf3e8]">
      {/* Background fixed fullscreen */}
      <div className="fixed inset-0 z-0 h-full w-full overflow-hidden pointer-events-none">
        <Image
          src="/bg-wizard-pendaftaran.png"
          alt="Background Pendaftaran"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-lg flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full overflow-hidden rounded-3xl bg-white/95 p-6 sm:p-8 shadow-xl backdrop-blur-md border border-orange-100/90 text-center animate-in fade-in zoom-in-95 duration-200">
          
          {/* STATE 1: FORM PENCARIAN & KONDISI NOT FOUND */}
          {(!result || !result.found) && (
            <div className="flex flex-col items-center gap-6">
              {/* Header Icon */}
              <div className="flex size-20 sm:size-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-100 via-orange-100 to-amber-50 text-orange-600 shadow-inner border-2 border-orange-200/80">
                <Search className="size-10 sm:size-12 stroke-[2.2]" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                  Cek Status Pendaftaran
                </h1>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground max-w-md mx-auto">
                  Ketik <strong>Username</strong> atau <strong>16 digit NIK</strong> yang kamu gunakan saat mendaftar untuk melihat perkembangan status pendaftaranmu.
                </p>
              </div>

              {/* Form Input Identifier */}
              <form onSubmit={handleSearch} className="w-full space-y-4 text-left">
                <div className="space-y-1.5">
                  <label htmlFor="check-identifier" className="text-xs font-bold text-orange-950/80">
                    Username atau NIK kamu
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-orange-500" />
                    <Input
                      id="check-identifier"
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Ketik username atau NIK"
                      className="h-14 w-full rounded-2xl border-orange-200/80 bg-orange-50/40 pl-12 pr-4 text-base font-medium shadow-sm focus:border-orange-500 focus:bg-white"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                {/* Error jika data tidak ditemukan */}
                {result && !result.found && result.error && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-sm font-medium leading-relaxed text-destructive animate-in fade-in"
                  >
                    <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                    <div className="space-y-1">
                      <p>{result.error}</p>
                      <p className="text-xs text-stone-600">
                        Belum pernah mendaftar?{" "}
                        <Link href="/daftar" className="font-bold text-orange-600 underline hover:text-orange-700">
                          Daftar akun di sini
                        </Link>
                      </p>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={pending || !identifier.trim()}
                  className="h-14 w-full rounded-2xl bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 text-base font-extrabold text-white shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 cursor-pointer disabled:opacity-60"
                >
                  {pending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="size-5 animate-spin" /> Sedang Memeriksa...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Search className="size-5" /> Cek Status Sekarang
                    </span>
                  )}
                </Button>
              </form>

              {/* Link Kembali ke Beranda */}
              <div className="pt-2">
                <Link
                  href="/"
                  className="text-xs sm:text-sm font-bold text-muted-foreground hover:text-foreground transition hover:underline"
                >
                  ← Kembali ke Halaman Utama
                </Link>
              </div>
            </div>
          )}

          {/* STATE 2: HASIL DITEMUKAN - STATUS "PENDING" (MENUNGGU KONFIRMASI) */}
          {result && result.found && result.status === "pending" && (
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="flex size-24 sm:size-28 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-100 via-orange-100 to-amber-50 text-amber-600 shadow-inner border-2 border-amber-200/80">
                  <Clock className="size-12 sm:size-14 text-amber-600 stroke-[2.2] animate-pulse" />
                </div>
                <div className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md border-2 border-white">
                  <CheckCircle2 className="size-5 stroke-[2.5]" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/90 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-amber-900 border border-amber-300 shadow-xs">
                  <Clock className="size-3.5 text-amber-700" />
                  <span>Menunggu Konfirmasi dari Kakak Asuh</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                  Pendaftaran Kamu Sedang Ditinjau!
                </h1>

                <p className="text-sm sm:text-base leading-relaxed text-stone-600 max-w-md mx-auto">
                  Data kamu sedang diperiksa oleh <strong>Kakak Asuh</strong>. Kamu akan bisa masuk ke akun setelah pendaftaran kamu disetujui. Proses ini biasanya memakan waktu beberapa hari.
                </p>
              </div>

              {/* Ringkasan Data Siswa */}
              {result.student && (
                <div className="w-full rounded-2xl bg-orange-50/70 border border-orange-200/80 p-4 text-left space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-orange-200/60 pb-2">
                    <span className="text-xs font-bold text-orange-950 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="size-3.5 text-orange-600" /> Ringkasan Data Siswa
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
                      <span className="size-1.5 rounded-full bg-amber-500 animate-ping" />
                      Sedang Ditinjau
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div>
                      <p className="text-muted-foreground text-[11px] font-medium">Nama Lengkap</p>
                      <p className="font-bold text-foreground truncate">{result.student.fullName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[11px] font-medium">Username</p>
                      <p className="font-bold text-foreground truncate">@{result.student.username}</p>
                    </div>
                    {result.student.schoolName && (
                      <div>
                        <p className="text-muted-foreground text-[11px] font-medium">Sekolah / Kampus</p>
                        <p className="font-semibold text-foreground truncate">{result.student.schoolName}</p>
                      </div>
                    )}
                    {result.student.wilayah && (
                      <div>
                        <p className="text-muted-foreground text-[11px] font-medium">Wilayah</p>
                        <p className="font-semibold text-foreground truncate">{result.student.wilayah}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tombol Aksi */}
              <div className="w-full space-y-2.5 pt-2">
                <Button
                  size="lg"
                  nativeButton={false}
                  className="h-14 w-full rounded-2xl bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 text-base font-extrabold text-white shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 cursor-pointer"
                  render={
                    <Link href="/" className="flex items-center justify-center gap-2">
                      <Home className="size-5" />
                      <span>Kembali ke Halaman Utama</span>
                    </Link>
                  }
                />

                <Button
                  type="button"
                  size="lg"
                  variant="ghost"
                  onClick={handleReset}
                  className="h-12 w-full rounded-2xl text-sm font-bold text-stone-600 hover:text-foreground hover:bg-stone-100 cursor-pointer"
                >
                  <RefreshCw className="size-4 mr-2" />
                  <span>Cek Data / Siswa Lain</span>
                </Button>
              </div>
            </div>
          )}

          {/* STATE 3: HASIL DITEMUKAN - STATUS "APPROVED" (SUDAH DISETUJUI) */}
          {result && result.found && result.status === "approved" && (
            <div className="flex flex-col items-center gap-6 animate-in fade-in">
              <div className="flex size-24 sm:size-28 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 shadow-inner border-2 border-emerald-200">
                <CheckCircle2 className="size-12 sm:size-14 stroke-[2.2]" />
              </div>

              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-emerald-800 border border-emerald-300 shadow-xs">
                  <Sparkles className="size-3.5 text-emerald-600" />
                  <span>Pendaftaran Disetujui</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                  Pendaftaran Kamu SUDAH DISETUJUI !
                </h1>

                <p className="text-sm sm:text-base leading-relaxed text-stone-600 max-w-md mx-auto">
                  Selamat! Akun kamu sudah aktif dan disetujui oleh <strong>Kakak Asuh</strong>. Silakan masuk menggunakan username atau NIK kamu.
                </p>
              </div>

              {/* Ringkasan Data Siswa */}
              {result.student && (
                <div className="w-full rounded-2xl bg-emerald-50/70 border border-emerald-200 p-4 text-left space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                    <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="size-3.5 text-emerald-600" /> Data Siswa
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="size-3.5 text-emerald-600" /> Aktif
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div>
                      <p className="text-muted-foreground text-[11px] font-medium">Nama Lengkap</p>
                      <p className="font-bold text-foreground truncate">{result.student.fullName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[11px] font-medium">Username</p>
                      <p className="font-bold text-foreground truncate">@{result.student.username}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tombol Masuk ke Login */}
              <div className="w-full space-y-2.5 pt-2">
                <Button
                  size="lg"
                  nativeButton={false}
                  className="h-14 w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-base font-extrabold text-white shadow-lg shadow-emerald-600/25 cursor-pointer"
                  render={
                    <Link href="/login" className="flex items-center justify-center gap-2">
                      <LogIn className="size-5" />
                      <span>Masuk ke Akun Sekarang</span>
                    </Link>
                  }
                />

                <Button
                  type="button"
                  size="lg"
                  variant="ghost"
                  onClick={handleReset}
                  className="h-12 w-full rounded-2xl text-sm font-bold text-stone-600 hover:text-foreground hover:bg-stone-100 cursor-pointer"
                >
                  <RefreshCw className="size-4 mr-2" />
                  <span>Cek Data / Siswa Lain</span>
                </Button>
              </div>
            </div>
          )}

          {/* STATE 4: HASIL DITEMUKAN - STATUS "REJECTED" ATAU "NONAKTIF" */}
          {result && result.found && result.status !== "pending" && result.status !== "approved" && (
            <div className="flex flex-col items-center gap-6 animate-in fade-in">
              <div className="flex size-24 sm:size-28 items-center justify-center rounded-3xl bg-amber-100 text-amber-700 shadow-inner border-2 border-amber-200">
                <AlertCircle className="size-12 sm:size-14 stroke-[2.2]" />
              </div>

              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-amber-900 border border-amber-300 shadow-xs">
                  <span>Informasi Pendaftaran</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                  {result.status === "rejected" ? "Pendaftaran Ditolak" : "Akun Sedang Dinonaktifkan"}
                </h1>

                <p className="text-sm sm:text-base leading-relaxed text-stone-600 max-w-md mx-auto">
                  {result.status === "rejected"
                    ? "Pendaftaran kamu belum bisa diterima. Silakan hubungi Kakak Asuh atau Pengawas untuk informasi lebih lanjut."
                    : "Akun kamu sedang dinonaktifkan. Silakan hubungi Kakak Asuh atau Pengawas untuk informasi lebih lanjut."}
                </p>
              </div>

              {/* Tombol Aksi */}
              <div className="w-full space-y-2.5 pt-2">
                <Button
                  size="lg"
                  nativeButton={false}
                  className="h-14 w-full rounded-2xl bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 text-base font-extrabold text-white shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 cursor-pointer"
                  render={
                    <Link href="/" className="flex items-center justify-center gap-2">
                      <Home className="size-5" />
                      <span>Kembali ke Halaman Utama</span>
                    </Link>
                  }
                />

                <Button
                  type="button"
                  size="lg"
                  variant="ghost"
                  onClick={handleReset}
                  className="h-12 w-full rounded-2xl text-sm font-bold text-stone-600 hover:text-foreground hover:bg-stone-100 cursor-pointer"
                >
                  <RefreshCw className="size-4 mr-2" />
                  <span>Cek Data / Siswa Lain</span>
                </Button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
