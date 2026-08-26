import Link from "next/link"
import Image from "next/image"
import { DoorOpen, Pencil } from "lucide-react"

export default function LandingPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-white">
      {/* 1. BAGIAN ATAS (~55% tinggi layar) */}
      <section className="relative flex min-h-[55dvh] flex-[1.2] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400 px-6 pt-10 pb-16 text-center">
        {/* Background decorative SVG pattern (Lotus & Dharmachakra) */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-15"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="lotus-dharma-pattern"
              width="120"
              height="120"
              patternUnits="userSpaceOnUse"
            >
              {/* Dharmachakra (Roda Dharma) */}
              <g transform="translate(30, 30)" className="text-white fill-current">
                <circle cx="0" cy="0" r="14" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="0" cy="0" r="4.5" fill="currentColor" />
                <line x1="0" y1="-14" x2="0" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="-14" y1="0" x2="14" y2="0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="-10" y1="-10" x2="10" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="-10" y1="10" x2="10" y2="-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* Bunga Teratai (Lotus) */}
              <g transform="translate(90, 90)" className="text-white fill-current">
                {/* Petal tengah */}
                <path d="M0,6 C-3.5,-1 -3.5,-11 0,-15 C3.5,-11 3.5,-1 0,6" />
                {/* Petal dalam kiri & kanan */}
                <path d="M-1.5,5 C-8,1 -11,-7 -8,-12 C-5,-13 -2.5,-6 -1.5,5" />
                <path d="M1.5,5 C8,1 11,-7 8,-12 C5,-13 2.5,-6 1.5,5" />
                {/* Petal luar kiri & kanan */}
                <path d="M-3,6 C-12,4 -15,-1 -13,-6 C-9,-7 -5,-1 -3,6" />
                <path d="M3,6 C12,4 15,-1 13,-6 C9,-7 5,-1 3,6" />
                {/* Dasar lotus */}
                <path d="M-7,7 Q0,11 7,7 Q0,9 -7,7" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lotus-dharma-pattern)" />
        </svg>

        {/* Logo & Judul */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          {/* Logo dalam lingkaran putih */}
          <div className="relative size-44 overflow-hidden rounded-full bg-white shadow-xl ring-4 ring-white/30 sm:size-48">
            <Image
              src="/logo-kakak-asuh-pvvd.png"
              alt="Logo Adik Asuh Vihara Vimala Dharma"
              fill
              priority
              sizes="(max-width: 640px) 176px, 192px"
              className="object-cover"
            />
          </div>

          {/* Judul Aplikasi */}
          <h1 className="text-2xl font-black tracking-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] sm:text-3xl max-w-xs sm:max-w-md leading-snug">
            Aplikasi Adik Asuh<br />Vihara Vimala Dharma
          </h1>
        </div>

        {/* Lengkungan / Wave di bagian bawah section oranye */}
        <div className="pointer-events-none absolute -bottom-px left-0 right-0 z-10 w-full overflow-hidden leading-none">
          <svg
            className="relative block h-9 w-full text-white fill-current sm:h-12"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
          >
            <path d="M0,32L48,42.7C96,53,192,75,288,74.7C384,75,480,53,576,42.7C672,32,768,32,864,42.7C960,53,1056,75,1152,74.7C1248,75,1344,53,1392,42.7L1440,32L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z" />
          </svg>
        </div>
      </section>

      {/* 2. BAGIAN BAWAH (area putih ~45% tinggi layar) */}
      <section className="relative flex min-h-[45dvh] flex-1 flex-col items-center justify-center overflow-hidden bg-white px-6 py-10">
        {/* Elemen dekoratif lingkaran peach/cream di pojok */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -left-16 size-56 rounded-full bg-orange-50/90 sm:size-72"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -right-20 size-64 rounded-full bg-amber-50/90 sm:size-80"
        />

        {/* Tombol Aksi */}
        <div className="relative z-10 flex w-full max-w-sm flex-col gap-4">
          {/* Tombol Masuk (Primary) */}
          <Link
            href="/login"
            className="group flex h-14 w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 px-6 text-lg font-bold text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:from-orange-600 hover:to-amber-600 hover:shadow-xl hover:shadow-orange-500/35 active:scale-[0.98]"
          >
            <DoorOpen
              className="size-6 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
            <span>Masuk</span>
          </Link>

          {/* Tombol Daftar (Secondary) */}
          <Link
            href="/daftar"
            className="group flex h-14 w-full items-center justify-center gap-3 rounded-full border-2 border-amber-400 bg-amber-50/40 px-6 text-lg font-bold text-amber-900 shadow-sm transition-all duration-200 hover:border-amber-500 hover:bg-amber-100/60 hover:shadow-md active:scale-[0.98]"
          >
            <Pencil
              className="size-5 text-amber-700 transition-transform duration-200 group-hover:-rotate-12"
              aria-hidden="true"
            />
            <span>Daftar</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
