"use client"

import { useTransition } from "react"
import { logoutAdminAction } from "@/app/actions/auth"
import { LogOut, Loader2 } from "lucide-react"

export function AdminLogoutButton({ className }: { className?: string }) {
  const [pending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAdminAction()
      window.location.href = "/admin/login"
    })
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      className={
        className ||
        "flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs sm:text-sm font-semibold text-rose-300 transition hover:bg-rose-950/40 hover:text-rose-200 hover:border-rose-800/60 cursor-pointer disabled:opacity-50"
      }
      aria-label="Keluar dari Portal Admin"
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin text-rose-400" />
      ) : (
        <LogOut className="size-4 text-rose-400" />
      )}
      <span>{pending ? "Keluar..." : "Keluar"}</span>
    </button>
  )
}
