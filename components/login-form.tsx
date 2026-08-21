"use client"

import { useActionState } from "react"
import Link from "next/link"
import { loginAction, type LoginState } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"

const initialState: LoginState = {}

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState)

  return (
    <form action={formAction} className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="username" className="text-base font-bold">
          Username atau NIM
        </Label>
        <Input
          id="identifier"
          name="identifier"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="Ketik username atau NIM kamu"
          className="h-14 rounded-2xl text-lg"
          required
        />
      </div>

      {state.error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-2xl bg-accent p-4 text-sm font-medium leading-relaxed text-accent-foreground"
        >
          <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <span>{state.error}</span>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="h-14 rounded-2xl text-lg font-bold"
      >
        {pending ? "Sedang masuk..." : "Masuk"}
      </Button>

      <p className="text-center text-base text-muted-foreground">
        Belum punya akun?{" "}
        <Link href="/daftar" className="font-bold text-primary underline-offset-4 hover:underline">
          Daftar di sini
        </Link>
      </p>
    </form>
  )
}
