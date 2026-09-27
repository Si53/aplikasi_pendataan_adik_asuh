export interface WilayahBudgetItem {
  wilayah: string
  studentCount: number
  subtotal: number
}

export interface BudgetOverviewData {
  totalAnggaran: number
  totalApprovedStudents: number
  unassignedCount: number
  items: WilayahBudgetItem[]
}

export const TARIF_JENJANG: Record<string, number> = {
  SD: 500000,
  SMP: 600000,
  SMA: 800000,
  SMK: 800000,
  Kuliah: 1000000,
}

export const STANDARD_WILAYAH = [
  "Pati",
  "Jepara",
  "Ampel",
  "Wonosobo",
  "Sukabumi",
  "Bandung",
]

export interface StudentBudgetItem {
  status: string
  jenjang?: string | null
  wilayah?: string | null
}

/**
 * Menghitung total anggaran yang diperlukan per bulan untuk siswa yang berstatus 'approved'
 */
export function calculateTotalAnggaranDiperlukan(
  students: StudentBudgetItem[]
): number {
  const approvedStudentsList = students.filter((s) => s.status === "approved")
  let total = 0

  approvedStudentsList.forEach((s) => {
    const j = s.jenjang?.trim()
    if (j && TARIF_JENJANG[j]) {
      total += TARIF_JENJANG[j]
    }
  })

  return total
}

/**
 * Menghitung ringkasan anggaran beasiswa per wilayah dan secara keseluruhan
 */
export function calculateBudgetOverview(
  students: StudentBudgetItem[]
): BudgetOverviewData {
  const approvedStudentsList = students.filter((s) => s.status === "approved")
  const wilayahMap = new Map<string, { studentCount: number; subtotal: number }>()

  // Inisialisasi wilayah standar
  STANDARD_WILAYAH.forEach((w) => {
    wilayahMap.set(w, { studentCount: 0, subtotal: 0 })
  })

  let unassignedJenjangCount = 0
  let totalAnggaranBeasiswa = 0

  approvedStudentsList.forEach((s) => {
    const j = s.jenjang?.trim()
    if (j && TARIF_JENJANG[j]) {
      const tarif = TARIF_JENJANG[j]
      const w = s.wilayah?.trim() || "Lainnya"
      if (!wilayahMap.has(w)) {
        wilayahMap.set(w, { studentCount: 0, subtotal: 0 })
      }
      const entry = wilayahMap.get(w)!
      entry.studentCount += 1
      entry.subtotal += tarif
      totalAnggaranBeasiswa += tarif
    } else {
      unassignedJenjangCount++
    }
  })

  const budgetItems: WilayahBudgetItem[] = Array.from(wilayahMap.entries())
    .map(([wilayah, data]) => ({
      wilayah,
      studentCount: data.studentCount,
      subtotal: data.subtotal,
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
