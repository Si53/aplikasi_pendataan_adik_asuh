import { PrismaClient } from "./generated/prisma"

// The Neon integration exposes the connection string under NEON_POSTGRES_PRISMA_URL
// (and similar NEON_* variables) rather than the generic DATABASE_URL name that
// prisma/schema.prisma expects. Map it over before the client is constructed.
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    process.env.NEON_POSTGRES_PRISMA_URL ?? process.env.NEON_DATABASE_URL ?? process.env.NEON_POSTGRES_URL
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
