import { PrismaClient } from "@/lib/generated/prisma"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const pengawas = [
  { username: "pati-kusnadi", name: "Pak Kusnadi", wilayah: "Pati" },
  { username: "pati-sukijo", name: "Pak Sukijo", wilayah: "Pati" },
  { username: "pati-nugraheni", name: "Ibu Nugraheni", wilayah: "Pati" },
  { username: "jepara-susilo", name: "Ibu Susilo", wilayah: "Jepara" },
  { username: "ampel-nining", name: "Ibu Nining", wilayah: "Ampel" },
  { username: "ampel-marni", name: "Ibu Marni", wilayah: "Ampel" },
  { username: "wonosobo-narman", name: "Pak Narman", wilayah: "Wonosobo" },
  { username: "sukabumi-deasy", name: "Ibu Deasy", wilayah: "Sukabumi" },
  { username: "bandung-sutrisno", name: "Pak Sutrisno", wilayah: "Bandung" },
]

async function main() {
  const pengawasPassword = "hidupadikasuh"
  const password = await bcrypt.hash(pengawasPassword, 12)

  for (const account of pengawas) {
    await prisma.pengawas.upsert({
      where: { username: account.username },
      update: { name: account.name, wilayah: account.wilayah, password },
      create: { ...account, password },
    })
  }

  console.log(`Seeded ${pengawas.length} Pengawas accounts.`)
  console.log(`Password Pengawas updated to: ${pengawasPassword}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
