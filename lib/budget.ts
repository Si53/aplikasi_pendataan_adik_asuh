import { formatGradeWithJenjang } from "./academic"

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
  const wilayahMap = new Map<
    string,
    { studentCount: number; subtotal: number; students: StudentBudgetDetail[] }
  >()

  // Inisialisasi wilayah standar
  STANDARD_WILAYAH.forEach((w) => {
    wilayahMap.set(w, { studentCount: 0, subtotal: 0, students: [] })
  })

  let unassignedJenjangCount = 0
  let totalAnggaranBeasiswa = 0

  approvedStudentsList.forEach((s) => {
    const j = s.jenjang?.trim()
    const tarif = j && TARIF_JENJANG[j] ? TARIF_JENJANG[j] : 0
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

