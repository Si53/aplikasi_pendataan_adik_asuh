import { PageHeader } from "@/components/page-header"
import { RegisterForm } from "@/components/register-form"
import { prisma } from "@/lib/prisma"
import { getRegionsList } from "@/lib/budget"

export const dynamic = "force-dynamic"

export default async function DaftarPage() {
  const [availableRegions, availablePengawas] = await Promise.all([
    getRegionsList(),
    prisma.pengawas.findMany({
      where: { status: "aktif" },
      select: { id: true, name: true, wilayah: true },
      orderBy: { name: "asc" },
    }),
  ])

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md sm:max-w-xl md:max-w-2xl flex-col bg-transparent pb-8">
      <PageHeader
        title="Daftar Adik Asuh"
        backHref="/"
        titleClassName="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
      />
      <RegisterForm
        availableRegions={availableRegions}
        availablePengawas={availablePengawas}
      />
    </main>
  )
}
