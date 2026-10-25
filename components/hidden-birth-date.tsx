"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

interface HiddenBirthDateProps {
  value: string
  maskedPlaceholder?: string
  className?: string
}

export function HiddenBirthDate({
  value,
  maskedPlaceholder = "•• ••••••• ••••",
  className = "",
}: HiddenBirthDateProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={
          isVisible
            ? "font-bold text-foreground transition-all duration-150 select-text"
            : "font-bold text-stone-500 tracking-wider transition-all duration-150 select-none"
        }
      >
        {isVisible ? value || "-" : maskedPlaceholder}
      </span>
      <button
        type="button"
        onClick={() => setIsVisible((prev) => !prev)}
        aria-label={isVisible ? "Sembunyikan tanggal lahir" : "Tampilkan tanggal lahir"}
        title={isVisible ? "Sembunyikan tanggal lahir" : "Tampilkan tanggal lahir"}
        className="inline-flex size-9 sm:size-8 shrink-0 items-center justify-center rounded-xl bg-orange-100/70 hover:bg-orange-200/80 text-orange-700 active:scale-95 transition shadow-2xs cursor-pointer touch-manipulation focus:outline-none focus:ring-2 focus:ring-orange-500/30"
      >
        {isVisible ? (
          <EyeOff className="size-4" aria-hidden="true" />
        ) : (
          <Eye className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
