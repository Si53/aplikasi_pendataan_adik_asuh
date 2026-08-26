import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getPresignedR2Url } from "@/lib/r2"
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  HeartPulse,
  Home,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  Users,
} from "lucide-react"

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== "PENGAWAS" || !session.user.username) {
    redirect("/login")
  }

  const { id } = await params
  const studentId = Number(id)
  if (isNaN(studentId)) {
    notFound()
  }

  const pengawas = await prisma.pengawas.findUnique({
    where: { username: session.user.username },
  })
  if (!pengawas) redirect("/login")

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      pengawas: true,
      father: true,
      mother: true,
      guardian: true,
      educationCosts: true,
      documents: true,
    },
  })

  if (!student) {
    notFound()
  }

  const isBinaan = student.pengawasId === pengawas.id
  const fotoDoc = student.documents.find((d) => d.type === "FOTO_ANAK")
  const presignedFotoUrl = fotoDoc?.fileUrl ? await getPresignedR2Url(fotoDoc.fileUrl) : null

  const presignedDocuments = await Promise.all(
    student.documents.map(async (doc) => ({
      id: doc.id,
      type: doc.type,
      fileUrl: await getPresignedR2Url(doc.fileUrl),
    }))
  )

  const totalCost = student.educationCosts.reduce((sum, c) => sum + c.amount, 0)

  // Inisial untuk avatar fallback
  const initials = student.fullName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  return (
    <div className="relative min-h-dvh w-full">
      {/* Background subtil dengan gradient & dharma wheel + lotus */}
      <div
        className="fixed inset-0 -z-10 bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-amber-50/60 pointer-events-none"
        aria-hidden="true"
      >
        <svg
          className="h-full w-full opacity-10 text-orange-600 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="detail-dharma-lotus-bg"
              width="120"
              height="120"
              patternUnits="userSpaceOnUse"
            >
              <g transform="translate(30, 30)">
                <circle cx="0" cy="0" r="14" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="0" cy="0" r="4.5" fill="currentColor" />
                <line x1="0" y1="-14" x2="0" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="-14" y1="0" x2="14" y2="0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="-10" y1="-10" x2="10" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="-10" y1="10" x2="10" y2="-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </g>
              <g transform="translate(90, 90)">
                <path d="M0,6 C-3.5,-1 -3.5,-11 0,-15 C3.5,-11 3.5,-1 0,6" />
                <path d="M-1.5,5 C-8,1 -11,-7 -8,-12 C-5,-13 -2.5,-6 -1.5,5" />
                <path d="M1.5,5 C8,1 11,-7 8,-12 C5,-13 2.5,-6 1.5,5" />
                <path d="M-3,6 C-12,4 -15,-1 -13,-6 C-9,-7 -5,-1 -3,6" />
                <path d="M3,6 C12,4 15,-1 13,-6 C9,-7 5,-1 3,6" />
                <path d="M-7,7 Q0,11 7,7 Q0,9 -7,7" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#detail-dharma-lotus-bg)" />
        </svg>
      </div>

      <main className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* Header Navigasi */}
        <header className="flex items-center justify-between gap-4">
          <Link
            href="/pengawas"
            className="flex items-center gap-2 rounded-2xl bg-white/90 px-4 py-2.5 text-sm font-bold text-orange-950 shadow-sm border border-orange-200/80 backdrop-blur-md transition hover:bg-white hover:border-orange-300"
          >
            <ArrowLeft className="size-4" />
            <span>Kembali ke Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                isBinaan
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm"
                  : "bg-white/90 text-orange-900 border border-orange-200"
              }`}
            >
              {isBinaan ? "Binaan Langsung Saya" : `Wilayah: ${student.wilayah}`}
            </span>
          </div>
        </header>

        {/* Banner Profil Siswa */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 rounded-3xl bg-white/90 p-6 shadow-md backdrop-blur-md border border-orange-100/80">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 border-2 border-orange-200 shadow-sm">
            {presignedFotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={presignedFotoUrl}
                alt={student.fullName}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center font-extrabold text-2xl text-orange-600">
                {initials}
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col items-center sm:items-start text-center sm:text-left gap-1">
            <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
              {student.fullName}
            </h1>
            <p className="text-sm font-semibold text-orange-700 flex items-center gap-1.5">
              <MapPin className="size-4" />
              Wilayah {student.wilayah} • Pengawas: {student.pengawas?.name || "-"}
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-800 border border-orange-200">
                NIK: {student.nik}
              </span>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
                Cita-cita: {student.citaCita || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* MODUL 1: PEMANTAUAN AKADEMIK */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-l-4 border-orange-500 pl-3">
            <GraduationCap className="size-5 text-orange-500" />
            <h2 className="text-xl font-extrabold text-foreground">
              Modul 1: Pemantauan Akademik
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-3xl bg-white/90 p-5 shadow-sm backdrop-blur-md border border-orange-100/80">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <BookOpen className="size-4 text-orange-500" />
                Informasi Sekolah & Jenjang
              </h3>
              <div className="flex flex-col gap-2 text-sm">
                <div className="rounded-xl bg-orange-50/60 p-3">
                  <span className="text-xs text-muted-foreground">Nama Sekolah / Universitas</span>
                  <p className="font-bold text-foreground text-base">{student.schoolName || "-"}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-orange-50/60 p-3">
                    <span className="text-xs text-muted-foreground">Kelas / Semester</span>
                    <p className="font-bold text-foreground">{student.gradeLevel || "-"}</p>
                  </div>
                  <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 p-3">
                    <span className="text-xs text-amber-900 font-semibold">Nilai Rata-rata / IPK</span>
                    <p className="font-extrabold text-orange-600 text-base">{student.nilaiRataRata || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rincian Kebutuhan Biaya Pendidikan */}
            <div className="flex flex-col gap-3 rounded-3xl bg-white/90 p-5 shadow-sm backdrop-blur-md border border-orange-100/80">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Estimasi Biaya Pendidikan</h3>
                <span className="text-xs font-bold text-orange-600">
                  {student.educationCosts.length} Komponen
                </span>
              </div>
              <div className="flex flex-col divide-y divide-border/60 text-sm">
                {student.educationCosts.length > 0 ? (
                  student.educationCosts.map((cost) => (
                    <div key={cost.id} className="flex justify-between py-2">
                      <span className="text-muted-foreground">{cost.label}</span>
                      <span className="font-bold text-foreground">
                        Rp {cost.amount.toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="py-2 text-xs text-muted-foreground">
                    Tidak ada rincian biaya khusus.
                  </p>
                )}
                <div className="flex justify-between pt-2 text-base font-extrabold text-orange-600">
                  <span>Total Biaya</span>
                  <span>Rp {totalCost.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MODUL 2: PEMANTAUAN DATA ADIK ASUH (PRIBADI & KELUARGA) */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-l-4 border-amber-500 pl-3">
            <Users className="size-5 text-amber-500" />
            <h2 className="text-xl font-extrabold text-foreground">
              Modul 2: Pemantauan Data Adik Asuh
            </h2>
          </div>

          {/* Data Pribadi & Kontak */}
          <div className="rounded-3xl bg-white/90 p-5 sm:p-6 shadow-sm backdrop-blur-md border border-orange-100/80 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-foreground">Identitas & Kontak Pribadi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div className="rounded-xl bg-orange-50/50 p-3">
                <span className="text-xs text-muted-foreground">Tanggal Lahir</span>
                <p className="font-bold text-foreground">
                  {student.dateOfBirth.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="rounded-xl bg-orange-50/50 p-3">
                <span className="text-xs text-muted-foreground">Jenis Kelamin</span>
                <p className="font-bold text-foreground">{student.gender}</p>
              </div>
              <div className="rounded-xl bg-orange-50/50 p-3">
                <span className="text-xs text-muted-foreground">Jumlah Saudara</span>
                <p className="font-bold text-foreground">{student.jumlahSaudara} orang</p>
              </div>
              <div className="rounded-xl bg-orange-50/50 p-3">
                <span className="text-xs text-muted-foreground">Nomor WhatsApp / HP</span>
                <p className="font-bold text-foreground flex items-center gap-1">
                  <Phone className="size-3.5 text-orange-500" />
                  {student.noHp || "-"}
                </p>
              </div>
              <div className="rounded-xl bg-orange-50/50 p-3 sm:col-span-2">
                <span className="text-xs text-muted-foreground">Riwayat Penyakit</span>
                <p className="font-bold text-foreground">{student.riwayatPenyakit || "-"}</p>
              </div>
              <div className="rounded-xl bg-orange-50/50 p-3 sm:col-span-3">
                <span className="text-xs text-muted-foreground">Alamat Domisili</span>
                <p className="font-bold text-foreground">{student.alamatLengkap || "-"}</p>
              </div>
            </div>
          </div>

          {/* Data Keluarga */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Ayah */}
            <div className="rounded-3xl bg-white/90 p-5 shadow-sm backdrop-blur-md border border-orange-100/80 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <h4 className="font-bold text-foreground">Data Ayah</h4>
                <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-800">
                  {student.father?.status || "-"}
                </span>
              </div>
              {student.father ? (
                <div className="flex flex-col gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Nama:</span>{" "}
                    <strong className="text-foreground">{student.father.name}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pekerjaan:</span>{" "}
                    <strong className="text-foreground">{student.father.occupation || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Penghasilan:</span>{" "}
                    <strong className="text-foreground">{student.father.incomePerMonth || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">No HP:</span>{" "}
                    <strong className="text-foreground">{student.father.phone || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Alamat:</span>{" "}
                    <span className="text-foreground">{student.father.address || "-"}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Data belum diisi.</p>
              )}
            </div>

            {/* Ibu */}
            <div className="rounded-3xl bg-white/90 p-5 shadow-sm backdrop-blur-md border border-orange-100/80 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <h4 className="font-bold text-foreground">Data Ibu</h4>
                <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-800">
                  {student.mother?.status || "-"}
                </span>
              </div>
              {student.mother ? (
                <div className="flex flex-col gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Nama:</span>{" "}
                    <strong className="text-foreground">{student.mother.name}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pekerjaan:</span>{" "}
                    <strong className="text-foreground">{student.mother.occupation || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Penghasilan:</span>{" "}
                    <strong className="text-foreground">{student.mother.incomePerMonth || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">No HP:</span>{" "}
                    <strong className="text-foreground">{student.mother.phone || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Alamat:</span>{" "}
                    <span className="text-foreground">{student.mother.address || "-"}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Data belum diisi.</p>
              )}
            </div>

            {/* Wali jika ada */}
            {student.guardian && student.guardian.name && (
              <div className="rounded-3xl bg-white/90 p-5 shadow-sm backdrop-blur-md border border-orange-100/80 flex flex-col gap-3 sm:col-span-2">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <h4 className="font-bold text-foreground">Data Wali</h4>
                  <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-800">
                    {student.guardian.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Nama:</span>{" "}
                    <strong className="text-foreground">{student.guardian.name}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pekerjaan:</span>{" "}
                    <strong className="text-foreground">{student.guardian.occupation || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Penghasilan:</span>{" "}
                    <strong className="text-foreground">{student.guardian.incomePerMonth || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">No HP:</span>{" "}
                    <strong className="text-foreground">{student.guardian.phone || "-"}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dokumen Terunggah */}
          <div className="rounded-3xl bg-white/90 p-5 sm:p-6 shadow-sm backdrop-blur-md border border-orange-100/80 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-foreground">Dokumen Pendukung</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {presignedDocuments.length > 0 ? (
                presignedDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col justify-between gap-3 rounded-2xl bg-orange-50/50 p-4 border border-orange-200/60"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="size-5 text-orange-600" />
                      <div>
                        <p className="font-bold text-xs text-foreground">
                          {doc.type === "KK"
                            ? "Kartu Keluarga"
                            : doc.type === "RAPOR"
                            ? "Rapor Terakhir"
                            : "Foto Anak"}
                        </p>
                        <span className="text-[10px] text-muted-foreground">{doc.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white px-2.5 py-2 text-xs font-bold text-orange-800 shadow-sm border border-orange-200 hover:bg-orange-50"
                      >
                        <ExternalLink className="size-3.5" />
                        <span>Buka</span>
                      </a>
                      <a
                        href={doc.fileUrl}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center rounded-xl bg-orange-500 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-orange-600"
                      >
                        <Download className="size-3.5" />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">Belum ada dokumen yang terunggah.</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
