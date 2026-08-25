import NextAuth, { type DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

declare module "next-auth" {
  interface User {
    role?: "STUDENT" | "PENGAWAS"
    username?: string
    wilayah?: string
  }
  interface Session {
    user: {
      id: string
      role?: "STUDENT" | "PENGAWAS"
      username?: string
      wilayah?: string
    } & DefaultSession["user"]
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "credentials-student",
      name: "Adik Asuh",
      credentials: {
        identifier: { label: "Username / NIK", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier) return null
        const identifier = String(credentials.identifier).trim()
        const student = await prisma.student.findFirst({
          where: {
            OR: [{ username: identifier }, { nik: identifier }],
          },
        })
        if (!student) return null
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

        const isValid = await bcrypt.compare(password, pengawas.password)
        if (!isValid) return null

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
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.username = user.username
        token.wilayah = user.wilayah
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token) {
        session.user.role = token.role as "STUDENT" | "PENGAWAS" | undefined
        session.user.username = token.username as string | undefined
        session.user.wilayah = token.wilayah as string | undefined
        session.user.id = (token.id ?? token.sub) as string
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
