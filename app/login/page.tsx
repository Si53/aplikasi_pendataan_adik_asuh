import Link from "next/link"
import { auth } from "@/auth"
import { logoutAction } from "@/app/actions/auth"
import { PageHeader } from "@/components/page-header"
import { LoginForm } from "@/components/login-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LogOut, ArrowRight, UserCheck, ShieldCheck, ArrowLeft } from "lucide-react"

export default async function LoginPage() {
  const session = await auth()

  return (
    <div className="relative min-h-dvh w-full flex flex-col justify-between">
      {/* 1. Background: Gradient Cream/Peach dengan Motif Lotus dan Awan/Roda Dharma Oriental */}
      <div
        className="fixed inset-0 -z-10 bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-amber-100/60 pointer-events-none"
        aria-hidden="true"
      >
        <svg
          className="h-full w-full opacity-10 text-orange-600 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="login-lotus-cloud-pattern"
              width="140"
              height="140"
              patternUnits="userSpaceOnUse"
            >
              {/* Oriental Cloud Swirl */}
              <g transform="translate(25, 25) scale(0.6)">
                <path d="M10,20 C10,12 18,6 26,6 C32,6 38,9 41,14 C44,11 48,9 53,9 C61,9 67,15 67,23 C67,24 67,25 66,26 C69,26 72,29 72,32 C72,36 69,39 65,39 L12,39 C6,39 1,34 1,28 C1,23 5,19 10,20 Z" />
              </g>

              {/* Dharmachakra */}
              <g transform="translate(40, 95) scale(0.8)">
                <circle cx="0" cy="0" r="14" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="0" cy="0" r="4.5" fill="currentColor" />
                <line x1="0" y1="-14" x2="0" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="-14" y1="0" x2="14" y2="0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="-10" y1="-10" x2="10" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="-10" y1="10" x2="10" y2="-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* Bunga Teratai (Lotus) */}
              <g transform="translate(105, 70) scale(0.9)">
                <path d="M0,6 C-3.5,-1 -3.5,-11 0,-15 C3.5,-11 3.5,-1 0,6" />
                <path d="M-1.5,5 C-8,1 -11,-7 -8,-12 C-5,-13 -2.5,-6 -1.5,5" />
                <path d="M1.5,5 C8,1 11,-7 8,-12 C5,-13 2.5,-6 1.5,5" />
                <path d="M-3,6 C-12,4 -15,-1 -13,-6 C-9,-7 -5,-1 -3,6" />
                <path d="M3,6 C12,4 15,-1 13,-6 C9,-7 5,-1 3,6" />
                <path d="M-7,7 Q0,11 7,7 Q0,9 -7,7" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#login-lotus-cloud-pattern)" />
        </svg>
      </div>

      {/* Header Navigasi Kembali */}
      <div className="mx-auto w-full max-w-md px-5 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-2 text-xs font-bold text-orange-950 shadow-sm border border-orange-200/60 backdrop-blur-md transition hover:bg-white"
        >
          <ArrowLeft className="size-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-6">
        {/* Banner Jika User Sudah Login */}
        {session?.user && (
          <div className="mb-6 w-full rounded-3xl border border-orange-200/80 bg-white/90 p-4 shadow-md backdrop-blur-md animate-in fade-in">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-600">
                {session.user.role === "PENGAWAS" ? (
                  <ShieldCheck className="size-4" />
                ) : (
                  <UserCheck className="size-4" />
                )}
                <span>
                  Sedang Masuk sebagai {session.user.role === "PENGAWAS" ? "Pengawas" : "Adik Asuh"}
                </span>
              </div>
              <div>
                <p className="text-base font-extrabold text-foreground">{session.user.name}</p>
                <p className="text-xs text-muted-foreground">Username: {session.user.username}</p>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Link
                  href={session.user.role === "PENGAWAS" ? "/pengawas" : "/dashboard"}
                  className="flex flex-1 items-center justify-center gap-1 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 py-2 text-xs font-bold text-white shadow-sm hover:from-orange-600 hover:to-amber-600"
                >
                  <span>Buka Dashboard</span>
                  <ArrowRight className="size-3.5" />
                </Link>
                <form action={logoutAction} className="shrink-0">
                  <button
                    type="submit"
                    className="flex items-center gap-1 rounded-2xl border border-border bg-white px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="size-3.5" />
                    <span>Keluar</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Form Login Utama */}
        <LoginForm />
      </main>

      {/* Footer Hak Cipta */}
      <footer className="py-4 text-center text-xs text-muted-foreground">
        <p>© 2026 Adik Asuh Vihara Vimala Dharma</p>
      </footer>
    </div>
  )
}
