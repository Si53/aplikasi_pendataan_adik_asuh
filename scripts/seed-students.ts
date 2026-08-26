import { PrismaClient } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

async function main() {
  const kusnadi = await prisma.pengawas.findUnique({ where: { username: "pati-kusnadi" } })
  const sukijo = await prisma.pengawas.findUnique({ where: { username: "pati-sukijo" } })

  if (!kusnadi || !sukijo) return

  // Seed sample student for Kusnadi (Binaan Kusnadi)
  await prisma.student.upsert({
    where: { username: "sion88" },
    update: {},
    create: {
      username: "sion88",
      nik: "3318010101010001",
      fullName: "sion marcelyo",
      dateOfBirth: new Date("2010-05-15"),
      gender: "Laki-laki",
      citaCita: "Dokter",
      wilayah: "Pati",
      pengawasId: kusnadi.id,
      alamatLengkap: "Jl. Pemuda No. 12, RT 02/RW 03, Pati",
      noHp: "081234567890",
      riwayatPenyakit: "-",
      schoolName: "SMP Negeri 1 Pati",
      gradeLevel: "Kelas 8",
      nilaiRataRata: "88.5",
      jumlahSaudara: 2,
      educationCosts: {
        create: [
          { label: "SPP Bulanan", amount: 150000 },
          { label: "Uang Buku & LKS", amount: 250000 },
        ],
      },
      father: {
        create: {
          name: "Joko anwar",
          status: "Sehat",
          occupation: "wirawasta",
          incomePerMonth: "Rp 7.200.000 / bulan",
          address: "Jl. Pemuda No. 12, Pati",
          phone: "081298765432",
          medicalHistory: "-",
        },
      },
      mother: {
        create: {
          name: "Sarwendah",
          status: "Sehat",
          occupation: "Ibu Rumah Tangga",
          incomePerMonth: "Rp 0",
          address: "Jl. Pemuda No. 12, Pati",
          phone: "081298765433",
          medicalHistory: "-",
        },
      },
    },
  })

  // Seed sample student for Sukijo (Sewilayah with Kusnadi)
  await prisma.student.upsert({
    where: { username: "vine99" },
    update: {},
    create: {
      username: "vine99",
      nik: "3318010202020002",
      fullName: "Vinechie",
      dateOfBirth: new Date("2011-08-20"),
      gender: "Perempuan",
      citaCita: "Guru",
      wilayah: "Pati",
      pengawasId: sukijo.id,
      alamatLengkap: "Desa Tambaharjo RT 01/RW 02, Pati",
      noHp: "082345678901",
      riwayatPenyakit: "Asma ringan",
      schoolName: "SMP Negeri 2 Pati",
      gradeLevel: "Kelas 7",
      nilaiRataRata: "91.0",
      jumlahSaudara: 1,
      educationCosts: {
        create: [
          { label: "SPP Bulanan", amount: 120000 },
          { label: "Transportasi", amount: 100000 },
        ],
      },
      father: {
        create: {
          name: "Bambang Lestari",
          status: "Sehat",
          occupation: "Pedagang Kaki Lima",
          incomePerMonth: "Rp 6.500.000 / bulan",
          address: "Desa Tambaharjo, Pati",
          phone: "082398765431",
          medicalHistory: "-",
        },
      },
      mother: {
        create: {
          name: "Endang Suparni",
          status: "Sehat",
          occupation: "Penjahit",
          incomePerMonth: "Rp 800.000 / bulan",
          address: "Desa Tambaharjo, Pati",
          phone: "082398765432",
          medicalHistory: "-",
        },
      },
    },
  })

  console.log("Sample students seeded successfully.")
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())
