"use client"

import { useTransition } from "react"
import { loginAdminGoogleAction } from "@/app/actions/auth"
import { Loader2 } from "lucide-react"

export function AdminGoogleLoginButton() {
  const [pending, startTransition] = useTransition()

  const handleLogin = () => {
    startTransition(async () => {
      await loginAdminGoogleAction()
    })
  }

  return (
    <button
      type="button"
      onClick={handleLogin}
      disabled={pending}
      className="group relative flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-800 px-5 py-3.5 text-sm font-bold text-slate-100 shadow-lg shadow-slate-950/40 transition-all duration-200 hover:bg-slate-700 hover:border-slate-600 hover:shadow-slate-900/60 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
    >
      {pending ? (
        <Loader2 className="size-5 animate-spin text-indigo-400" />
      ) : (
        <svg className="size-5 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5c1.56 0 2.97.56 4.08 1.48l3.06-3.06C17.29 1.7 14.81 1 12 1 7.37 1 3.39 3.66 1.42 7.53l3.65 2.83C5.97 7.42 8.74 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.7 2.87c2.16-2 3.72-4.94 3.72-8.69z"
          />
          <path
            fill="#FBBC05"
            d="M5.07 14.64c-.24-.73-.38-1.5-.38-2.31 0-.81.14-1.58.38-2.31L1.42 7.19C.52 8.98 0 10.93 0 13s.52 4.02 1.42 5.81l3.65-2.83z"
          />
          <path
            fill="#34A853"
            d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.7-2.87c-1.08.72-2.45 1.16-4.23 1.16-3.26 0-6.03-2.42-6.93-5.36L1.42 16.19C3.39 20.34 7.37 23 12 23z"
          />
        </svg>
      )}
      <span>{pending ? "Menghubungkan ke Google..." : "Masuk dengan Google"}</span>
    </button>
  )
}
