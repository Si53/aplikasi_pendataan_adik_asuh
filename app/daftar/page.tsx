import { PageHeader } from "@/components/page-header"
import { RegisterForm } from "@/components/register-form"

export default function DaftarPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col pb-4">
      <PageHeader title="Daftar Adik Asuh" backHref="/" />
      <RegisterForm />
    </main>
  )
}
