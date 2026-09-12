import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getPresignedR2Url } from "@/lib/r2"
import { ArrowLeft, MapPin, School, ShieldCheck, Sparkles } from "lucide-react"
import {
  AdminStudentDetailTabs,
  AdminStudentDetailData,
} from "@/components/admin-student-detail-tabs"
import { AdminDetailBottomBar } from "@/components/admin-detail-bottom-bar"
import { AdminPendingApprovalActions } from "@/components/admin-pending-approval-actions"

export const dynamic = "force-dynamic"

export default async function AdminStudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  const { id } = await params
  const studentId = Number(id)
  if (isNaN(studentId)) {
    notFound()
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      pengawas: true,
      father: true,
      mother: true,
      guardian: true,
      educationCosts: true,
      documents: true,
      academicUpdates: {
        orderBy: {
          tanggalInput: "desc",
        },
      },
      disbursements: {
        include: {
          pengawas: true,
        },
        orderBy: {
          tanggal: "desc",
        },
      },
      adminNotes: {
        include: {
          admin: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      bantuanAdjustments: {
        include: {
          admin: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      visitLogs: {
        include: {
          pengawas: true,
          admin: true,
        },
        orderBy: {
          tanggal: "desc",
        },
      },
    },
  })

  if (!student) {
    notFound()
  }

  // 1. Resolve Presigned URLs in parallel
  const fotoDoc = student.documents.find((d) => d.type === "FOTO_ANAK")
  const presignedFotoPromise = fotoDoc?.fileUrl
    ? getPresignedR2Url(fotoDoc.fileUrl)
    : Promise.resolve(null)

  const academicPromises = student.academicUpdates.map(async (item) => {
    const url = item.dokumenRapor
      ? await getPresignedR2Url(item.dokumenRapor)
      : null
    return {
      id: item.id,
      tanggalInput: item.tanggalInput.toISOString(),
      kelasSaatItu: item.kelasSaatItu,
      nilaiRataRata: item.nilaiRataRata,
      namaSekolahBaru: item.namaSekolahBaru,
      dokumenRaporUrl: url,
    }
  })

  const disbursementPromises = student.disbursements.map(async (d) => {
    const url = d.fileUrl ? await getPresignedR2Url(d.fileUrl) : ""
    return {
      id: d.id,
      tanggal: d.tanggal.toISOString(),
      pengawasName: d.pengawas.name,
      fileUrl: url,
      status: d.status,
      processedAt: d.processedAt ? d.processedAt.toISOString() : null,
    }
  })

  const [presignedFotoUrl, resolvedAcademics, resolvedDisbursements] =
    await Promise.all([
      presignedFotoPromise,
      Promise.all(academicPromises),
      Promise.all(disbursementPromises),
    ])

  // Latest visit record
  const latestVisitRecord = student.visitLogs[0]
    ? {
        tanggal: student.visitLogs[0].tanggal.toISOString(),
        visitorName:
          student.visitLogs[0].pengawas?.name ||
          student.visitLogs[0].admin?.name ||
          "Petugas",
        visitorRole: student.visitLogs[0].pengawasId
          ? "Pengawas Lapangan"
          : "Admin Pusat",
        catatan: student.visitLogs[0].catatan,
      }
    : null

  // Latest Academic update
  const latestAcademic = student.academicUpdates[0]
  const latestNilai = latestAcademic?.nilaiRataRata || student.nilaiRataRata || "-"
  const hasAcademicUpdate = Boolean(latestAcademic)

  const formattedData: AdminStudentDetailData = {
    student: {
      id: student.id,
      username: student.username,
      nik: student.nik,
      fullName: student.fullName,
      dateOfBirth: student.dateOfBirth.toISOString(),
      gender: student.gender,
      citaCita: student.citaCita,
      wilayah: student.wilayah,
      alamatLengkap: student.alamatLengkap,
      noHp: student.noHp,
      riwayatPenyakit: student.riwayatPenyakit,
      schoolName: student.schoolName,
      gradeLevel: student.gradeLevel,
      nilaiRataRata: student.nilaiRataRata,
      jumlahSaudara: student.jumlahSaudara,
      status: student.status,
      createdAt: student.createdAt.toISOString(),
    },
    pengawas: student.pengawas
      ? {
          id: student.pengawas.id,
          name: student.pengawas.name,
          wilayah: student.pengawas.wilayah,
          noHp: student.pengawas.noHp || null,
        }
      : null,
    latestNilai,
    hasAcademicUpdate,
    latestAcademicDate: latestAcademic?.tanggalInput
      ? latestAcademic.tanggalInput.toISOString()
      : null,
    father: student.father
      ? {
          name: student.father.name,
          status: student.father.status,
          occupation: student.father.occupation,
          incomePerMonth: student.father.incomePerMonth,
          address: student.father.address,
          phone: student.father.phone,
          medicalHistory: student.father.medicalHistory,
        }
      : null,
    mother: student.mother
      ? {
          name: student.mother.name,
          status: student.mother.status,
          occupation: student.mother.occupation,
          incomePerMonth: student.mother.incomePerMonth,
          address: student.mother.address,
          phone: student.mother.phone,
          medicalHistory: student.mother.medicalHistory,
        }
      : null,
    guardian: student.guardian
      ? {
          name: student.guardian.name,
          status: student.guardian.status,
          occupation: student.guardian.occupation,
          incomePerMonth: student.guardian.incomePerMonth,
          address: student.guardian.address,
          phone: student.guardian.phone,
          medicalHistory: student.guardian.medicalHistory,
        }
      : null,
    academicUpdates: resolvedAcademics,
    disbursements: resolvedDisbursements,
    adminNotes: student.adminNotes.map((n) => ({
      id: n.id,
      adminName: n.admin.name,
      note: n.note,
      createdAt: n.createdAt.toISOString(),
    })),
    bantuanAdjustments: student.bantuanAdjustments.map((b) => ({
      id: b.id,
      adminName: b.admin.name,
      nominalLama: b.nominalLama,
      nominalBaru: b.nominalBaru,
      catatan: b.catatan,
      createdAt: b.createdAt.toISOString(),
    })),
    latestVisit: latestVisitRecord,
    educationCosts: student.educationCosts.map((e) => ({
      id: e.id,
      label: e.label,
      amount: e.amount,
    })),
  }

  const initial = student.fullName.charAt(0).toUpperCase() || "A"
  const studentCode = `AKA-2024-${student.id.toString().padStart(4, "0")}`

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Top Breadcrumb Nav */}
      <div className="flex items-center justify-between print:hidden">
        <Link
          href="/admin/dashboard/data-anak-asuh"
          className="inline-flex items-center gap-2 rounded-xl bg-white border border-stone-200/90 px-3.5 py-2 text-xs sm:text-sm font-semibold text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition shadow-2xs"
        >
          <ArrowLeft className="size-4 text-stone-400" />
          <span>Kembali ke Data Anak Asuh</span>
        </Link>

        <span className="text-xs font-mono font-bold text-stone-500 bg-stone-100 px-3 py-1 rounded-lg border border-stone-200/80">
          {studentCode}
        </span>
      </div>

      {/* 2. Main Header Profile Card */}
      <div className="rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative size-16 sm:size-20 shrink-0 overflow-hidden rounded-2xl bg-orange-500 text-white font-black text-2xl sm:text-3xl flex items-center justify-center border-2 border-orange-200 shadow-xs">
              {presignedFotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={presignedFotoUrl}
                  alt={student.fullName}
                  className="size-full object-cover"
                />
              ) : (
                initial
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                  {student.fullName}
                </h1>
                <span className="rounded-md bg-stone-100 px-2 py-0.5 text-xs font-mono font-bold text-stone-600">
                  {studentCode}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 flex items-center gap-1.5 font-medium">
                <School className="size-4 text-stone-400" />
                <span>
                  {student.schoolName} ({student.gradeLevel})
                </span>
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-700 border border-orange-200/60">
                  <MapPin className="size-3 text-orange-500" />
                  Wilayah {student.wilayah}
                </span>

                {student.status === "approved" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Aktif Penuh
                  </span>
                ) : student.status === "alumni" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                    <span className="size-1.5 rounded-full bg-blue-500" />
                    Alumni
                  </span>
                ) : student.status === "nonaktif" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-700 border border-stone-300">
                    <span className="size-1.5 rounded-full bg-stone-500" />
                    Nonaktif
                  </span>
                ) : student.status === "pending" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                    <span className="size-1.5 rounded-full bg-amber-500" />
                    Peninjauan
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
                    <span className="size-1.5 rounded-full bg-rose-500" />
                    Ditolak
                  </span>
                )}

                <span className="text-xs font-mono text-stone-400">
                  NIK: {student.nik}
                </span>
              </div>
            </div>
          </div>

          {/* Tombol Setujui & Tolak jika status masih pending */}
          {student.status === "pending" && (
            <AdminPendingApprovalActions
              studentId={student.id}
              studentName={student.fullName}
            />
          )}
        </div>
      </div>

      {/* 3. 4 Interactive Tabs */}
      <AdminStudentDetailTabs data={formattedData} />

      {/* 4. Bottom Persistent Action Bar */}
      <AdminDetailBottomBar
        pengawasName={student.pengawas?.name}
        pengawasPhone={student.pengawas?.noHp}
        studentName={student.fullName}
      />
    </div>
  )
}
