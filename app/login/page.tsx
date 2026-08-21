import { redirect } from "next/navigation"
import { getSessionUsername } from "@/lib/session"
import { PageHeader } from "@/components/page-header"
import { LoginForm } from "@/components/login-form"

export default async function LoginPage() {
  const username = await getSessionUsername()
  if (username) redirect("/dashboard")

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <PageHeader title="Login" backHref="/" />
      <div className="flex flex-1 flex-col gap-6 px-5 py-6">
        <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
          Masuk menggunakan username atau NIM yang kamu daftarkan.
        </p>
        <LoginForm />
      </div>
    </main>
  )
}
