"use client"

import { useState } from "react"
import { Download, Plus, Sparkles, X, Info } from "lucide-react"

export function AdminDataHeaderActions() {
  const [showAddModal, setShowAddModal] = useState(false)

  const handleTriggerExport = () => {
    const trigger = document.getElementById("btn-export-csv-trigger")
    if (trigger) {
      trigger.click()
    }
  }

  return (
    <>
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

        {/* Tombol Tambah Anak Asuh */}
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-orange-600 shadow-xs shadow-orange-500/25 transition cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Tambah Anak Asuh</span>
        </button>
      </div>

      {/* Placeholder Modal for Tambah Anak Asuh */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="flex size-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <Plus className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Tambah Anak Asuh
                  </h3>
                  <p className="text-xs text-stone-500">
                    Form Pendaftaran Baru oleh Admin
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-stone-600">
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-amber-900">
                <div className="flex items-start gap-2">
                  <Info className="size-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Mode Pendaftaran Aktif</p>
                    <p className="mt-1 text-[11px] text-amber-800 leading-relaxed">
                      Pendaftaran saat ini dapat dilakukan langsung melalui portal
                      pendaftaran calon adik asuh (<code className="bg-amber-100 px-1 py-0.5 rounded font-mono">/daftar</code>)
                      atau verifikasi pengawas.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-stone-500 leading-relaxed text-[11px]">
                Fitur input manual langsung dari Admin Dashboard dengan upload berkas
                instan akan diintegrasikan pada fase selanjutnya.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl bg-stone-100 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-200"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
