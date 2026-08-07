"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { registerAction, type RegisterPayload } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertCircle, ArrowLeft, ArrowRight, Check, Info } from "lucide-react"

type Family = {
  name: string
  status: string
  occupation: string
  medicalHistory: string
}

const emptyFamily: Family = { name: "", status: "Hidup", occupation: "", medicalHistory: "" }

const TOTAL_STEPS = 4

export function RegisterForm() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [step, setStep] = useState(1)
  const [error, setError] = useState<string | undefined>()

  // Step 1
  const [username, setUsername] = useState("")
  // Step 2
  const [fullName, setFullName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [gender, setGender] = useState("")
  const [city, setCity] = useState("")
  const [medicalHistory, setMedicalHistory] = useState("")
  // Step 3
  const [schoolName, setSchoolName] = useState("")
  const [grade, setGrade] = useState("")
  const [tuitionCost, setTuitionCost] = useState("")
  // Step 4
  const [father, setFather] = useState<Family>({ ...emptyFamily })
  const [mother, setMother] = useState<Family>({ ...emptyFamily })
  const [guardian, setGuardian] = useState<Family>({ ...emptyFamily })

  function next() {
    setError(undefined)
    if (step === 1 && !username.trim()) {
      setError("Silakan isi username terlebih dahulu.")
      return
    }
    if (step === 2) {
      if (!fullName.trim() || !dateOfBirth || !gender || !city.trim()) {
        setError("Lengkapi nama, tanggal lahir, jenis kelamin, dan kota dulu ya.")
        return
      }
    }
    if (step === 3) {
      if (!schoolName.trim() || !grade.trim() || !tuitionCost.trim()) {
        setError("Lengkapi data pendidikan terlebih dahulu.")
        return
      }
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }

  function back() {
    setError(undefined)
    setStep((s) => Math.max(s - 1, 1))
  }

  function submit() {
    setError(undefined)
    const payload: RegisterPayload = {
      username,
      fullName,
      dateOfBirth,
      gender,
      city,
      medicalHistory,
      schoolName,
      grade,
      tuitionCost,
      father,
      mother,
      guardian,
    }
    startTransition(async () => {
      const result = await registerAction(payload)
      if (result.error) {
        setError(result.error)
        if (result.error.toLowerCase().includes("username")) setStep(1)
        return
      }
      router.push("/daftar/sukses")
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-5 py-6">
      <div className="space-y-2">
        <p className="text-base font-bold text-primary">
          Langkah {step} dari {TOTAL_STEPS}
        </p>
        <div className="flex gap-1.5" aria-hidden="true">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-2.5 flex-1 rounded-full ${
                i < step ? "bg-primary" : "bg-secondary"
              }`}
            />
          ))}
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-2xl bg-accent p-4 text-sm font-medium leading-relaxed text-accent-foreground"
        >
          <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {step === 1 && (
        <section className="flex flex-col gap-5">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-foreground">Buat Akun</h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Pilih username yang mudah kamu ingat.
            </p>
          </div>
          <Field label="Username">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoCapitalize="none"
              spellCheck={false}
              placeholder="Contoh: budi2015"
              className="h-14 rounded-2xl text-lg"
            />
          </Field>
          <div className="flex items-start gap-2 rounded-2xl bg-secondary p-4 text-sm font-medium leading-relaxed text-secondary-foreground">
            <Info className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <span>
              Ingat baik-baik username kamu ya! Tidak ada kata sandi, jadi
              username ini yang dipakai untuk masuk nanti.
            </span>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="flex flex-col gap-5">
          <h2 className="text-xl font-extrabold text-foreground">Profil Siswa</h2>
          <Field label="Nama Lengkap">
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nama lengkap kamu"
              className="h-14 rounded-2xl text-lg"
            />
          </Field>
          <Field label="Tanggal Lahir">
            <Input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="h-14 rounded-2xl text-lg"
            />
          </Field>
          <Field label="Jenis Kelamin">
            <RadioGroup
              value={gender}
              onValueChange={setGender}
              className="grid grid-cols-2 gap-3"
            >
              {["Laki-laki", "Perempuan"].map((g) => (
                <Label
                  key={g}
                  htmlFor={`gender-${g}`}
                  className={`flex h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 text-base font-bold transition-colors ${
                    gender === g
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-border bg-background text-foreground"
                  }`}
                >
                  <RadioGroupItem id={`gender-${g}`} value={g} className="sr-only" />
                  {g}
                </Label>
              ))}
            </RadioGroup>
          </Field>
          <Field label="Kota Tempat Tinggal">
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Contoh: Magelang"
              className="h-14 rounded-2xl text-lg"
            />
          </Field>
          <Field label="Riwayat Penyakit">
            <Textarea
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              placeholder='Isi "-" kalau tidak ada'
              className="min-h-24 rounded-2xl text-lg"
            />
          </Field>
        </section>
      )}

      {step === 3 && (
        <section className="flex flex-col gap-5">
          <h2 className="text-xl font-extrabold text-foreground">Pendidikan</h2>
          <Field label="Nama Sekolah / Universitas">
            <Input
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Contoh: SD Negeri 1 Borobudur"
              className="h-14 rounded-2xl text-lg"
            />
          </Field>
          <Field label="Kelas / Semester">
            <Input
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder='Contoh: "6 SD" atau "Semester 8"'
              className="h-14 rounded-2xl text-lg"
            />
          </Field>
          <Field label="Uang Pendidikan">
            <Input
              value={tuitionCost}
              onChange={(e) => setTuitionCost(e.target.value)}
              placeholder='Contoh: "1 juta"'
              className="h-14 rounded-2xl text-lg"
            />
          </Field>
        </section>
      )}

      {step === 4 && (
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-extrabold text-foreground">Data Keluarga</h2>
          <FamilyFields title="Data Ayah" value={father} onChange={setFather} />
          <FamilyFields title="Data Ibu" value={mother} onChange={setMother} />
          <FamilyFields
            title="Data Wali"
            note="Boleh diisi jika memiliki wali"
            value={guardian}
            onChange={setGuardian}
          />
        </section>
      )}

      <div className="mt-2 flex flex-col gap-3">
        {step < TOTAL_STEPS ? (
          <Button
            type="button"
            size="lg"
            onClick={next}
            className="h-14 rounded-2xl text-lg font-bold"
          >
            Lanjut
            <ArrowRight className="size-5" aria-hidden="true" />
          </Button>
        ) : (
          <Button
            type="button"
            size="lg"
            onClick={submit}
            disabled={pending}
            className="h-14 rounded-2xl text-lg font-bold"
          >
            {pending ? "Menyimpan..." : "Daftar Sekarang"}
            {!pending && <Check className="size-5" aria-hidden="true" />}
          </Button>
        )}

        {step > 1 ? (
          <Button
            type="button"
            size="lg"
            variant="secondary"
            onClick={back}
            disabled={pending}
            className="h-14 rounded-2xl text-lg font-bold"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
            Kembali
          </Button>
        ) : (
          <Button
            size="lg"
            variant="ghost"
            nativeButton={false}
            className="h-14 rounded-2xl text-lg font-bold"
            render={<Link href="/">Batal</Link>}
          />
        )}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-base font-bold text-foreground">{label}</Label>
      {children}
    </div>
  )
}

function FamilyFields({
  title,
  note,
  value,
  onChange,
}: {
  title: string
  note?: string
  value: Family
  onChange: (v: Family) => void
}) {
  const set = (patch: Partial<Family>) => onChange({ ...value, ...patch })

  return (
    <div className="flex flex-col gap-4 rounded-2xl border-2 border-border p-4">
      <div className="space-y-1">
        <h3 className="text-lg font-extrabold text-foreground">{title}</h3>
        {note && <p className="text-sm font-medium text-muted-foreground">{note}</p>}
      </div>
      <Field label="Nama Lengkap">
        <Input
          value={value.name}
          onChange={(e) => set({ name: e.target.value })}
          placeholder="Nama lengkap"
          className="h-14 rounded-2xl text-lg"
        />
      </Field>
      <Field label="Status">
        <Select value={value.status} onValueChange={(status) => set({ status })}>
          <SelectTrigger className="!h-14 rounded-2xl text-lg">
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Hidup">Hidup</SelectItem>
            <SelectItem value="Meninggal Dunia">Meninggal Dunia</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Pekerjaan">
        <Input
          value={value.occupation}
          onChange={(e) => set({ occupation: e.target.value })}
          placeholder="boleh diisi - jika sudah meninggal"
          className="h-14 rounded-2xl text-lg"
        />
      </Field>
      <Field label="Riwayat Penyakit">
        <Textarea
          value={value.medicalHistory}
          onChange={(e) => set({ medicalHistory: e.target.value })}
          placeholder="boleh diisi - jika sudah meninggal"
          className="min-h-20 rounded-2xl text-lg"
        />
      </Field>
    </div>
  )
}
