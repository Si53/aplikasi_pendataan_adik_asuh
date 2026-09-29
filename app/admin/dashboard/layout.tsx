import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { AdminSidebar } from "@/components/admin-sidebar"

export const dynamic = "force-dynamic"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  const totalStudentsCount = await prisma.student
    .count({
      where: { status: "approved" },
    })
    .catch(() => 0)
  const adminName = session.user.name || "Administrator"
  const adminEmail = session.user.email || ""

  return (
    <div className="relative min-h-screen text-stone-800 antialiased selection:bg-orange-500 selection:text-white">
      {/* 1. Background Fixed Fullscreen: Gradient Merah-Oranye Pekat & Motif Teratai/Roda Dharma */}
      <div
        className="fixed inset-0 -z-10 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400 pointer-events-none"
        aria-hidden="true"
      >
        <svg
          className="h-full w-full opacity-15 text-white fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="admin-lotus-dharma-pattern"
              width="120"
              height="120"
              patternUnits="userSpaceOnUse"
            >
              {/* Dharmachakra */}
              <g transform="translate(30, 30)">
                <circle cx="0" cy="0" r="14" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="0" cy="0" r="4.5" fill="currentColor" />
                <line x1="0" y1="-14" x2="0" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="-14" y1="0" x2="14" y2="0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="-10" y1="-10" x2="10" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="-10" y1="10" x2="10" y2="-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* Bunga Teratai (Lotus) */}
              <g transform="translate(90, 90)">
                <path d="M0,6 C-3.5,-1 -3.5,-11 0,-15 C3.5,-11 3.5,-1 0,6" />
                <path d="M-1.5,5 C-8,1 -11,-7 -8,-12 C-5,-13 -2.5,-6 -1.5,5" />
                <path d="M1.5,5 C8,1 11,-7 8,-12 C5,-13 2.5,-6 1.5,5" />
                <path d="M-3,6 C-12,4 -15,-1 -13,-6 C-9,-7 -5,-1 -3,6" />
                <path d="M3,6 C12,4 15,-1 13,-6 C9,-7 5,-1 3,6" />
                <path d="M-7,7 Q0,11 7,7 Q0,9 -7,7" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#admin-lotus-dharma-pattern)" />
        </svg>
      </div>

      {/* Sidebar & Konten Halaman */}
      <AdminSidebar
        adminName={adminName}
        adminEmail={adminEmail}
        totalStudentsCount={totalStudentsCount}
      />
      <div className="lg:pl-64 flex min-h-screen flex-col relative z-0">
        <main className="flex-1 w-full">{children}</main>
      </div>
    </div>
  )
}
