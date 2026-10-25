"use client"

import { Download } from "lucide-react"

export function AdminDataHeaderActions() {
  const handleTriggerExport = () => {
    const trigger = document.getElementById("btn-export-csv-trigger")
    if (trigger) {
      trigger.click()
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* Tombol Export Data */}
      <button
        type="button"
        onClick={handleTriggerExport}
        className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-stone-700 hover:bg-stone-50 hover:text-stone-900 shadow-2xs transition cursor-pointer"
      >
        <Download className="size-4 text-stone-500" />
        <span>Export Data</span>
      </button>
    </div>
  )
}
