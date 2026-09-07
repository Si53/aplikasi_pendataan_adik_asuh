"use client"

import { Phone, Printer, ExternalLink } from "lucide-react"

interface AdminDetailBottomBarProps {
  pengawasName?: string
  pengawasPhone?: string | null
  studentName: string
}

export function AdminDetailBottomBar({
  pengawasName,
  pengawasPhone,
  studentName,
}: AdminDetailBottomBarProps) {
  const handlePrint = () => {
    window.print()
  }

  // Format Indonesian phone number to international WhatsApp format: 08xx -> 628xx
  const cleanPhone = pengawasPhone
    ? pengawasPhone.replace(/\D/g, "").replace(/^0/, "62")
    : null

  const waMessage = encodeURIComponent(
    `Halo ${pengawasName || "Pengawas"}, kami dari Admin Portal Kakak Asuh PVVD ingin berkoordinasi mengenai anak asuh ${studentName}.`
  )
  const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${waMessage}` : null

  return (
    <div className="sticky bottom-0 z-20 mt-8 -mx-4 sm:-mx-6 lg:-mx-8 border-t border-stone-200/90 bg-[#F9F6EE]/95 px-4 sm:px-6 lg:px-8 py-4 backdrop-blur-md shadow-lg print:hidden">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-stone-500 text-center sm:text-left">
          <span className="font-semibold text-stone-800">Lembar Monitoring Anak Asuh:</span>{" "}
          Data terintegrasi secara holistik dari Pengawas & Admin.
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Tombol Cetak Lembar */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-xs sm:text-sm font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition shadow-2xs cursor-pointer"
          >
            <Printer className="size-4 text-stone-500" />
            <span>Cetak Lembar</span>
          </button>

          {/* Tombol Hubungi Pengawas */}
          {waUrl ? (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-500 transition shadow-xs shadow-emerald-600/25 cursor-pointer"
            >
              <Phone className="size-4" />
              <span>Hubungi Pengawas</span>
              <ExternalLink className="size-3 text-emerald-200" />
            </a>
          ) : (
            <div className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-stone-100 px-4 py-2.5 text-xs font-semibold text-stone-400 cursor-not-allowed border border-stone-200/60">
              <Phone className="size-4" />
              <span>Nomor HP Pengawas Belum Tersedia</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
