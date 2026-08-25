"use client"

import { useActionState, useState } from "react"
import Link from "next/link"
import { loginAction, loginPengawasAction, type LoginState } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, ShieldCheck, UserCheck, Lock, User } from "lucide-react"

const initialState: LoginState = {}

export function LoginForm() {
  const [role, setRole] = useState<"student" | "pengawas">("student")
  const [studentState, studentFormAction, studentPending] = useActionState(loginAction, initialState)
  const [pengawasState, pengawasFormAction, pengawasPending] = useActionState(loginPengawasAction, initialState)

  return (
    <div className="flex w-full flex-col gap-6">
      {role === "student" ? (
        <>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <UserCheck className="size-4" />
              <span>Portal Adik Asuh</span>
            </div>
            <p className="text-pretty text-base text-muted-foreground">
              Masuk menggunakan <strong>username</strong> atau <strong>NIK</strong> yang telah kamu daftarkan.
            </p>
          </div>

          <form action={studentFormAction} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="identifier" className="text-base font-bold text-foreground">
                Username atau NIK
              </Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="identifier"
                  name="identifier"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="Ketik username atau NIK"
                  className="h-14 rounded-2xl pl-12 text-base"
                  required
                />
              </div>
            </div>

            {studentState.error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-2xl bg-destructive/10 p-4 text-sm font-medium leading-relaxed text-destructive"
              >
                <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                <span>{studentState.error}</span>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={studentPending}
              className="h-14 rounded-2xl text-base font-bold"
            >
              {studentPending ? "Sedang masuk..." : "Masuk sebagai Adik Asuh"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link href="/daftar" className="font-bold text-primary underline-offset-4 hover:underline">
                Daftar di sini
              </Link>
            </p>
          </form>

          {/* Toggle kecil di bagian bawah untuk Pengawas */}
          <div className="mt-8 flex flex-col items-center gap-2 border-t border-border pt-6">
            <p className="text-xs text-muted-foreground">Petugas / Pengawas Lapangan?</p>
            <button
              type="button"
              onClick={() => setRole("pengawas")}
              className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition hover:text-primary"
            >
              <ShieldCheck className="size-3.5" />
              <span>Masuk sebagai Pengawas</span>
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <ShieldCheck className="size-4" />
              <span>Portal Pengawas Wilayah</span>
            </div>
            <p className="text-pretty text-base text-muted-foreground">
              Masuk menggunakan <strong>username</strong> dan <strong>password</strong> pengawas.
            </p>
          </div>

          <form action={pengawasFormAction} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="pengawas-username" className="text-base font-bold text-foreground">
                Username Pengawas
              </Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="pengawas-username"
                  name="username"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="Contoh: pati-kusnadi"
                  className="h-14 rounded-2xl pl-12 text-base"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="pengawas-password" className="text-base font-bold text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="pengawas-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Ketik password pengawas"
                  className="h-14 rounded-2xl pl-12 text-base"
                  required
                />
              </div>
            </div>

            {pengawasState.error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-2xl bg-destructive/10 p-4 text-sm font-medium leading-relaxed text-destructive"
              >
                <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                <span>{pengawasState.error}</span>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={pengawasPending}
              className="h-14 rounded-2xl text-base font-bold"
            >
              {pengawasPending ? "Sedang memverifikasi..." : "Masuk ke Panel Pengawas"}
            </Button>
          </form>

          {/* Tombol kembali ke login Adik Asuh */}
          <div className="mt-6 flex justify-center border-t border-border pt-4">
            <button
              type="button"
              onClick={() => setRole("student")}
              className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition hover:text-primary"
            >
              ← Kembali ke Login Adik Asuh
            </button>
          </div>
        </>
      )}
    </div>
  )
}
