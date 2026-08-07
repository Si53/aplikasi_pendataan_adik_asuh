import { redirect } from "next/navigation"
import { getSessionUsername } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { logoutAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { GraduationCap, LogOut, Sparkles } from "lucide-react"

export default async function DashboardPage() {
  const username = await getSessionUsername()
  if (!username) redirect("/login")

  const student = await prisma.student.findUnique({ where: { username } })
  if (!student) redirect("/login")

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 py-8">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div className="flex size-24 items-center justify-center rounded-full bg-accent">
          <GraduationCap className="size-12 text-primary" aria-hidden="true" />
        </div>

        <div className="space-y-3">
          <h1 className="text-balance text-3xl font-extrabold leading-tight text-foreground">
            Halo, {student.fullName}!
          </h1>
          <p className="flex items-center justify-center gap-2 text-pretty text-lg leading-relaxed text-muted-foreground">
            <Sparkles className="size-5 text-primary" aria-hidden="true" />
            Semangat terus belajarnya.
          </p>
        </div>

        <div className="w-full rounded-2xl bg-secondary p-4 text-left">
          <p className="text-sm font-medium text-muted-foreground">Username kamu</p>
          <p className="text-lg font-extrabold text-foreground">{student.username}</p>
        </div>
      </div>

      <form action={logoutAction}>
        <Button
          type="submit"
          size="lg"
          variant="secondary"
          className="h-14 w-full rounded-2xl text-lg font-bold"
        >
          <LogOut className="size-5" aria-hidden="true" />
          Keluar
        </Button>
      </form>
    </main>
  )
}
