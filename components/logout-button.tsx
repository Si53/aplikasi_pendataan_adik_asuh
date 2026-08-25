"use client"

import { useTransition } from "react"
import { logoutAction } from "@/app/actions/auth"
import { LogOut, Loader2 } from "lucide-react"

export function LogoutButton({ className }: { className?: string }) {
  const [pending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction()
      window.location.href = "/login"
    })
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      className={
        className ||
        "flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2 text-xs sm:text-sm font-semibold text-destructive transition hover:bg-destructive/10 hover:text-destructive cursor-pointer disabled:opacity-50"
      }
      aria-label="Keluar dari akun"
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <LogOut className="size-4" />
      )}
      <span>{pending ? "Keluar..." : "Keluar"}</span>
    </button>
  )
}
