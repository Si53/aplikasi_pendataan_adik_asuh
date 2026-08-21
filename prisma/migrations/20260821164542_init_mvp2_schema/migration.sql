-- CreateTable
CREATE TABLE "pengawas" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "wilayah" TEXT NOT NULL,

    CONSTRAINT "pengawas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "cita_cita" TEXT NOT NULL,
    "wilayah" TEXT NOT NULL,
    "pengawas_id" INTEGER NOT NULL,
    "alamat_lengkap" TEXT NOT NULL,
    "no_hp" TEXT NOT NULL,
    "riwayat_penyakit" TEXT NOT NULL,
    "school_name" TEXT NOT NULL,
    "grade_level" TEXT NOT NULL,
    "nilai_rata_rata" TEXT NOT NULL,
    "jumlah_saudara" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education_costs" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "education_costs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fathers" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "income_per_month" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "medical_history" TEXT NOT NULL,

    CONSTRAINT "fathers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mothers" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "income_per_month" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "medical_history" TEXT NOT NULL,

    CONSTRAINT "mothers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guardians" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "income_per_month" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "medical_history" TEXT NOT NULL,

    CONSTRAINT "guardians_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pengawas_username_key" ON "pengawas"("username");

-- CreateIndex
CREATE UNIQUE INDEX "students_username_key" ON "students"("username");

-- CreateIndex
CREATE UNIQUE INDEX "students_nik_key" ON "students"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "fathers_student_id_key" ON "fathers"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "mothers_student_id_key" ON "mothers"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "guardians_student_id_key" ON "guardians"("student_id");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_pengawas_id_fkey" FOREIGN KEY ("pengawas_id") REFERENCES "pengawas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education_costs" ADD CONSTRAINT "education_costs_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fathers" ADD CONSTRAINT "fathers_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mothers" ADD CONSTRAINT "mothers_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guardians" ADD CONSTRAINT "guardians_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
