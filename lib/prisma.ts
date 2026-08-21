import { PrismaClient } from "./generated/prisma"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const databaseUrl =
  process.env.DATABASE_URL ??
  process.env.NEON_POSTGRES_PRISMA_URL ??
  process.env.NEON_DATABASE_URL ??
  process.env.NEON_POSTGRES_URL

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(databaseUrl ? { datasourceUrl: databaseUrl } : undefined)

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
