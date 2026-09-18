import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getPresignedR2Url } from "@/lib/r2"
import {
  AdminAuditFinansialView,
  AuditProofItem,
  StudentWithoutProofItem,
} from "@/components/admin-audit-finansial-view"

export const dynamic = "force-dynamic"

export default async function AuditFinansialDashboardPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  // 1. Fetch pending proofs, students without proofs, and processed history in parallel
  const [pendingRaw, studentsWithoutProofRaw, processedRaw] = await Promise.all([
    prisma.disbursementProof.findMany({
      where: { status: "pending" },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            schoolName: true,
            gradeLevel: true,
            wilayah: true,
          },
        },
        pengawas: {
          select: {
            id: true,
            name: true,
            wilayah: true,
            noHp: true,
          },
        },
      },
      orderBy: {
        tanggal: "asc", // Urutkan dari yang paling lama diajukan
      },
    }),
    prisma.student.findMany({
      where: {
        disbursements: {
          none: {},
        },
      },
      include: {
        pengawas: {
          select: {
            id: true,
            name: true,
            wilayah: true,
          },
        },
      },
      orderBy: {
        fullName: "asc",
      },
    }),
    prisma.disbursementProof.findMany({
      where: {
        status: {
          in: ["verified", "rejected"],
        },
      },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            schoolName: true,
            gradeLevel: true,
            wilayah: true,
          },
        },
        pengawas: {
          select: {
            id: true,
            name: true,
            wilayah: true,
            noHp: true,
          },
        },
      },
      orderBy: [
        { processedAt: "desc" },
        { tanggal: "desc" },
      ],
    }),
  ])

  // 2. Resolve presigned URLs for proofs in parallel
  const pendingPromises = pendingRaw.map(async (p): Promise<AuditProofItem> => {
    const url = p.fileUrl ? await getPresignedR2Url(p.fileUrl) : ""
    return {
      id: p.id,
      tanggal: p.tanggal.toISOString(),
      fileUrl: url,
      nominal: p.nominal,
      status: p.status,
      processedAt: p.processedAt ? p.processedAt.toISOString() : null,
      student: {
        id: p.student.id,
        fullName: p.student.fullName,
        schoolName: p.student.schoolName,
        gradeLevel: p.student.gradeLevel,
        wilayah: p.student.wilayah,
      },
      pengawas: {
        id: p.pengawas.id,
        name: p.pengawas.name,
        wilayah: p.pengawas.wilayah,
        noHp: p.pengawas.noHp || null,
      },
    }
  })

  const processedPromises = processedRaw.map(
    async (p): Promise<AuditProofItem> => {
      const url = p.fileUrl ? await getPresignedR2Url(p.fileUrl) : ""
      return {
        id: p.id,
        tanggal: p.tanggal.toISOString(),
        fileUrl: url,
        nominal: p.nominal,
        status: p.status,
        processedAt: p.processedAt ? p.processedAt.toISOString() : null,
        student: {
          id: p.student.id,
          fullName: p.student.fullName,
          schoolName: p.student.schoolName,
          gradeLevel: p.student.gradeLevel,
          wilayah: p.student.wilayah,
        },
        pengawas: {
          id: p.pengawas.id,
          name: p.pengawas.name,
          wilayah: p.pengawas.wilayah,
          noHp: p.pengawas.noHp || null,
        },
      }
    }
  )

  const [pendingProofs, processedHistory] = await Promise.all([
    Promise.all(pendingPromises),
    Promise.all(processedPromises),
  ])

  const studentsWithoutProof: StudentWithoutProofItem[] =
    studentsWithoutProofRaw.map((st) => ({
      id: st.id,
      fullName: st.fullName,
      schoolName: st.schoolName,
      gradeLevel: st.gradeLevel,
      wilayah: st.wilayah,
      pengawas: st.pengawas
        ? {
            id: st.pengawas.id,
            name: st.pengawas.name,
            wilayah: st.pengawas.wilayah,
          }
        : null,
    }))

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <AdminAuditFinansialView
        pendingProofs={pendingProofs}
        studentsWithoutProof={studentsWithoutProof}
        processedHistory={processedHistory}
      />
    </div>
  )
}
