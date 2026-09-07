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

  const totalStudentsCount = await prisma.student.count().catch(() => 0)
  const adminName = session.user.name || "Administrator"
  const adminEmail = session.user.email || ""

  return (
    <div className="min-h-screen bg-[#F9F6EE] text-stone-800 antialiased selection:bg-orange-500 selection:text-white">
      <AdminSidebar
        adminName={adminName}
        adminEmail={adminEmail}
        totalStudentsCount={totalStudentsCount}
      />
      <div className="lg:pl-64 flex min-h-screen flex-col">
        <main className="flex-1 w-full">{children}</main>
      </div>
    </div>
  )
}
