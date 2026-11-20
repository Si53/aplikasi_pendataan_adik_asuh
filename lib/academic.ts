export type JenjangLevel = "SD" | "SMP" | "SMA" | "Kuliah"

export const JENJANG_ORDER: JenjangLevel[] = ["SD", "SMP", "SMA", "Kuliah"]

export const KELAS_SD_OPTIONS = [
  { value: "1", label: "Kelas 1" },
  { value: "2", label: "Kelas 2" },
  { value: "3", label: "Kelas 3" },
  { value: "4", label: "Kelas 4" },
  { value: "5", label: "Kelas 5" },
  { value: "6", label: "Kelas 6" },
] as const

export const KELAS_SMP_SMA_OPTIONS = [
  { value: "1", label: "Kelas 1" },
  { value: "2", label: "Kelas 2" },
  { value: "3", label: "Kelas 3" },
] as const

export const KULIAH_OPTIONS = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
  "Semester 9",
  "Semester 10",
] as const

export interface CurrentEducationPosition {
  kategori: "Sekolah" | "Kuliah"
  jenjang: JenjangLevel
  gradeLevel: string
  schoolName: string
  labelDisplay: string
  isKnown: boolean
}

/**
 * Ekstraksi angka kelas/semester dari string bebas.
 */
function extractDigit(val: string | null | undefined): string | null {
  if (!val) return null
  const m = val.match(/\d+/)
  return m ? m[0] : null
}

/**
 * Tentukan posisi pendidikan saat ini dari data siswa dan pembaruan akademik terakhir.
 */
export function determineCurrentEducationPosition(
  student: {
    jenjang?: string | null
    gradeLevel?: string | null
    schoolName?: string | null
  },
  latestUpdate?: {
    kelasSaatItu?: string | null
    semester?: string | null
    namaSekolahBaru?: string | null
  } | null
): CurrentEducationPosition | null {
  const currentSchool =
    latestUpdate?.namaSekolahBaru?.trim() || student.schoolName?.trim() || ""

  // 1. Cek dari record AcademicUpdate terbaru jika ada
  if (latestUpdate?.kelasSaatItu) {
    const rawKelas = latestUpdate.kelasSaatItu.trim()

    // Apakah Kuliah (mengandung Semester atau kata kuliah)?
    if (/semester/i.test(rawKelas) || /kuliah/i.test(rawKelas)) {
      const digit = extractDigit(rawKelas) || "1"
      const semStr = `Semester ${digit}`
      return {
        kategori: "Kuliah",
        jenjang: "Kuliah",
        gradeLevel: semStr,
        schoolName: currentSchool,
        labelDisplay: `${semStr} (Kuliah)`,
        isKnown: true,
      }
    }

    // Apakah SD?
    if (/\bSD\b/i.test(rawKelas)) {
      const digit = extractDigit(rawKelas) || "1"
      return {
        kategori: "Sekolah",
        jenjang: "SD",
        gradeLevel: digit,
        schoolName: currentSchool,
        labelDisplay: `Kelas ${digit} SD`,
        isKnown: true,
      }
    }

    // Apakah SMP?
    if (/\bSMP\b/i.test(rawKelas)) {
      const digit = extractDigit(rawKelas) || "1"
      return {
        kategori: "Sekolah",
        jenjang: "SMP",
        gradeLevel: digit,
        schoolName: currentSchool,
        labelDisplay: `Kelas ${digit} SMP`,
        isKnown: true,
      }
    }

    // Apakah SMA atau SMK?
    if (/\b(SMA|SMK)\b/i.test(rawKelas)) {
      const digit = extractDigit(rawKelas) || "1"
      return {
        kategori: "Sekolah",
        jenjang: "SMA",
        gradeLevel: digit,
        schoolName: currentSchool,
        labelDisplay: `Kelas ${digit} SMA`,
        isKnown: true,
      }
    }

    // Jika kelasSaatItu hanya angka (misal "6") tanpa tulisan jenjang, gunakan student.jenjang
    const digit = extractDigit(rawKelas)
    if (digit && student.jenjang) {
      const sj = student.jenjang.trim()
      if (sj === "Kuliah") {
        const semStr = `Semester ${digit}`
        return {
          kategori: "Kuliah",
          jenjang: "Kuliah",
          gradeLevel: semStr,
          schoolName: currentSchool,
          labelDisplay: `${semStr} (Kuliah)`,
          isKnown: true,
        }
      }
      if (sj === "SD") {
        return {
          kategori: "Sekolah",
          jenjang: "SD",
          gradeLevel: digit,
          schoolName: currentSchool,
          labelDisplay: `Kelas ${digit} SD`,
          isKnown: true,
        }
      }
      if (sj === "SMP") {
        return {
          kategori: "Sekolah",
          jenjang: "SMP",
          gradeLevel: digit,
          schoolName: currentSchool,
          labelDisplay: `Kelas ${digit} SMP`,
          isKnown: true,
        }
      }
      if (sj === "SMA" || sj === "SMK") {
        return {
          kategori: "Sekolah",
          jenjang: "SMA",
          gradeLevel: digit,
          schoolName: currentSchool,
          labelDisplay: `Kelas ${digit} SMA`,
          isKnown: true,
        }
      }
    }
  }

  // 2. Fallback ke data pendaftaran di model Student
  if (student.jenjang) {
    const sj = student.jenjang.trim()
    const rawGrade = student.gradeLevel?.trim() || ""

    if (sj === "Kuliah") {
      const digit = extractDigit(rawGrade) || "1"
      const semStr = `Semester ${digit}`
      return {
        kategori: "Kuliah",
        jenjang: "Kuliah",
        gradeLevel: semStr,
        schoolName: currentSchool,
        labelDisplay: `${semStr} (Kuliah)`,
        isKnown: true,
      }
    }

    if (sj === "SD") {
      const digit = extractDigit(rawGrade) || "1"
      return {
        kategori: "Sekolah",
        jenjang: "SD",
        gradeLevel: digit,
        schoolName: currentSchool,
        labelDisplay: `Kelas ${digit} SD`,
        isKnown: true,
      }
    }

    if (sj === "SMP") {
      const digit = extractDigit(rawGrade) || "1"
      return {
        kategori: "Sekolah",
        jenjang: "SMP",
        gradeLevel: digit,
        schoolName: currentSchool,
        labelDisplay: `Kelas ${digit} SMP`,
        isKnown: true,
      }
    }

    if (sj === "SMA" || sj === "SMK") {
      const digit = extractDigit(rawGrade) || "1"
      return {
        kategori: "Sekolah",
        jenjang: "SMA",
        gradeLevel: digit,
        schoolName: currentSchool,
        labelDisplay: `Kelas ${digit} SMA`,
        isKnown: true,
      }
    }
  }

  // Siswa lama tanpa jenjang yang dapat ditentukan
  return null
}

export interface EducationStep {
  kategori: "Sekolah" | "Kuliah"
  jenjang: JenjangLevel
  kelas: string
  label: string
}

export const EDUCATION_LADDER: EducationStep[] = [
  // SD (Kelas 1 - 6)
  { kategori: "Sekolah", jenjang: "SD", kelas: "1", label: "Kelas 1 SD" },
  { kategori: "Sekolah", jenjang: "SD", kelas: "2", label: "Kelas 2 SD" },
  { kategori: "Sekolah", jenjang: "SD", kelas: "3", label: "Kelas 3 SD" },
  { kategori: "Sekolah", jenjang: "SD", kelas: "4", label: "Kelas 4 SD" },
  { kategori: "Sekolah", jenjang: "SD", kelas: "5", label: "Kelas 5 SD" },
  { kategori: "Sekolah", jenjang: "SD", kelas: "6", label: "Kelas 6 SD" },
  // SMP (Kelas 1 - 3)
  { kategori: "Sekolah", jenjang: "SMP", kelas: "1", label: "Kelas 1 SMP" },
  { kategori: "Sekolah", jenjang: "SMP", kelas: "2", label: "Kelas 2 SMP" },
  { kategori: "Sekolah", jenjang: "SMP", kelas: "3", label: "Kelas 3 SMP" },
  // SMA / SMK (Kelas 1 - 3)
  { kategori: "Sekolah", jenjang: "SMA", kelas: "1", label: "Kelas 1 SMA/SMK" },
  { kategori: "Sekolah", jenjang: "SMA", kelas: "2", label: "Kelas 2 SMA/SMK" },
  { kategori: "Sekolah", jenjang: "SMA", kelas: "3", label: "Kelas 3 SMA/SMK" },
  // Kuliah (Semester 1 - 10)
  { kategori: "Kuliah", jenjang: "Kuliah", kelas: "Semester 1", label: "Semester 1" },
  { kategori: "Kuliah", jenjang: "Kuliah", kelas: "Semester 2", label: "Semester 2" },
  { kategori: "Kuliah", jenjang: "Kuliah", kelas: "Semester 3", label: "Semester 3" },
  { kategori: "Kuliah", jenjang: "Kuliah", kelas: "Semester 4", label: "Semester 4" },
  { kategori: "Kuliah", jenjang: "Kuliah", kelas: "Semester 5", label: "Semester 5" },
  { kategori: "Kuliah", jenjang: "Kuliah", kelas: "Semester 6", label: "Semester 6" },
  { kategori: "Kuliah", jenjang: "Kuliah", kelas: "Semester 7", label: "Semester 7" },
  { kategori: "Kuliah", jenjang: "Kuliah", kelas: "Semester 8", label: "Semester 8" },
  { kategori: "Kuliah", jenjang: "Kuliah", kelas: "Semester 9", label: "Semester 9" },
  { kategori: "Kuliah", jenjang: "Kuliah", kelas: "Semester 10", label: "Semester 10" },
]

export function findEducationLadderIndex(
  jenjang?: string | null,
  gradeLevel?: string | null
): number {
  if (!jenjang && !gradeLevel) return -1

  const normJenjang = (jenjang || "").trim()
  const rawGrade = (gradeLevel || "").trim()
  const digitMatch = rawGrade.match(/\d+/)
  const digit = digitMatch ? digitMatch[0] : null

  if (normJenjang === "Kuliah" || /semester/i.test(rawGrade) || /kuliah/i.test(rawGrade)) {
    const sem = digit ? `Semester ${digit}` : "Semester 1"
    return EDUCATION_LADDER.findIndex(
      (s) => s.jenjang === "Kuliah" && s.kelas === sem
    )
  }

  if (normJenjang === "SD" || /\bSD\b/i.test(rawGrade)) {
    const k = digit || "1"
    return EDUCATION_LADDER.findIndex((s) => s.jenjang === "SD" && s.kelas === k)
  }

  if (normJenjang === "SMP" || /\bSMP\b/i.test(rawGrade)) {
    const k = digit || "1"
    return EDUCATION_LADDER.findIndex((s) => s.jenjang === "SMP" && s.kelas === k)
  }

  if (normJenjang === "SMA" || normJenjang === "SMK" || /\b(SMA|SMK)\b/i.test(rawGrade)) {
    const k = digit || "1"
    return EDUCATION_LADDER.findIndex((s) => s.jenjang === "SMA" && s.kelas === k)
  }

  if (digit) {
    const n = parseInt(digit, 10)
    if (n >= 1 && n <= 6) {
      return EDUCATION_LADDER.findIndex((s) => s.jenjang === "SD" && s.kelas === digit)
    }
  }

  return -1
}

export function getAllowedEducationSteps(
  currentPos: CurrentEducationPosition | null | undefined
): EducationStep[] {
  if (!currentPos || !currentPos.isKnown) {
    return EDUCATION_LADDER
  }

  const idx = findEducationLadderIndex(currentPos.jenjang, currentPos.gradeLevel)
  if (idx === -1) {
    return EDUCATION_LADDER
  }

  const minIdx = Math.max(0, idx - 1)
  const maxIdx = Math.min(EDUCATION_LADDER.length - 1, idx + 1)

  return EDUCATION_LADDER.slice(minIdx, maxIdx + 1)
}

/**
 * Mendapatkan jenjang yang diperbolehkan untuk dipilih (1 tingkat ke bawah, saat ini, dan 1 tingkat ke atas).
 */
export function getAllowedJenjang(
  currentJenjang: JenjangLevel | null | undefined
): JenjangLevel[] {
  if (!currentJenjang) {
    return [...JENJANG_ORDER]
  }

  const idx = JENJANG_ORDER.indexOf(currentJenjang)
  if (idx === -1) {
    return [...JENJANG_ORDER]
  }

  const minIdx = Math.max(0, idx - 1)
  const maxIdx = Math.min(JENJANG_ORDER.length - 1, idx + 1)
  return JENJANG_ORDER.slice(minIdx, maxIdx + 1)
}

/**
 * Cek apakah target jenjang merupakan naik jenjang dari jenjang saat ini.
 */
export function isNaikJenjang(
  currentJenjang: JenjangLevel | null | undefined,
  targetJenjang: string
): boolean {
  if (!currentJenjang) return false
  const currIdx = JENJANG_ORDER.indexOf(currentJenjang)
  const targetIdx = JENJANG_ORDER.indexOf(targetJenjang as JenjangLevel)
  if (currIdx === -1 || targetIdx === -1) return false
  return targetIdx === currIdx + 1
}

/**
 * Validasi apakah perpindahan jenjang diperbolehkan.
 */
export function isValidJenjangTransition(
  currentJenjang: JenjangLevel | null | undefined,
  targetJenjang: string
): boolean {
  if (!currentJenjang) return true // Siswa lama tidak dibatasi
  const allowed = getAllowedJenjang(currentJenjang)
  return allowed.includes(targetJenjang as JenjangLevel)
}

/**
 * Validasi apakah perpindahan tingkat (jenjang & kelas) diperbolehkan (maksimal 1 ke atas dan 1 ke bawah).
 */
export function isValidEducationStepTransition(
  currentPos: CurrentEducationPosition | null | undefined,
  targetJenjang: string,
  targetGradeLevel: string
): boolean {
  if (!currentPos || !currentPos.isKnown) return true
  const allowedSteps = getAllowedEducationSteps(currentPos)
  const targetDigit = extractDigit(targetGradeLevel)
  const normTargetJenjang = targetJenjang === "SMK" ? "SMA" : targetJenjang

  return allowedSteps.some((step) => {
    if (step.jenjang !== normTargetJenjang) return false
    const stepDigit = extractDigit(step.kelas)
    return stepDigit === targetDigit || step.kelas === targetGradeLevel
  })
}

/**
 * Nilai default kelas / semester saat naik jenjang.
 */
export function getDefaultGradeForJenjang(jenjang: string): string {
  if (jenjang === "Kuliah") {
    return "Semester 1"
  }
  return "1"
}

/**
 * Format angka kelas dan jenjang pendidikan untuk tampilan dashboard.
 * Contoh hasil:
 * - "1 SD", "6 SD"
 * - "3 SMP"
 * - "2 SMA/SMK" (untuk SMA maupun SMK)
 * - "Semester 4" (untuk jenjang Kuliah)
 */
export function formatGradeWithJenjang(
  gradeLevel?: string | null,
  jenjang?: string | null
): string {
  const rawGrade = (gradeLevel || "").trim()
  const rawJenjang = (jenjang || "").trim()

  if (!rawGrade && !rawJenjang) return "-"

  const normJenjang = rawJenjang.toUpperCase()
  const normGrade = rawGrade.toUpperCase()

  // 1. Kasus Kuliah / Semester
  if (
    normJenjang === "KULIAH" ||
    normGrade.includes("SEMESTER") ||
    normGrade.includes("KULIAH") ||
    normGrade.includes("UNIV") ||
    normGrade.includes("D3") ||
    normGrade.includes("S1")
  ) {
    const digitMatch = rawGrade.match(/\d+/)
    if (digitMatch) {
      return `Semester ${digitMatch[0]}`
    }
    return rawGrade || "Kuliah"
  }

  // 2. Ekstrak angka kelas
  const digitMatch = rawGrade.match(/\d+/)
  const digit = digitMatch ? digitMatch[0] : ""

  // 3. Deteksi jenjang SD
  if (
    normJenjang === "SD" ||
    /\bSD\b/i.test(normGrade) ||
    (!normJenjang && ["4", "5", "6"].includes(digit))
  ) {
    return digit ? `${digit} SD` : (rawGrade || "SD")
  }

  // 4. Deteksi jenjang SMP
  if (normJenjang === "SMP" || /\bSMP\b/i.test(normGrade)) {
    return digit ? `${digit} SMP` : (rawGrade || "SMP")
  }

  // 5. Deteksi jenjang SMA / SMK -> Ditampilkan sebagai "SMA/SMK"
  if (
    normJenjang === "SMA" ||
    normJenjang === "SMK" ||
    normJenjang === "SMA/SMK" ||
    /\b(SMA|SMK)\b/i.test(normGrade)
  ) {
    return digit ? `${digit} SMA/SMK` : (rawGrade || "SMA/SMK")
  }

  // 6. Jika jenjang belum ditentukan, tapi ada angka
  if (digit) {
    return `Kelas ${digit}`
  }

  return rawGrade || "-"
}

