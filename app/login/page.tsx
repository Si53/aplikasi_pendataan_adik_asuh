import Link from "next/link"
import { auth } from "@/auth"
import { logoutAction } from "@/app/actions/auth"
import { PageHeader } from "@/components/page-header"
import { LoginForm } from "@/components/login-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LogOut, ArrowRight, UserCheck, ShieldCheck } from "lucide-react"

export default async function LoginPage() {
  const session = await auth()

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-between px-5 py-6">
      <div>
        <PageHeader title="Masuk ke Akun" backHref="/" />
        <div className="flex flex-1 flex-col gap-6 py-4">
          {session?.user && (
            <Card className="rounded-2xl border-primary/30 bg-primary/5 p-4 shadow-sm animate-in fade-in">
              <CardContent className="flex flex-col gap-3 p-0">
                <div className="flex items-center gap-2 text-xs font-bold text-primary">
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
                  <p className="text-base font-bold text-foreground">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground">Username: {session.user.username}</p>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    nativeButton={false}
                    className="flex-1 rounded-xl font-bold"
                    render={
                      <Link href={session.user.role === "PENGAWAS" ? "/pengawas" : "/dashboard"}>
                        <span>Buka Dashboard</span>
                        <ArrowRight className="size-3.5 ml-1" />
                      </Link>
                    }
                  />
                  <form action={logoutAction} className="shrink-0">
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive font-semibold"
                    >
                      <LogOut className="size-3.5 mr-1" />
                      <span>Keluar</span>
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          )}

          <LoginForm />
        </div>
      </div>
    </main>
  )
}
