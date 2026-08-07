import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PartyPopper, LogIn } from "lucide-react"

export default function SuksesPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-between px-5 py-8">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div className="flex size-24 items-center justify-center rounded-full bg-accent">
          <PartyPopper className="size-12 text-primary" aria-hidden="true" />
        </div>
        <div className="space-y-3">
          <h1 className="text-balance text-3xl font-extrabold leading-tight text-foreground">
            Selamat!
          </h1>
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            Kamu telah menjadi adik asuh baru. Silakan login menggunakan
            username kamu.
          </p>
        </div>
      </div>

      <Button
        size="lg"
        nativeButton={false}
        className="h-14 w-full rounded-2xl text-lg font-bold"
        render={
          <Link href="/login">
            <LogIn className="size-5" aria-hidden="true" />
            Ke Halaman Login
          </Link>
        }
      />
    </main>
  )
}
