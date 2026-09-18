import NextAuth, { type DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

import { getClientIp } from "@/lib/ip"

declare module "next-auth" {
  interface User {
    role?: "STUDENT" | "PENGAWAS" | "ADMIN"
    username?: string
    wilayah?: string
  }
  interface Session {
    user: {
      id: string
      role?: "STUDENT" | "PENGAWAS" | "ADMIN"
      username?: string
      wilayah?: string
    } & DefaultSession["user"]
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      id: "credentials-student",
      name: "Adik Asuh",
      credentials: {
        identifier: { label: "Username / NIK", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier) return null
        const identifier = String(credentials.identifier).trim()

        // 1 & 2. Cek rate limit IP dalam 15 menit terakhir
        const ipAddress = await getClientIp()
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)
        const recentAttempts = await prisma.loginAttempt.count({
          where: {
            ipAddress,
            createdAt: { gte: fifteenMinutesAgo },
          },
        })

        // 3. Tolak login jika sudah mencapai 7 percobaan gagal
        if (recentAttempts >= 7) {
          throw new Error("Terlalu banyak percobaan dari perangkat ini (7/7). Coba lagi dalam beberapa menit.")
        }

        // 4. Cari student
        const student = await prisma.student.findFirst({
          where: {
            OR: [{ username: identifier }, { nik: identifier }],
          },
        })

        // Setiap kali identifier tidak ditemukan, catat percobaan gagal di LoginAttempt
        if (!student) {
          await prisma.loginAttempt.create({
            data: { ipAddress },
          })
          return null
        }

        // 5. JIKA identifier DITEMUKAN, tidak perlu mencatat LoginAttempt
        if (student.status !== "approved") return null

        return {
          id: String(student.id),
          name: student.fullName,
          role: "STUDENT",
          username: student.username,
          wilayah: student.wilayah,
        }
      },
    }),
    Credentials({
      id: "credentials-pengawas",
      name: "Pengawas",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null
        const username = String(credentials.username).trim()
        const password = String(credentials.password)

        const pengawas = await prisma.pengawas.findUnique({
          where: { username },
        })
        if (!pengawas || !pengawas.password) return null

        // Cek apakah akun pengawas sedang dinonaktifkan
        if (pengawas.status === "nonaktif") {
          throw new Error("Akun Anda sedang dinonaktifkan, silakan hubungi Admin")
        }

        // 1. Cek apakah akun pengawas sedang terkunci (lockedUntil masih di masa depan)
        if (pengawas.lockedUntil && new Date(pengawas.lockedUntil) > new Date()) {
          const lockTimeStr = new Date(pengawas.lockedUntil).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
          throw new Error(`Terlalu banyak percobaan gagal. Coba lagi setelah ${lockTimeStr}.`)
        }

        // 2. Verifikasi password dengan bcrypt
        const isValid = await bcrypt.compare(password, pengawas.password)
        if (!isValid) {
          const nextAttempts = (pengawas.failedLoginAttempts || 0) + 1
          const isLocking = nextAttempts >= 7
          const lockDate = isLocking ? new Date(Date.now() + 15 * 60 * 1000) : null

          await prisma.pengawas.update({
            where: { id: pengawas.id },
            data: {
              failedLoginAttempts: nextAttempts,
              lockedUntil: lockDate ?? pengawas.lockedUntil,
            },
          })

          if (isLocking && lockDate) {
            const lockTimeStr = lockDate.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
            throw new Error(`Terlalu banyak percobaan gagal. Coba lagi setelah ${lockTimeStr}.`)
          }

          return null
        }

        // 3. Password BENAR: reset failedLoginAttempts = 0, lockedUntil = null
        if (pengawas.failedLoginAttempts > 0 || pengawas.lockedUntil) {
          await prisma.pengawas.update({
            where: { id: pengawas.id },
            data: {
              failedLoginAttempts: 0,
              lockedUntil: null,
            },
          })
        }

        return {
          id: String(pengawas.id),
          name: pengawas.name,
          role: "PENGAWAS",
          username: pengawas.username,
          wilayah: pengawas.wilayah,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user?.email) return false
        const admin = await prisma.admin.findUnique({
          where: { email: user.email.toLowerCase().trim() },
        })
        if (!admin) {
          return false
        }
        return true
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
        token.username = user.username
        token.wilayah = user.wilayah
        token.id = user.id
      }
      if (account?.provider === "google" && token.email) {
        const admin = await prisma.admin.findUnique({
          where: { email: token.email.toLowerCase().trim() },
        })
        if (admin) {
          token.role = "ADMIN"
          token.id = String(admin.id)
          token.name = admin.name
        }
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token) {
        session.user.role = token.role as "STUDENT" | "PENGAWAS" | "ADMIN" | undefined
        session.user.username = token.username as string | undefined
        session.user.wilayah = token.wilayah as string | undefined
        session.user.id = (token.id ?? token.sub) as string
        if (token.name) {
          session.user.name = token.name
        }
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "adikasuh-v2-super-secret-key-2026-auth",
  trustHost: true,
})
