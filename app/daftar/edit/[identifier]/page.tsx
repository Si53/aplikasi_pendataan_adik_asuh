import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/page-header"
import { RegisterForm } from "@/components/register-form"

type PageProps = {
  params: Promise<{ identifier: string }>
}

export const dynamic = "force-dynamic"

export default async function EditDaftarPage({ params }: PageProps) {
  const resolvedParams = await params
  const rawIdentifier = resolvedParams?.identifier
  const identifier = rawIdentifier ? decodeURIComponent(rawIdentifier).trim() : ""

  if (!identifier) {
    redirect("/cek-status")
  }

  const student = await prisma.student.findFirst({
    where: {
      OR: [{ username: identifier }, { nik: identifier }],
    },
    include: {
      father: true,
      mother: true,
      guardian: true,
      educationCosts: true,
      documents: true,
      pengawas: {
        select: {
          id: true,
          name: true,
          wilayah: true,
        },
      },
      adminNotes: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  })

  // JIKA status BUKAN "perlu_revisi", jangan izinkan akses, redirect ke /cek-status
  if (!student || student.status !== "perlu_revisi") {
    redirect("/cek-status")
  }

  const latestRevisionNote = student.adminNotes?.[0]?.note || ""

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md sm:max-w-xl md:max-w-2xl flex-col bg-transparent pb-8">
      <PageHeader
        title="Perbaiki Pendaftaran"
        backHref="/cek-status"
        titleClassName="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
      />
      <RegisterForm
        isEditMode={true}
        originalIdentifier={identifier}
        revisionNote={latestRevisionNote}
        initialStudentData={student}
      />
    </main>
  )
}
