import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { LogoutButton } from "@/components/logout-button"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  GraduationCap,
  LogOut,
  MessageCircle,
  UserRound,
  ExternalLink,
  Download,
  MapPin,
  Heart,
  Phone,
  BookOpen,
} from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "STUDENT" || !session.user.username) {
    redirect("/login")
  }

  const student = await prisma.student.findUnique({
    where: { username: session.user.username },
    include: {
      pengawas: true,
      father: true,
      mother: true,
      guardian: true,
      educationCosts: true,
      documents: true,
    },
  })
  if (!student) redirect("/login")

  const fotoDoc = student.documents.find((d) => d.type === "FOTO_ANAK")
  const totalCost = student.educationCosts.reduce((sum, c) => sum + c.amount, 0)

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-6 px-5 py-6 sm:py-8">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <Heart className="size-3.5 fill-primary" />
            Portal Adik Asuh
          </p>
          <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
            Halo, {student.fullName}
          </h1>
        </div>
        <LogoutButton />
      </header>

      {/* Navigasi Cepat */}
      <nav className="grid grid-cols-3 gap-2" aria-label="Menu dashboard">
        <a
          href="#beranda"
          className="flex flex-col items-center gap-1.5 rounded-2xl bg-primary p-3.5 text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          <GraduationCap className="size-5" />
          <span className="text-xs font-bold">Beranda</span>
        </a>
        <a
          href="#profil"
          className="flex flex-col items-center gap-1.5 rounded-2xl bg-secondary p-3.5 text-foreground shadow-sm transition hover:bg-secondary/80"
        >
          <UserRound className="size-5 text-primary" />
          <span className="text-xs font-bold">Profil Saya</span>
        </a>
        <a
          href="#dokumen"
          className="flex flex-col items-center gap-1.5 rounded-2xl bg-secondary p-3.5 text-foreground shadow-sm transition hover:bg-secondary/80"
        >
          <FileText className="size-5 text-primary" />
          <span className="text-xs font-bold">Dokumen</span>
        </a>
      </nav>

      {/* SECTION 1: BERANDA */}
      <section id="beranda" className="flex flex-col gap-4">
        <Card className="rounded-3xl border-0 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold">
              Selamat datang di Program Adik Asuh!
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm leading-relaxed opacity-95">
              Program Adik Asuh Vihara Vimala Dharma hadir untuk mendampingi dan mendukung penuh
              kelancaran perjalanan pendidikanmu hingga meraih cita-cita.
            </p>

            <div className="flex flex-col gap-1 rounded-2xl bg-black/15 p-3.5 text-xs sm:text-sm">
              <span className="opacity-80">Pengawas Pendamping Wilayah {student.wilayah}:</span>
              <p className="font-bold text-base flex items-center gap-1.5">
                <MapPin className="size-4 shrink-0" />
                {student.pengawas?.name ?? "Pengawas Wilayah"}
              </p>
            </div>

            <Button
              nativeButton={false}
              render={
                <a
                  href="https://wa.me/6282129741793"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 font-bold"
                >
                  <MessageCircle className="size-4" />
                  <span>Hubungi Kakak Asuh / Pengawas (WhatsApp)</span>
                </a>
              }
              className="h-12 w-full rounded-2xl bg-background text-foreground hover:bg-background/90"
            />
          </CardContent>
        </Card>
      </section>

      {/* SECTION 2: PROFIL SAYA */}
      <section id="profil" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-foreground">Profil Saya</h2>
          <span className="text-xs text-muted-foreground">Mode Baca (Read-only)</span>
        </div>

        {fotoDoc && (
          <Card className="rounded-2xl border-border bg-card">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-secondary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fotoDoc.fileUrl}
                  alt={student.fullName}
                  className="size-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-primary">Foto Adik Asuh</p>
                <p className="text-sm font-semibold text-foreground">{student.fullName}</p>
                <p className="text-xs text-muted-foreground">{student.schoolName}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="rounded-2xl border-border bg-card">
          <CardContent className="grid gap-3 p-5 sm:grid-cols-2">
            <Info label="Nomor Induk Kependudukan (NIK)" value={student.nik} />
            <Info
              label="Tanggal Lahir"
              value={student.dateOfBirth.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
            <Info label="Jenis Kelamin" value={student.gender} />
            <Info label="Cita-cita" value={student.citaCita} />
            <Info label="Sekolah / Universitas" value={student.schoolName} />
            <Info label="Kelas / Tingkat" value={student.gradeLevel} />
            <Info label="Nilai Rata-rata / IPK" value={student.nilaiRataRata} />
            <Info label="Nomor WhatsApp" value={student.noHp} />
            <Info label="Wilayah" value={student.wilayah} />
            <Info label="Jumlah Saudara" value={`${student.jumlahSaudara} orang`} />
            <div className="sm:col-span-2">
              <Info label="Alamat Lengkap" value={student.alamatLengkap} />
            </div>
            <div className="sm:col-span-2">
              <Info label="Riwayat Penyakit" value={student.riwayatPenyakit} />
            </div>
          </CardContent>
        </Card>

        {/* Data Keluarga Ringkas */}
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Informasi Orang Tua & Wali</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 p-5 pt-0 sm:grid-cols-2 text-xs">
            <div className="rounded-xl bg-secondary/40 p-3">
              <p className="font-bold text-foreground">Ayah: {student.father?.name || "-"}</p>
              <p className="text-muted-foreground">Status: {student.father?.status || "-"}</p>
              <p className="text-muted-foreground">No HP: {student.father?.phone || "-"}</p>
            </div>
            <div className="rounded-xl bg-secondary/40 p-3">
              <p className="font-bold text-foreground">Ibu: {student.mother?.name || "-"}</p>
              <p className="text-muted-foreground">Status: {student.mother?.status || "-"}</p>
              <p className="text-muted-foreground">No HP: {student.mother?.phone || "-"}</p>
            </div>
            {student.guardian?.name && (
              <div className="rounded-xl bg-secondary/40 p-3 sm:col-span-2">
                <p className="font-bold text-foreground">Wali: {student.guardian.name}</p>
                <p className="text-muted-foreground">Status: {student.guardian.status || "-"}</p>
                <p className="text-muted-foreground">No HP: {student.guardian.phone || "-"}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rincian Biaya Pendidikan */}
        {student.educationCosts.length > 0 && (
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Rincian Kebutuhan Biaya</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 p-5 pt-0 text-sm">
              {student.educationCosts.map((cost) => (
                <div key={cost.id} className="flex justify-between border-b border-border/60 py-2">
                  <span className="text-muted-foreground">{cost.label}</span>
                  <span className="font-bold text-foreground">
                    Rp {cost.amount.toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
              <div className="mt-1 flex justify-between pt-2 text-base font-extrabold text-primary">
                <span>Total Estimasi Biaya</span>
                <span>Rp {totalCost.toLocaleString("id-ID")}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* SECTION 3: DOKUMEN SAYA */}
      <section id="dokumen" className="flex flex-col gap-4 pb-8">
        <h2 className="text-xl font-extrabold text-foreground">Dokumen Saya</h2>
        <Card className="rounded-2xl border-border bg-card">
          <CardContent className="flex flex-col gap-3 p-5">
            {student.documents.length ? (
              student.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-xl bg-secondary/50 p-3.5 font-medium"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="size-5 text-primary" />
                    <div>
                      <p className="font-bold text-foreground">
                        {doc.type === "FOTO_ANAK"
                          ? "Foto Anak"
                          : doc.type === "RAPOR"
                          ? "Rapor Terakhir"
                          : "Kartu Keluarga (KK)"}
                      </p>
                      <span className="text-[10px] text-muted-foreground">{doc.type}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-background/80"
                    >
                      <ExternalLink className="size-3" />
                      <span>Lihat</span>
                    </a>
                    <a
                      href={doc.fileUrl}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      <Download className="size-3" />
                      <span>Unduh</span>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Belum ada dokumen yang diunggah.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary/40 p-3">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="mt-1 font-bold text-foreground">{value || "-"}</p>
    </div>
  )
}
