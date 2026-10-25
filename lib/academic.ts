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

/**
 * Mendapatkan jenjang yang diperbolehkan untuk dipilih (saat ini + 1 tingkat di atasnya).
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

  // Hanya jenjang saat ini dan tepat satu tingkat di atasnya jika ada
  if (idx === JENJANG_ORDER.length - 1) {
    // Kuliah
    return [currentJenjang]
  }

  return [currentJenjang, JENJANG_ORDER[idx + 1]]
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

