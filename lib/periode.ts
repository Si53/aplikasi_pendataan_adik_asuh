/**
 * Helper untuk logika periode semester (Ganjil / Genap).
 * - Bulan Juli-Desember (bulan 7-12 / index 6-11) = "[tahun] Ganjil"
 * - Bulan Januari-Juni (bulan 1-6 / index 0-5) = "[tahun] Genap"
 * - Periode paling awal yang tersedia adalah "2026 Ganjil".
 */

export const EARLIEST_YEAR = 2026
export const EARLIEST_SEMESTER = "Ganjil" as const

export type SemesterType = "Ganjil" | "Genap"

/**
 * Menentukan nama periode dari sebuah tanggal (contoh: "2026 Ganjil", "2027 Genap").
 */
export function getPeriodeFromDate(date: Date | string | number): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) {
    return `${EARLIEST_YEAR} ${EARLIEST_SEMESTER}`
  }
  const year = d.getFullYear()
  const month = d.getMonth() // 0-11
  const semester: SemesterType = month >= 6 ? "Ganjil" : "Genap"
  return `${year} ${semester}`
}

/**
 * Mendapatkan periode saat ini berdasarkan tanggal sekarang.
 * Jika tanggal saat ini sebelum 2026 Ganjil, fallback ke "2026 Ganjil".
 */
export function getCurrentPeriode(currentDate: Date = new Date()): string {
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() // 0-11
  const currentSemester: SemesterType = currentMonth >= 6 ? "Ganjil" : "Genap"

  if (
    currentYear < EARLIEST_YEAR ||
    (currentYear === EARLIEST_YEAR && currentSemester === "Genap")
  ) {
    return `${EARLIEST_YEAR} ${EARLIEST_SEMESTER}`
  }

  return `${currentYear} ${currentSemester}`
}

/**
 * Menghasilkan daftar seluruh periode dari "2026 Ganjil" sampai periode SAAT INI (berdasarkan tanggal hari ini),
 * diurutkan dari TERBARU ke TERLAMA.
 */
export function getAvailablePeriodeList(currentDate: Date = new Date()): string[] {
  const currentPeriode = getCurrentPeriode(currentDate)
  const [targetYearStr, targetSemester] = currentPeriode.split(" ")
  const targetYear = parseInt(targetYearStr, 10)

  const list: string[] = []
  let y = EARLIEST_YEAR
  let s: SemesterType = EARLIEST_SEMESTER

  while (true) {
    list.push(`${y} ${s}`)
    if (y === targetYear && s === targetSemester) {
      break
    }
    // Maju ke semester berikutnya
    if (s === "Ganjil") {
      y += 1
      s = "Genap"
    } else {
      s = "Ganjil"
    }
    // Safety guard untuk menghindari infinite loop
    if (y > targetYear + 50) break
  }

  return list.reverse()
}

/**
 * Mendapatkan rentang tanggal (start dan end) untuk sebuah periode string (contoh "2026 Ganjil").
 */
export function getPeriodeDateRange(periode: string): { start: Date; end: Date } {
  const [yearStr, semester] = periode.trim().split(" ")
  const year = parseInt(yearStr, 10) || EARLIEST_YEAR

  if (semester === "Ganjil") {
    return {
      start: new Date(year, 6, 1, 0, 0, 0, 0), // 1 Juli
      end: new Date(year, 11, 31, 23, 59, 59, 999), // 31 Desember
    }
  } else {
    return {
      start: new Date(year, 0, 1, 0, 0, 0, 0), // 1 Januari
      end: new Date(year, 5, 30, 23, 59, 59, 999), // 30 Juni
    }
  }
}

/**
 * Mengecek apakah tanggal berada di dalam rentang periode tertentu.
 */
export function isDateInPeriode(
  date: Date | string | number,
  periode: string
): boolean {
  return getPeriodeFromDate(date) === periode
}
