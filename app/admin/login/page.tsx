import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { AdminGoogleLoginButton } from "@/components/admin-login-button"
import { Shield, AlertCircle, ArrowLeft, Lock } from "lucide-react"

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminLoginPage(props: PageProps) {
  const session = await auth()
  if (session?.user?.role === "ADMIN") {
    redirect("/admin/dashboard")
  }

  const searchParams = await props.searchParams
  const error = typeof searchParams.error === "string" ? searchParams.error : undefined

  return (
    <div className="relative min-h-dvh w-full flex flex-col justify-between bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Background Subtle Gradient & Grid Pattern */}
      <div
        className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 -z-10 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Header Back Navigation */}
      <div className="mx-auto w-full max-w-md px-5 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900/90 px-3.5 py-2 text-xs font-semibold text-slate-300 border border-slate-800 shadow-sm backdrop-blur-md transition hover:bg-slate-800 hover:text-white"
        >
          <ArrowLeft className="size-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Main Login Card */}
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-8">
        <div className="w-full rounded-3xl border border-slate-800/80 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 shadow-inner">
              <Image
                src="/logo-kakak-asuh-pvvd.png"
                alt="Logo PVVD"
                width={36}
                height={36}
                className="rounded-full object-cover"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-950/60 border border-indigo-800/60 px-3 py-1 text-[11px] font-bold text-indigo-300 mb-2.5">
              <Shield className="size-3 text-indigo-400" />
              <span>Portal Administrator</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Kakak Asuh PVVD
            </h1>
            <p className="mt-1 text-xs text-slate-400 max-w-xs">
              Sistem Pengawasan, Audit Finansial & Manajemen Data Adik Asuh
            </p>
          </div>

          {/* Error Banner jika Email Tidak Terdaftar / Ditolak */}
          {error && (
            <div className="mb-6 rounded-2xl border border-rose-900/60 bg-rose-950/40 p-4 text-left animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="size-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <h2 className="text-xs sm:text-sm font-bold text-rose-200">
                    Email tidak terdaftar sebagai Admin
                  </h2>
                  <p className="text-[11px] text-rose-300/80 leading-relaxed">
                    Akun Google yang Anda gunakan tidak memiliki hak akses administrator. Silakan masuk menggunakan email yang telah terdaftar pada sistem.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Google Sign In */}
          <div className="flex flex-col gap-4">
            <AdminGoogleLoginButton />

            <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400 justify-center">
              <Lock className="size-3.5 text-slate-500" />
              <span>Autentikasi aman melalui Google OAuth 2.0</span>
            </div>
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-slate-800/80" />

          {/* Footer Card */}
          <div className="text-center">
            <p className="text-xs text-slate-400">
              Bukan Administrator?{" "}
              <Link
                href="/login"
                className="font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
              >
                Masuk Adik Asuh / Pengawas
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500">
        <p>© 2026 Administrator Adik Asuh • Vihara Vimala Dharma</p>
      </footer>
    </div>
  )
}
