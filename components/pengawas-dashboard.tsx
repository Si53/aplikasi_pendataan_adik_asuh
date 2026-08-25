"use client"

import { useMemo, useState } from "react"
import {
  Search,
  GraduationCap,
  MapPin,
  Users,
  User,
  Phone,
  BookOpen,
  Home,
  HeartPulse,
  X,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type FamilyMember = {
  name: string
  status: string
  occupation: string
  incomePerMonth: string
  phone: string
  address: string
  medicalHistory: string
} | null

export type StudentDetail = {
  id: number
  fullName: string
  nik: string
  gender: string
  dateOfBirth: string
  alamatLengkap: string
  noHp: string
  schoolName: string
  gradeLevel: string
  nilaiRataRata: string
  citaCita: string
  wilayah: string
  riwayatPenyakit: string
  jumlahSaudara: number
  pengawasName: string
  father: FamilyMember
  mother: FamilyMember
  guardian: FamilyMember
  educationCosts: { id: number; label: string; amount: number }[]
  documents: { id: number; type: string; fileUrl: string }[]
}

export function PengawasDashboard({
  binaanStudents,
  sewilayahStudents,
  wilayah,
}: {
  binaanStudents: StudentDetail[]
  sewilayahStudents: StudentDetail[]
  wilayah: string
}) {
  const [query, setQuery] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null)

  const filterStudents = (list: StudentDetail[]) => {
    if (!query.trim()) return list
    const q = query.toLowerCase()
    return list.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.schoolName.toLowerCase().includes(q) ||
        s.citaCita.toLowerCase().includes(q)
    )
  }

  const filteredBinaan = useMemo(() => filterStudents(binaanStudents), [binaanStudents, query])
  const filteredSewilayah = useMemo(() => filterStudents(sewilayahStudents), [sewilayahStudents, query])

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Statistik Ringkas */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card className="rounded-2xl border-primary/20 bg-card shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users className="size-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-foreground">{binaanStudents.length}</p>
              <p className="text-xs text-muted-foreground">Adik Asuh Binaan Saya</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-card shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-secondary text-foreground">
              <GraduationCap className="size-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-foreground">
                {binaanStudents.length + sewilayahStudents.length}
              </p>
              <p className="text-xs text-muted-foreground">Total Adik Asuh di Wilayah {wilayah}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pencarian Global */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari adik asuh berdasarkan nama, sekolah, atau cita-cita..."
          className="h-12 rounded-2xl pl-10 text-sm"
        />
      </div>

      {/* SECTION 1: ADIK ASUH PILIHANNYA / BINAAN SAYA */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 border-l-4 border-primary pl-3">
          <h2 className="text-xl font-bold text-foreground">
            Adik Asuh Binaan Saya ({filteredBinaan.length})
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Daftar adik asuh yang memilih dan berada di bawah bimbingan langsung Anda.
          </p>
        </div>

        {filteredBinaan.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {query
              ? "Tidak ada adik asuh binaan yang cocok dengan pencarian."
              : "Belum ada adik asuh yang terdaftar di bawah bimbingan Anda."}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredBinaan.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                isBinaan={true}
                onSelect={() => setSelectedStudent(student)}
              />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2: ADIK ASUH SEWILAYAH */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 border-l-4 border-secondary-foreground/40 pl-3">
          <h2 className="text-xl font-bold text-foreground">
            Adik Asuh Lain di Wilayah {wilayah} ({filteredSewilayah.length})
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Daftar adik asuh di wilayah yang sama yang dibimbing oleh pengawas lain.
          </p>
        </div>

        {filteredSewilayah.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {query
              ? "Tidak ada adik asuh sewilayah yang cocok dengan pencarian."
              : `Tidak ada adik asuh lain di wilayah ${wilayah}.`}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredSewilayah.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                isBinaan={false}
                onSelect={() => setSelectedStudent(student)}
              />
            ))}
          </div>
        )}
      </section>

      {/* MODAL / DETAIL ADIK ASUH */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  )
}

function StudentCard({
  student,
  isBinaan,
  onSelect,
}: {
  student: StudentDetail
  isBinaan: boolean
  onSelect: () => void
}) {
  return (
    <Card className="flex flex-col justify-between rounded-2xl border-border/80 transition-shadow hover:shadow-md">
      <CardHeader className="gap-2 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              {student.fullName}
            </CardTitle>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3 text-primary" /> {student.wilayah}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
              isBinaan
                ? "bg-primary/10 text-primary"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {isBinaan ? "Binaan Saya" : `Pengawas: ${student.pengawasName}`}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pt-0 text-xs sm:text-sm">
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-secondary/40 p-3">
          <div>
            <span className="text-xs text-muted-foreground">Sekolah / Universitas</span>
            <p className="font-semibold text-foreground truncate">{student.schoolName || "-"}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Kelas / Semester</span>
            <p className="font-semibold text-foreground">{student.gradeLevel || "-"}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Nilai Rata-rata / IPK</span>
            <p className="font-semibold text-foreground">{student.nilaiRataRata || "-"}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Cita-cita</span>
            <p className="font-semibold text-foreground truncate">{student.citaCita || "-"}</p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-2">
          <p className="text-xs text-muted-foreground truncate">
            No HP: <strong className="text-foreground">{student.noHp || "-"}</strong>
          </p>
          <Button
            size="sm"
            variant="ghost"
            onClick={onSelect}
            className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary hover:bg-primary/10 cursor-pointer"
          >
            <span>Lihat Detail</span>
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function StudentDetailModal({
  student,
  onClose,
}: {
  student: StudentDetail
  onClose: () => void
}) {
  const [activeTab, setActiveTab] = useState<"pribadi" | "akademik" | "keluarga">("pribadi")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl bg-background shadow-2xl overflow-hidden border border-border">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <User className="size-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">{student.fullName}</h3>
              <p className="text-xs text-muted-foreground">
                Pengawas: {student.pengawasName} ({student.wilayah})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab Navigasi Modal */}
        <div className="flex border-b border-border bg-secondary/30 px-6">
          <button
            type="button"
            onClick={() => setActiveTab("pribadi")}
            className={`border-b-2 py-3 text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === "pribadi"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            } mr-6`}
          >
            Data Pribadi & Kontak
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("akademik")}
            className={`border-b-2 py-3 text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === "akademik"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            } mr-6`}
          >
            Pemantauan Akademik
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("keluarga")}
            className={`border-b-2 py-3 text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === "keluarga"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Orang Tua & Wali
          </button>
        </div>

        {/* Content Tab */}
        <div className="flex-1 overflow-y-auto p-6 text-sm">
          {/* TAB 1: DATA PRIBADI */}
          {activeTab === "pribadi" && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoItem
                  label="Nama Lengkap"
                  value={student.fullName}
                  icon={<User className="size-4 text-primary" />}
                />
                <InfoItem label="Jenis Kelamin" value={student.gender} />
                <InfoItem label="Cita-cita" value={student.citaCita} />
                <InfoItem
                  label="Nomor WhatsApp / HP Adik Asuh"
                  value={student.noHp}
                  icon={<Phone className="size-4 text-primary" />}
                />
                <InfoItem label="Jumlah Saudara" value={`${student.jumlahSaudara} orang`} />
                <InfoItem
                  label="Riwayat Penyakit"
                  value={student.riwayatPenyakit}
                  icon={<HeartPulse className="size-4 text-destructive" />}
                />
              </div>

              <div className="rounded-xl border border-border p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Home className="size-4 text-primary" />
                  <span>Alamat Lengkap</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {student.alamatLengkap || "-"}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: AKADEMIK */}
          {activeTab === "akademik" && (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoItem
                  label="Nama Sekolah / Universitas"
                  value={student.schoolName}
                  icon={<BookOpen className="size-4 text-primary" />}
                />
                <InfoItem label="Kelas / Tingkat / Semester" value={student.gradeLevel} />
                <InfoItem
                  label="Nilai Rata-rata Raport / IPK"
                  value={student.nilaiRataRata}
                  highlight
                />
                <InfoItem label="Wilayah" value={student.wilayah} />
              </div>

              {/* Rincian Biaya Pendidikan */}
              {student.educationCosts.length > 0 && (
                <div className="flex flex-col gap-2 rounded-2xl border border-border p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Kebutuhan Biaya Pendidikan
                  </p>
                  <div className="flex flex-col divide-y divide-border">
                    {student.educationCosts.map((cost) => (
                      <div key={cost.id} className="flex justify-between py-2 text-sm">
                        <span className="text-muted-foreground">{cost.label}</span>
                        <span className="font-bold text-foreground">
                          Rp {cost.amount.toLocaleString("id-ID")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ORANG TUA & WALI */}
          {activeTab === "keluarga" && (
            <div className="flex flex-col gap-4">
              <FamilyCard title="Data Ayah" data={student.father} />
              <FamilyCard title="Data Ibu" data={student.mother} />
              {student.guardian && student.guardian.name && (
                <FamilyCard title="Data Wali" data={student.guardian} />
              )}
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="flex items-center justify-end border-t border-border bg-secondary/30 px-6 py-3">
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl cursor-pointer">
            Tutup
          </Button>
        </div>
      </div>
    </div>
  )
}

function InfoItem({
  label,
  value,
  icon,
  highlight,
}: {
  label: string
  value: string
  icon?: React.ReactNode
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-xl p-3 ${
        highlight ? "border border-primary/30 bg-primary/5" : "bg-secondary/40"
      }`}
    >
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className={`mt-1 font-semibold ${highlight ? "text-base font-extrabold text-primary" : "text-foreground"}`}>
        {value || "-"}
      </p>
    </div>
  )
}

function FamilyCard({
  title,
  data,
}: {
  title: string
  data: FamilyMember
}) {
  if (!data || !data.name) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-4 text-xs text-muted-foreground">
        <strong>{title}:</strong> Data tidak tersedia / belum diisi.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <h4 className="font-bold text-foreground">{title}</h4>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
            data.status === "Meninggal Dunia"
              ? "bg-destructive/10 text-destructive"
              : "bg-primary/10 text-primary"
          }`}
        >
          Status: {data.status}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
        <div>
          <span className="text-muted-foreground">Nama Lengkap</span>
          <p className="font-semibold text-foreground">{data.name}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Nomor Telepon</span>
          <p className="font-semibold text-foreground">{data.phone || "-"}</p>
        </div>
        <div className="sm:col-span-2">
          <span className="text-muted-foreground">Pekerjaan</span>
          <p className="font-semibold text-foreground">{data.occupation || "-"}</p>
        </div>
        <div className="sm:col-span-2">
          <span className="text-muted-foreground">Alamat Domisili</span>
          <p className="font-semibold text-foreground">{data.address || "-"}</p>
        </div>
        <div className="sm:col-span-2">
          <span className="text-muted-foreground">Riwayat Penyakit</span>
          <p className="font-semibold text-foreground">{data.medicalHistory || "-"}</p>
        </div>
      </div>
    </div>
  )
}
