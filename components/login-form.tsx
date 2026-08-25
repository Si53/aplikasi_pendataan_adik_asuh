"use client"

import { useActionState, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { loginAction, loginPengawasAction, type LoginState } from "@/app/actions/auth"
import {
  AlertCircle,
  ShieldCheck,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Loader2,
} from "lucide-react"

const initialState: LoginState = {}

export function LoginForm() {
  const [role, setRole] = useState<"student" | "pengawas">("student")
  const [showPassword, setShowPassword] = useState(false)

  const [studentState, studentFormAction, studentPending] = useActionState(loginAction, initialState)
  const [pengawasState, pengawasFormAction, pengawasPending] = useActionState(loginPengawasAction, initialState)

  return (
    <div className="flex w-full flex-col items-center gap-6">
      {/* CARD UTAMA (PUTIH / KREAM DENGAN BORDER ROUNDED BESAR & OVERFLOW HIDDEN) */}
      <div className="w-full overflow-hidden rounded-3xl border border-orange-100/90 bg-white/95 shadow-xl backdrop-blur-md">
        {role === "student" ? (
          /* ============================================================ */
          /* === LOGIN ADIK ASUH (TAMPILAN UTAMA) ======================= */
          /* ============================================================ */
          <>
            {/* Header Oranye Solid di Atas Card */}
            <div className="flex items-center justify-between bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 px-6 py-3.5 text-white shadow-sm">
              {/* Avatar Anak Laki-laki di Kiri */}
              <div
                className="flex size-9 items-center justify-center rounded-full bg-white/30 text-base shadow-inner border border-white/60"
                aria-label="Avatar Anak Laki-laki"
              >
                👦
              </div>

              {/* Judul di Tengah */}
              <h2 className="text-xl font-black tracking-wide drop-shadow-sm">
                Adik Asuh
              </h2>

              {/* Avatar Anak Perempuan di Kanan */}
              <div
                className="flex size-9 items-center justify-center rounded-full bg-white/30 text-base shadow-inner border border-white/60"
                aria-label="Avatar Anak Perempuan"
              >
                👧
              </div>
            </div>

            {/* Isi Konten Card */}
            <div className="flex flex-col gap-5 p-6 sm:p-7">
              {/* Gambar Ilustrasi Anak & Roda Dharma di Tengah Card */}
              <div className="relative mx-auto size-44 sm:size-52 overflow-hidden rounded-2xl">
                <Image
                  src="/illustrasi-anak-roda-dharma.png"
                  alt="Ilustrasi Anak Adik Asuh PVVD"
                  fill
                  priority
                  sizes="(max-width: 640px) 176px, 208px"
                  className="object-contain"
                />
              </div>

              {/* Form Input Adik Asuh */}
              <form action={studentFormAction} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="identifier" className="text-xs font-bold text-orange-950/80">
                    Username atau NIK
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-orange-500" />
                    <input
                      id="identifier"
                      name="identifier"
                      autoComplete="username"
                      autoCapitalize="none"
                      spellCheck={false}
                      placeholder="Ketik username atau NIK"
                      className="h-14 w-full rounded-full border border-orange-200/80 bg-orange-50/40 pl-12 pr-4 text-base font-medium text-foreground shadow-sm placeholder:text-muted-foreground focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      required
                    />
                  </div>
                </div>

                {/* Pesan Error */}
                {studentState.error && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-2xl bg-destructive/10 border border-destructive/20 p-3.5 text-sm font-medium leading-relaxed text-destructive"
                  >
                    <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span>{studentState.error}</span>
                  </div>
                )}

                {/* Tombol Masuk Oranye Solid Pill-Shape */}
                <button
                  type="submit"
                  disabled={studentPending}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 px-6 text-base font-extrabold text-white shadow-lg shadow-orange-500/25 transition duration-200 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {studentPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="size-5 animate-spin" /> Sedang Masuk...
                    </span>
                  ) : (
                    <span>Masuk</span>
                  )}
                </button>

                {/* Link Daftar di Bawah */}
                <p className="mt-1 text-center text-sm text-muted-foreground">
                  Belum punya akun?{" "}
                  <Link
                    href="/daftar"
                    className="font-extrabold text-orange-600 underline-offset-4 hover:underline"
                  >
                    Daftar di sini
                  </Link>
                </p>
              </form>
            </div>
          </>
        ) : (
          /* ============================================================ */
          /* === LOGIN PENGAWAS ========================================= */
          /* ============================================================ */
          <>
            {/* Header Oranye Solid Login Pengawas */}
            <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 px-6 py-4 text-white shadow-sm">
              <ShieldCheck className="size-6" />
              <h2 className="text-xl font-black tracking-wide drop-shadow-sm">
                Login Pengawas
              </h2>
            </div>

            {/* Isi Konten Card Pengawas */}
            <div className="flex flex-col gap-5 p-6 sm:p-7">
              {/* Badge/Icon Pengawas Wilayah di Tengah Card */}
              <div className="flex flex-col items-center text-center gap-2 my-1">
                <div className="flex size-20 items-center justify-center rounded-3xl bg-orange-100/80 border-2 border-orange-200 text-orange-600 shadow-inner">
                  <Shield className="size-10" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-foreground">
                    Portal Pengawas Wilayah
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Masuk menggunakan akun petugas pengawas Anda
                  </p>
                </div>
              </div>

              {/* Form Input Pengawas */}
              <form action={pengawasFormAction} className="flex flex-col gap-4">
                {/* Field 1: Username */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="pengawas-username" className="text-xs font-bold text-orange-950/80">
                    Username
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-orange-500" />
                    <input
                      id="pengawas-username"
                      name="username"
                      autoComplete="username"
                      autoCapitalize="none"
                      spellCheck={false}
                      placeholder="Ketik username pengawas"
                      className="h-14 w-full rounded-full border border-orange-200/80 bg-orange-50/40 pl-12 pr-4 text-base font-medium text-foreground shadow-sm placeholder:text-muted-foreground focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      required
                    />
                  </div>
                </div>

                {/* Field 2: Password dengan toggle Show/Hide */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="pengawas-password" className="text-xs font-bold text-orange-950/80">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-orange-500" />
                    <input
                      id="pengawas-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Ketik password"
                      className="h-14 w-full rounded-full border border-orange-200/80 bg-orange-50/40 pl-12 pr-12 text-base font-medium text-foreground shadow-sm placeholder:text-muted-foreground focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-1"
                      aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* Pesan Error Pengawas */}
                {pengawasState.error && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-2xl bg-destructive/10 border border-destructive/20 p-3.5 text-sm font-medium leading-relaxed text-destructive"
                  >
                    <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span>{pengawasState.error}</span>
                  </div>
                )}

                {/* Tombol Masuk Pengawas Oranye Solid Pill-Shape */}
                <button
                  type="submit"
                  disabled={pengawasPending}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 px-6 text-base font-extrabold text-white shadow-lg shadow-orange-500/25 transition duration-200 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {pengawasPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="size-5 animate-spin" /> Memverifikasi...
                    </span>
                  ) : (
                    <span>Masuk sebagai Pengawas</span>
                  )}
                </button>

                {/* Link Kembali ke Login Adik Asuh */}
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className="text-xs font-bold text-orange-700 hover:text-orange-900 transition hover:underline cursor-pointer"
                  >
                    ← Kembali ke Login Adik Asuh
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>

      {/* DI LUAR CARD, DI BAWAHNYA: Toggle Masuk sebagai Pengawas (Hanya tampil saat di mode Adik Asuh) */}
      {role === "student" && (
        <div className="flex flex-col items-center gap-1.5 text-center">
          <p className="text-xs font-medium text-orange-950/70">
            Petugas / Pengawas Lapangan?
          </p>
          <button
            type="button"
            onClick={() => setRole("pengawas")}
            className="flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-2 text-xs font-extrabold text-orange-800 shadow-sm border border-orange-200/80 backdrop-blur-sm transition duration-200 hover:bg-white hover:border-orange-300 active:scale-95 cursor-pointer"
          >
            <Shield className="size-3.5 text-orange-600" />
            <span>Masuk sebagai Pengawas</span>
          </button>
        </div>
      )}
    </div>
  )
}
