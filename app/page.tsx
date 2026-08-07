import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart, LogIn, UserPlus } from "lucide-react"

export default function LandingPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-between px-5 py-8">
      <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 text-center">
        <div className="flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground">
          <Heart className="size-4" aria-hidden="true" />
          Vihara Vimala Dharma
        </div>

        <div className="relative aspect-square w-full max-w-[280px] overflow-hidden rounded-3xl bg-secondary">
          <Image
            src="/adik-asuh-illustration.png"
            alt="Ilustrasi anak-anak sekolah yang ceria sedang belajar bersama"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 480px) 100vw, 280px"
          />
        </div>

        <div className="space-y-3">
          <h1 className="text-balance text-3xl font-extrabold leading-tight text-foreground">
            Adik Asuh Vihara Vimala Dharma
          </h1>
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            Selamat datang! Yuk daftar menjadi adik asuh, atau masuk kalau kamu
            sudah punya akun.
          </p>
        </div>
      </div>

      <div className="flex w-full max-w-md flex-col gap-3">
        <Button
          size="lg"
          nativeButton={false}
          className="h-14 rounded-2xl text-lg font-bold"
          render={
            <Link href="/login">
              <LogIn className="size-5" aria-hidden="true" />
              Login
            </Link>
          }
        />
        <Button
          size="lg"
          variant="secondary"
          nativeButton={false}
          className="h-14 rounded-2xl text-lg font-bold"
          render={
            <Link href="/daftar">
              <UserPlus className="size-5" aria-hidden="true" />
              Daftar
            </Link>
          }
        />
      </div>
    </main>
  )
}
