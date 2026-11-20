import { formatGradeWithJenjang } from "./academic"
import { prisma } from "./prisma"

export interface StudentBudgetDetail {
  id: number
  fullName: string
  jenjang: string
  gradeLevel: string
  formattedJenjangKelas: string
  nominal: number
}

export interface WilayahBudgetItem {
  wilayah: string
  studentCount: number
  subtotal: number
  students: StudentBudgetDetail[]
}

export interface BudgetOverviewData {
  totalAnggaran: number
  totalApprovedStudents: number
  unassignedCount: number
  items: WilayahBudgetItem[]
}

export const TARIF_JENJANG: Record<string, number> = {
  SD: 250000,
  SMP: 300000,
  SMA: 400000,
  SMK: 400000,
  Kuliah: 500000,
}

/**
 * Mengambil nominal beasiswa bulanan berdasarkan jenjang dan/atau tingkat kelas siswa.
 * Jika customRates diberikan, fungsi akan memprioritaskan tarif dinamis dari database.
 */
export function getTarifForJenjang(
  jenjang?: string | null,
  gradeLevel?: string | null,
  customRates?: Record<string, number> | null
): number {
  const rates = customRates || TARIF_JENJANG
  const normJenjang = (jenjang || "").trim()
  const normGrade = (gradeLevel || "").trim()

  if (normJenjang === "Kuliah" || /SEMESTER|KULIAH|UNIV|D3|S1/i.test(normGrade)) {
    return rates.Kuliah ?? TARIF_JENJANG.Kuliah
  }
  if (
    normJenjang === "SMA" ||
    normJenjang === "SMK" ||
    normJenjang === "SMA/SMK" ||
    /\b(SMA|SMK)\b/i.test(normGrade)
  ) {
    if (normJenjang === "SMK") {
      return rates.SMK ?? rates.SMA ?? TARIF_JENJANG.SMK
    }
    return rates.SMA ?? TARIF_JENJANG.SMA
  }
  if (normJenjang === "SMP" || /\bSMP\b/i.test(normGrade)) {
    return rates.SMP ?? TARIF_JENJANG.SMP
  }
  if (
    normJenjang === "SD" ||
    /\bSD\b/i.test(normGrade) ||
    ["1", "2", "3", "4", "5", "6"].includes(normGrade.match(/\d+/)?.[0] || "")
  ) {
    return rates.SD ?? TARIF_JENJANG.SD
  }

  return rates[normJenjang] || 0
}

export async function getScholarshipRatesMap(): Promise<Record<string, number>> {
  try {
    const rows = await prisma.scholarshipRate.findMany()
    if (!rows || rows.length === 0) return { ...TARIF_JENJANG }
    const map: Record<string, number> = { ...TARIF_JENJANG }
    for (const r of rows) {
      map[r.jenjang] = r.nominal
    }
    return map
  } catch (e) {
    console.error("Error fetching scholarship rates from DB:", e)
    return { ...TARIF_JENJANG }
  }
}

export const STANDARD_WILAYAH = [
  "Pati",
  "Jepara",
  "Ampel",
  "Wonosobo",
  "Sukabumi",
  "Bandung",
]

export async function getRegionsList(): Promise<string[]> {
  try {
    const rows = await prisma.region.findMany({
      orderBy: { name: "asc" },
    })
    if (!rows || rows.length === 0) return [...STANDARD_WILAYAH]
    return rows.map((r) => r.name)
  } catch (e) {
    console.error("Error fetching regions from DB:", e)
    return [...STANDARD_WILAYAH]
  }
}

export interface StudentBudgetItem {
  id?: number
  fullName?: string
  status: string
  jenjang?: string | null
  gradeLevel?: string | null
  wilayah?: string | null
}

/**
 * Menghitung total anggaran yang diperlukan per bulan untuk siswa yang berstatus 'approved'
 */
export function calculateTotalAnggaranDiperlukan(
  students: StudentBudgetItem[],
  customRates?: Record<string, number> | null
): number {
  const approvedStudentsList = students.filter((s) => s.status === "approved")
  let total = 0

  approvedStudentsList.forEach((s) => {
    const tarif = getTarifForJenjang(s.jenjang, s.gradeLevel, customRates)
    if (tarif > 0) {
      total += tarif
    }
  })

  return total
}

/**
 * Menghitung ringkasan anggaran beasiswa per wilayah dan secara keseluruhan
 */
export function calculateBudgetOverview(
  students: StudentBudgetItem[],
  customRates?: Record<string, number> | null,
  customWilayah?: string[] | null
): BudgetOverviewData {
  const approvedStudentsList = students.filter((s) => s.status === "approved")
  const wilayahMap = new Map<
    string,
    { studentCount: number; subtotal: number; students: StudentBudgetDetail[] }
  >()

  const activeRegions = (customWilayah && customWilayah.length > 0) ? customWilayah : STANDARD_WILAYAH

  // Inisialisasi wilayah standar
  activeRegions.forEach((w) => {
    wilayahMap.set(w, { studentCount: 0, subtotal: 0, students: [] })
  })

  let unassignedJenjangCount = 0
  let totalAnggaranBeasiswa = 0

  approvedStudentsList.forEach((s) => {
    const tarif = getTarifForJenjang(s.jenjang, s.gradeLevel, customRates)
    const j = s.jenjang?.trim()
    const w = s.wilayah?.trim() || "Lainnya"

    if (!wilayahMap.has(w)) {
      wilayahMap.set(w, { studentCount: 0, subtotal: 0, students: [] })
    }
    const entry = wilayahMap.get(w)!

    if (tarif > 0) {
      entry.studentCount += 1
      entry.subtotal += tarif
      totalAnggaranBeasiswa += tarif
    } else {
      unassignedJenjangCount++
    }

    if (s.id && s.fullName) {
      entry.students.push({
        id: s.id,
        fullName: s.fullName,
        jenjang: j || "Belum Ditentukan",
        gradeLevel: s.gradeLevel || "-",
        formattedJenjangKelas: formatGradeWithJenjang(s.gradeLevel, j),
        nominal: tarif,
      })
    }
  })

  const budgetItems: WilayahBudgetItem[] = Array.from(wilayahMap.entries())
    .map(([wilayah, data]) => ({
      wilayah,
      studentCount: data.studentCount,
      subtotal: data.subtotal,
      students: data.students.sort(
        (a, b) => b.nominal - a.nominal || a.fullName.localeCompare(b.fullName)
      ),
    }))
    .sort(
      (a, b) =>
        b.subtotal - a.subtotal ||
        b.studentCount - a.studentCount ||
        a.wilayah.localeCompare(b.wilayah)
    )

  return {
    totalAnggaran: totalAnggaranBeasiswa,
    totalApprovedStudents: approvedStudentsList.length,
    unassignedCount: unassignedJenjangCount,
    items: budgetItems,
  }
}

