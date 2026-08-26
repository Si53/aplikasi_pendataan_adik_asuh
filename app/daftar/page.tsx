import { PageHeader } from "@/components/page-header"
import { RegisterForm } from "@/components/register-form"

export default function DaftarPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-transparent pb-8">
      <PageHeader
        title="Daftar Adik Asuh"
        backHref="/"
        titleClassName="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
      />
      <RegisterForm />
    </main>
  )
}
