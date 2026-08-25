"use server"

import { randomUUID } from "node:crypto"
import { uploadToR2 } from "@/lib/r2"

const allowedTypes = new Set(["KK", "RAPOR", "FOTO_ANAK"])
const allowedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
])
const maxFileSize = 10 * 1024 * 1024

export type UploadDocumentResult =
  | { success: true; fileUrl: string }
  | { success: false; error: string }

export async function uploadDocumentAction(
  formData: FormData,
): Promise<UploadDocumentResult> {
  const studentId = String(formData.get("studentId") ?? "").trim()
  const type = String(formData.get("type") ?? "").trim()
  const file = formData.get("file")

  if (!/^\d+$/.test(studentId) || !allowedTypes.has(type)) {
    return { success: false, error: "Data dokumen tidak valid." }
  }

  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Silakan pilih file terlebih dahulu." }
  }

  if (!allowedMimeTypes.has(file.type)) {
    return { success: false, error: "File harus berupa gambar atau PDF." }
  }

  if (file.size > maxFileSize) {
    return { success: false, error: "Ukuran file maksimal 10 MB." }
  }

  try {
    const extension = file.name.split(".").pop()?.toLowerCase() || "bin"
    const key = `students/${studentId}/${type.toLowerCase()}-${randomUUID()}.${extension}`

    if (process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID) {
      await uploadToR2({
        key,
        body: new Uint8Array(await file.arrayBuffer()),
        contentType: file.type,
      })
      const publicUrl = process.env.R2_PUBLIC_URL
        ? `${process.env.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`
        : `/${key}`
      return { success: true, fileUrl: publicUrl }
    } else {
      const buffer = Buffer.from(await file.arrayBuffer())
      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`
      return { success: true, fileUrl: base64 }
    }
  } catch (error) {
    console.error("[v0] Document upload failed", error)
    return { success: false, error: "Upload gagal. Silakan coba lagi." }
  }
}

export async function uploadRegistrationDocumentAction(
  formData: FormData,
): Promise<UploadDocumentResult> {
  const type = String(formData.get("type") ?? "").trim()
  const username = String(formData.get("username") ?? "temp").trim()
  const file = formData.get("file")

  if (!allowedTypes.has(type)) {
    return { success: false, error: "Tipe dokumen tidak valid." }
  }

  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Silakan pilih file terlebih dahulu." }
  }

  if (!allowedMimeTypes.has(file.type)) {
    return { success: false, error: "File harus berupa gambar atau PDF." }
  }

  if (file.size > maxFileSize) {
    return { success: false, error: "Ukuran file maksimal 10 MB." }
  }

  try {
    const extension = file.name.split(".").pop()?.toLowerCase() || "bin"
    const key = `registration/${username}/${type.toLowerCase()}-${randomUUID()}.${extension}`

    if (process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID) {
      await uploadToR2({
        key,
        body: new Uint8Array(await file.arrayBuffer()),
        contentType: file.type,
      })
      const publicUrl = process.env.R2_PUBLIC_URL
        ? `${process.env.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`
        : `/${key}`
      return { success: true, fileUrl: publicUrl }
    } else {
      const buffer = Buffer.from(await file.arrayBuffer())
      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`
      return { success: true, fileUrl: base64 }
    }
  } catch (error) {
    console.error("[v0] Registration document upload failed", error)
    return { success: false, error: "Upload gagal. Silakan coba lagi." }
  }
}
