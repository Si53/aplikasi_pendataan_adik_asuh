import { redirect } from "next/navigation"
import { auth } from "@/auth"

export default async function AdminRootPage() {
  const session = await auth()
  if (session?.user?.role === "ADMIN") {
    redirect("/admin/dashboard")
  }
  redirect("/admin/login")
}
