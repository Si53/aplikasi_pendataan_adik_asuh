import "server-only"
import { auth, signOut } from "@/auth"
import { cookies } from "next/headers"

export async function getCurrentUser() {
  const session = await auth()
  return session?.user ?? null
}

export async function getSessionUsername() {
  const session = await auth()
  return session?.user?.username ?? null
}

export async function clearSession() {
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()
  for (const c of allCookies) {
    if (
      c.name.includes("authjs") ||
      c.name.includes("next-auth") ||
      c.name.includes("adik_asuh") ||
      c.name.includes("session")
    ) {
      cookieStore.delete(c.name)
    }
  }
  try {
    await signOut({ redirect: false })
  } catch {
    // ignore
  }
}
