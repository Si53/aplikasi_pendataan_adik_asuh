import { PageHeader } from "@/components/page-header"
import { RegisterForm } from "@/components/register-form"

export default function DaftarPage() {
  return (
    <div className="relative min-h-dvh w-full">
      {/* 1 & 2. Background fixed, cover, center */}
      <div
        className="fixed inset-0 -z-10 bg-[url('/bg-wizard-pendaftaran.png')] bg-cover bg-center bg-no-repeat"
        aria-hidden="true"
      />
      <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col pb-8">
        <PageHeader
          title="Daftar Adik Asuh"
          backHref="/"
          titleClassName="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
        />
        <RegisterForm />
      </main>
    </div>
  )
}
