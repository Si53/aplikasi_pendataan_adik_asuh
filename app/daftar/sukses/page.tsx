import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PartyPopper, LogIn } from "lucide-react"

export default function SuksesPage() {
  return (
    <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-between px-4 py-8">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center w-full">
        <div className="w-full rounded-3xl bg-white/95 p-8 shadow-xl backdrop-blur-md border border-orange-100/80 flex flex-col items-center gap-5">
          <div className="flex size-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
            <PartyPopper className="size-12" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h1 className="text-balance text-3xl font-black text-foreground">
              Selamat!
            </h1>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground">
              Pendaftaranmu telah berhasil. Silakan masuk ke aplikasi menggunakan username atau NIK yang telah didaftarkan.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full pt-4">
        <Button
          size="lg"
          nativeButton={false}
          className="h-14 w-full rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 text-lg font-bold text-white shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600"
          render={
            <Link href="/login" className="flex items-center justify-center gap-2">
              <LogIn className="size-5" aria-hidden="true" />
              <span>Ke Halaman Login</span>
            </Link>
          }
        />
      </div>
    </main>
  )
}
