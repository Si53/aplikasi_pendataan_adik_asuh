import "server-only"
import { cookies } from "next/headers"

const COOKIE_NAME = "adik_asuh_username"

export async function setSession(username: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, username, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function getSessionUsername() {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value ?? null
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
