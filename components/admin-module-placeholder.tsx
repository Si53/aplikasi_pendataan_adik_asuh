import Link from "next/link"
import { Construction, Sparkles, ArrowRight } from "lucide-react"

type AdminModulePlaceholderProps = {
  title: string
  subtitle: string
  moduleNumber: string
}

export function AdminModulePlaceholder({
  title,
  subtitle,
  moduleNumber,
}: AdminModulePlaceholderProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col items-center text-center rounded-3xl border border-stone-200/90 bg-white p-8 sm:p-12 shadow-xs">
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-orange-50 border border-orange-200/60 text-orange-600">
          <Construction className="size-8 animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100/70 px-3 py-1 text-[11px] font-bold text-orange-700 mb-3 border border-orange-200/60">
          <Sparkles className="size-3 text-orange-600" />
          <span>{moduleNumber}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          {title}
        </h1>
        <p className="mt-2 text-sm text-stone-500 max-w-md">
          {subtitle}
        </p>

        <div className="mt-6 rounded-2xl bg-stone-50 border border-stone-200/70 px-6 py-4 w-full max-w-md">
          <p className="text-xs font-bold text-amber-700 flex items-center justify-center gap-2">
            <span className="size-2 rounded-full bg-amber-500 animate-ping" />
            Modul sedang disiapkan
          </p>
          <p className="mt-1 text-xs text-stone-500">
            Fitur ini akan segera diaktifkan pada tahapan implementasi berikutnya.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link
            href="/admin/dashboard/data-anak-asuh"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-5 py-2.5 text-xs font-bold text-white transition shadow-xs shadow-orange-500/25"
          >
            <span>Buka Data Anak Asuh</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
