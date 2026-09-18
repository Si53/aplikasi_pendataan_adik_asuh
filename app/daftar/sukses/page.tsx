import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle2, Home, LogIn, User } from "lucide-react"

export default async function SuksesPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; username?: string }>
}) {
  const params = await searchParams
  const name = params?.name ? decodeURIComponent(params.name) : ""
  const username = params?.username ? decodeURIComponent(params.username) : ""

  return (
    <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-lg flex-col items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full flex flex-col items-center gap-6 rounded-3xl bg-white/95 p-6 sm:p-8 shadow-xl backdrop-blur-md border border-orange-100/90 text-center animate-in fade-in zoom-in-95 duration-300">
        {/* Ikon / Ilustrasi Menunggu Ramah & Ceria */}
        <div className="relative">
          <div className="flex size-24 sm:size-28 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-100 via-orange-100 to-amber-50 text-amber-600 shadow-inner border-2 border-amber-200/80">
            <Clock className="size-12 sm:size-14 text-amber-600 stroke-[2.2] animate-pulse" />
          </div>
          <div className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md border-2 border-white">
            <CheckCircle2 className="size-5 stroke-[2.5]" />
          </div>
        </div>

        {/* Judul & Status Badge */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/90 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-amber-900 border border-amber-300 shadow-xs">
            <Clock className="size-3.5 text-amber-700" />
            <span>Menunggu Konfirmasi dari Kakak Asuh</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Pendaftaran Kamu Berhasil Dikirim!
          </h1>

          <p className="text-sm sm:text-base leading-relaxed text-stone-600 max-w-md mx-auto">
            Data kamu sedang diperiksa oleh <strong>Kakak Asuh</strong>. Kamu akan bisa masuk ke akun setelah pendaftaran kamu disetujui. Proses ini biasanya memakan waktu beberapa hari.
          </p>
        </div>

        {/* Ringkasan Singkat Data Terdaftar */}
        {(name || username) && (
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
              {name && (
                <div>
                  <p className="text-muted-foreground text-[11px] font-medium">Nama Lengkap</p>
                  <p className="font-bold text-foreground truncate">{name}</p>
                </div>
              )}
              {username && (
                <div>
                  <p className="text-muted-foreground text-[11px] font-medium">Username</p>
                  <p className="font-bold text-foreground truncate">@{username}</p>
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
            size="lg"
            variant="ghost"
            nativeButton={false}
            className="h-12 w-full rounded-2xl text-sm font-bold text-stone-600 hover:text-foreground hover:bg-stone-100 cursor-pointer"
            render={
              <Link href="/login" className="flex items-center justify-center gap-2">
                <LogIn className="size-4" />
                <span>Halaman Masuk (Login)</span>
              </Link>
            }
          />
        </div>
      </div>
    </main>
  )
}
