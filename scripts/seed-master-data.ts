import { PrismaClient } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

const DEFAULT_REGIONS = [
  "Pati",
  "Jepara",
  "Ampel",
  "Wonosobo",
  "Sukabumi",
  "Bandung",
]

const DEFAULT_RATES = [
  { jenjang: "SD", nominal: 250000 },
  { jenjang: "SMP", nominal: 300000 },
  { jenjang: "SMA", nominal: 400000 },
  { jenjang: "SMK", nominal: 400000 },
  { jenjang: "Kuliah", nominal: 500000 },
]

async function main() {
  console.log("Seeding default regions...")
  for (const name of DEFAULT_REGIONS) {
    await prisma.region.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }

  console.log("Seeding default scholarship rates...")
  for (const rate of DEFAULT_RATES) {
    await prisma.scholarshipRate.upsert({
      where: { jenjang: rate.jenjang },
      update: {},
      create: { jenjang: rate.jenjang, nominal: rate.nominal },
    })
  }

  console.log("Master data seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

