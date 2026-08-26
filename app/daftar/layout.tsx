import Image from "next/image"

export default function DaftarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-[#faf3e8]">
      {/* Background fixed fullscreen (z-0 agar tidak tertutup background body, namun di bawah konten z-10) */}
      <div className="fixed inset-0 z-0 h-full w-full overflow-hidden pointer-events-none">
        <Image
          src="/bg-wizard-pendaftaran.png"
          alt="Background Wizard Pendaftaran"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Konten Form di atas background (z-10) */}
      <div className="relative z-10 w-full min-h-dvh">
        {children}
      </div>
    </div>
  )
}
