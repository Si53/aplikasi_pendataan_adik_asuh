import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function PageHeader({
  title,
  backHref,
}: {
  title: string
  backHref: string
}) {
  return (
    <header className="flex items-center gap-3 px-5 pb-2 pt-6">
      <Link
        href={backHref}
        aria-label="Kembali"
        className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground transition-colors hover:bg-accent"
      >
        <ArrowLeft className="size-5" aria-hidden="true" />
      </Link>
      <h1 className="text-balance text-2xl font-extrabold text-foreground">{title}</h1>
    </header>
  )
}
