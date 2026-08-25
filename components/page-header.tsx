import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function PageHeader({
  title,
  backHref,
  className,
  titleClassName,
}: {
  title: string
  backHref: string
  className?: string
  titleClassName?: string
}) {
  return (
    <header className={`flex items-center gap-3 px-5 pb-2 pt-6 ${className || ""}`}>
      <Link
        href={backHref}
        aria-label="Kembali"
        className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/85 text-foreground backdrop-blur-md shadow-sm border border-white/60 transition-colors hover:bg-white"
      >
        <ArrowLeft className="size-5" aria-hidden="true" />
      </Link>
      <h1
        className={`text-balance text-2xl font-extrabold text-foreground ${
          titleClassName || ""
        }`}
      >
        {title}
      </h1>
    </header>
  )
}
