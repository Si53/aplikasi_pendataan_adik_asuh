import { headers } from "next/headers"

/**
 * Mendapatkan IP Address client dari headers request.
 * Mendukung environment Vercel proxy (x-forwarded-for, x-real-ip, x-vercel-forwarded-for)
 * serta Cloudflare proxy (cf-connecting-ip).
 */
export async function getClientIp(): Promise<string> {
  try {
    const headerList = await headers()

    // 1. x-forwarded-for (Vercel / standard reverse proxy):
    // Format: "client, proxy1, proxy2" -> ambil IP paling pertama (client asli)
    const forwardedFor = headerList.get("x-forwarded-for")
    if (forwardedFor) {
      const firstIp = forwardedFor.split(",")[0].trim()
      if (firstIp) return firstIp
    }

    // 2. x-real-ip
    const realIp = headerList.get("x-real-ip")
    if (realIp?.trim()) {
      return realIp.trim()
    }

    // 3. x-vercel-forwarded-for (Vercel specific)
    const vercelIp = headerList.get("x-vercel-forwarded-for")
    if (vercelIp?.trim()) {
      return vercelIp.trim()
    }

    // 4. cf-connecting-ip (Cloudflare)
    const cfIp = headerList.get("cf-connecting-ip")
    if (cfIp?.trim()) {
      return cfIp.trim()
    }
  } catch {
    // Fallback jika dipanggil di luar HTTP request lifecycle
  }

  return "127.0.0.1"
}
