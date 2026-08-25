import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { auth } from "@/auth"
import { LogoutButton } from "@/components/logout-button"
import { prisma } from "@/lib/prisma"
import {
  FileText,
  GraduationCap,
  Home,
  MessageCircle,
  UserRound,
  ExternalLink,
  Download,
  MapPin,
  Heart,
  Phone,
  BookOpen,
  Sparkles,
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

  // Inisial avatar
  const initials = student.fullName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  return (
    <div className="relative min-h-dvh w-full pb-28">
      {/* 1. Background: Gradient oranye hangat dengan motif lotus & dharma wheel subtil */}
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
              id="student-lotus-dharma-pattern"
              width="120"
              height="120"
              patternUnits="userSpaceOnUse"
            >
              {/* Dharmachakra */}
              <g transform="translate(30, 30)">
                <circle cx="0" cy="0" r="14" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="0" cy="0" r="4.5" fill="currentColor" />
                <line x1="0" y1="-14" x2="0" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="-14" y1="0" x2="14" y2="0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="-10" y1="-10" x2="10" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="-10" y1="10" x2="10" y2="-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* Lotus */}
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
          <rect width="100%" height="100%" fill="url(#student-lotus-dharma-pattern)" />
        </svg>
      </div>

      <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* 2. Judul Besar di Atas */}
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600">
              <Heart className="size-3.5 fill-orange-500 text-orange-500" />
              Vihara Vimala Dharma
            </p>
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Dashboard Adik Asuh
            </h1>
          </div>
        </header>

        {/* 3. Kartu Profil (Cream/Putih, Rounded Besar, Tombol Keluar Oranye Pill-Shape) */}
        <div className="flex items-center justify-between gap-4 rounded-3xl bg-white/90 p-4 sm:p-5 shadow-md backdrop-blur-md border border-orange-100/80">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Avatar */}
            <div className="relative size-12 sm:size-14 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white font-extrabold text-base sm:text-lg flex items-center justify-center shadow-md shadow-orange-500/20 border-2 border-white">
              {fotoDoc?.fileUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={fotoDoc.fileUrl}
                  alt={student.fullName}
                  className="size-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            {/* Nama & Wilayah */}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-muted-foreground">Selamat Datang</span>
              <h2 className="text-base sm:text-lg font-black text-foreground truncate">
                Halo, {student.fullName}
              </h2>
              <span className="text-[11px] font-bold text-orange-700 flex items-center gap-1">
                <MapPin className="size-3" /> Wilayah {student.wilayah}
              </span>
            </div>
          </div>

          {/* Tombol Keluar Oranye Pill-Shape */}
          <LogoutButton
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-500/20 active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
          />
        </div>

        {/* 4. Tiga Kartu Menu Besar Bersebelahan (Oranye / Biru / Hijau) */}
        <nav className="grid grid-cols-3 gap-3" aria-label="Menu navigasi dashboard">
          {/* Menu 1: Beranda (Oranye) */}
          <a
            href="#beranda"
            className="group flex flex-col items-center justify-center gap-2 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 p-4 text-white shadow-lg shadow-orange-500/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
          >
            <div className="flex size-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Home className="size-5 transition-transform group-hover:scale-110" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold tracking-wide">Beranda</span>
          </a>

          {/* Menu 2: Profil (Biru) */}
          <a
            href="#profil"
            className="group flex flex-col items-center justify-center gap-2 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 p-4 text-white shadow-lg shadow-blue-500/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
          >
            <div className="flex size-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <UserRound className="size-5 transition-transform group-hover:scale-110" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold tracking-wide">Profil</span>
          </a>

          {/* Menu 3: Dokumen (Hijau) */}
          <a
            href="#dokumen"
            className="group flex flex-col items-center justify-center gap-2 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 p-4 text-white shadow-lg shadow-emerald-500/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
          >
            <div className="flex size-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <FileText className="size-5 transition-transform group-hover:scale-110" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold tracking-wide">Dokumen</span>
          </a>
        </nav>

        {/* 5. Kartu "Selamat Datang" (Gambar Ilustrasi Biksu & Anak di Kiri, Teks & Pengawas di Kanan) */}
        <section id="beranda" className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-center gap-6 rounded-3xl bg-white/95 p-6 shadow-xl backdrop-blur-md border border-orange-100/90">
            {/* Sisi Kiri: Gambar Ilustrasi */}
            <div className="relative w-full max-w-[200px] h-[260px] shrink-0 overflow-hidden rounded-2xl shadow-sm border border-orange-100/80 bg-amber-50">
              <Image
                src="/illustrasi-biksu-anak.png"
                alt="Ilustrasi Biksu dan Anak"
                fill
                priority
                sizes="(max-width: 768px) 200px, 220px"
                className="object-cover"
              />
            </div>

            {/* Sisi Kanan: Teks & Info Pengawas */}
            <div className="flex flex-1 flex-col justify-center text-center md:text-left gap-3 w-full">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800">
                  <Sparkles className="size-3" /> Program Beasiswa
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  Selamat datang di Program Adik Asuh!
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground font-medium">
                  Bersama Vihara Vimala Dharma, kita raih cita-cita setinggi mungkin melalui
                  pendidikan yang berkelanjutan.
                </p>
              </div>

              {/* Kotak Pengawas Pendamping Asli */}
              <div className="rounded-2xl bg-orange-50/80 p-4 border border-orange-200/80 text-left">
                <span className="text-xs font-bold text-orange-900 block">
                  Pengawas Pendamping Wilayah {student.wilayah}:
                </span>
                <p className="mt-1 text-base sm:text-lg font-extrabold text-orange-600 flex items-center gap-1.5">
                  <MapPin className="size-4 shrink-0 text-orange-500" />
                  <span>{student.pengawas?.name ?? "Pengawas Wilayah"}</span>
                </p>
              </div>
            </div>
          </div>

          {/* 6. Tombol Hijau Besar Full-Width (WhatsApp) */}
          <a
            href="https://wa.me/6282129741793"
            target="_blank"
            rel="noreferrer"
            className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 hover:from-emerald-700 hover:to-green-600 px-6 text-base font-extrabold text-white shadow-lg shadow-emerald-600/25 active:scale-[0.98] transition duration-200"
          >
            <MessageCircle className="size-5" />
            <span>Hubungi Pengawas (WhatsApp)</span>
          </a>
        </section>

        {/* SECTION PROFIL SAYA */}
        <section id="profil" className="flex flex-col gap-4 pt-4">
          <div className="flex items-center justify-between border-l-4 border-blue-500 pl-3">
            <div>
              <h2 className="text-xl font-black text-foreground">Profil Saya</h2>
              <span className="text-xs text-muted-foreground">Informasi Pribadi Calon Adik Asuh</span>
            </div>
          </div>

          <div className="rounded-3xl bg-white/90 p-5 sm:p-6 shadow-md backdrop-blur-md border border-orange-100/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
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
            </div>
          </div>

          {/* Rincian Biaya Pendidikan */}
          {student.educationCosts.length > 0 && (
            <div className="rounded-3xl bg-white/90 p-5 sm:p-6 shadow-md backdrop-blur-md border border-orange-100/80 flex flex-col gap-3">
              <h3 className="text-base font-bold text-foreground">Rincian Kebutuhan Biaya</h3>
              <div className="flex flex-col divide-y divide-border/60 text-sm">
                {student.educationCosts.map((cost) => (
                  <div key={cost.id} className="flex justify-between py-2">
                    <span className="text-muted-foreground">{cost.label}</span>
                    <span className="font-bold text-foreground">
                      Rp {cost.amount.toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
                <div className="mt-1 flex justify-between pt-2 text-base font-extrabold text-orange-600">
                  <span>Total Estimasi Biaya</span>
                  <span>Rp {totalCost.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* SECTION DOKUMEN SAYA */}
        <section id="dokumen" className="flex flex-col gap-4 pt-4">
          <div className="flex items-center justify-between border-l-4 border-emerald-500 pl-3">
            <div>
              <h2 className="text-xl font-black text-foreground">Dokumen Saya</h2>
              <span className="text-xs text-muted-foreground">Berkas persyaratan yang telah diunggah</span>
            </div>
          </div>

          <div className="rounded-3xl bg-white/90 p-5 sm:p-6 shadow-md backdrop-blur-md border border-orange-100/80">
            <div className="flex flex-col gap-3">
              {student.documents.length ? (
                student.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-orange-50/60 p-4 border border-orange-200/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600">
                        <FileText className="size-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">
                          {doc.type === "FOTO_ANAK"
                            ? "Foto Anak"
                            : doc.type === "RAPOR"
                            ? "Rapor Terakhir"
                            : "Kartu Keluarga (KK)"}
                        </p>
                        <span className="text-[11px] text-muted-foreground">{doc.type}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-foreground shadow-sm border border-orange-200 hover:bg-orange-50 transition"
                      >
                        <ExternalLink className="size-3.5" />
                        <span>Lihat</span>
                      </a>
                      <a
                        href={doc.fileUrl}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 rounded-xl bg-orange-500 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-orange-600 transition"
                      >
                        <Download className="size-3.5" />
                        <span>Unduh</span>
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada dokumen yang diunggah.</p>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* 7. Bottom Navigation Bar Persisten (Fixed di Bagian Bawah Layar) */}
      <nav
        aria-label="Navigasi Bawah"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-orange-200/80 shadow-2xl px-6 py-2.5 max-w-lg mx-auto sm:rounded-t-3xl"
      >
        <div className="flex items-center justify-around">
          <a
            href="#beranda"
            className="flex flex-col items-center gap-1 py-1 text-orange-600 transition hover:opacity-80 active:scale-95"
          >
            <Home className="size-5" />
            <span className="text-[11px] font-bold">Beranda</span>
          </a>
          <a
            href="#profil"
            className="flex flex-col items-center gap-1 py-1 text-muted-foreground hover:text-blue-600 transition active:scale-95"
          >
            <UserRound className="size-5" />
            <span className="text-[11px] font-bold">Profil</span>
          </a>
          <a
            href="#dokumen"
            className="flex flex-col items-center gap-1 py-1 text-muted-foreground hover:text-emerald-600 transition active:scale-95"
          >
            <FileText className="size-5" />
            <span className="text-[11px] font-bold">Dokumen</span>
          </a>
        </div>
      </nav>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-orange-50/50 p-3.5 border border-orange-100/60">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-bold text-foreground">{value || "-"}</p>
    </div>
  )
}
