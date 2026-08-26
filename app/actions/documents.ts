"use server"

import { randomUUID } from "node:crypto"
import { uploadToR2 } from "@/lib/r2"

const allowedTypes = new Set(["KK", "RAPOR", "FOTO_ANAK"])
const allowedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/pjpeg",
  "application/octet-stream",
])

const allowedExtensions = new Set([
  "pdf",
  "jpg",
  "jpeg",
  "png",
  "webp",
  "heic",
  "heif",
])

const maxFileSize = 15 * 1024 * 1024 // 15 MB

export type UploadDocumentResult =
  | { success: true; fileUrl: string }
  | { success: false; error: string }

function isValidFileType(file: File): boolean {
  const extension = file.name.split(".").pop()?.toLowerCase() || ""
  if (allowedExtensions.has(extension)) return true
  if (allowedMimeTypes.has(file.type)) return true
  if (file.type.startsWith("image/")) return true
  return false
}

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

  if (!isValidFileType(file)) {
    return { success: false, error: "File harus berupa gambar (JPG/PNG/WEBP/HEIC) atau PDF." }
  }

  if (file.size > maxFileSize) {
    return { success: false, error: "Ukuran file terlalu besar (maksimal 15 MB). Silakan kompres berkas terlebih dahulu." }
  }

  try {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const key = `students/${studentId}/${type.toLowerCase()}-${randomUUID()}.${extension}`
    const contentType = file.type || (extension === "pdf" ? "application/pdf" : "image/jpeg")

    if (process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID) {
      await uploadToR2({
        key,
        body: new Uint8Array(await file.arrayBuffer()),
        contentType,
      })
      const publicUrl = process.env.R2_PUBLIC_URL
        ? `${process.env.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`
        : `/${key}`
      return { success: true, fileUrl: publicUrl }
    } else {
      const buffer = Buffer.from(await file.arrayBuffer())
      const base64 = `data:${contentType};base64,${buffer.toString("base64")}`
      return { success: true, fileUrl: base64 }
    }
  } catch (error) {
    console.error("[Document upload failed]", error)
    return { success: false, error: "Gagal mengunggah ke server. Periksa koneksi internet Anda dan coba lagi." }
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

  if (!isValidFileType(file)) {
    return { success: false, error: "File harus berupa gambar (JPG/PNG/WEBP/HEIC) atau PDF." }
  }

  if (file.size > maxFileSize) {
    return { success: false, error: "Ukuran file terlalu besar (maksimal 15 MB). Silakan kompres berkas terlebih dahulu." }
  }

  try {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const key = `registration/${username}/${type.toLowerCase()}-${randomUUID()}.${extension}`
    const contentType = file.type || (extension === "pdf" ? "application/pdf" : "image/jpeg")

    if (process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID) {
      await uploadToR2({
        key,
        body: new Uint8Array(await file.arrayBuffer()),
        contentType,
      })
      const publicUrl = process.env.R2_PUBLIC_URL
        ? `${process.env.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`
        : `/${key}`
      return { success: true, fileUrl: publicUrl }
    } else {
      const buffer = Buffer.from(await file.arrayBuffer())
      const base64 = `data:${contentType};base64,${buffer.toString("base64")}`
      return { success: true, fileUrl: base64 }
    }
  } catch (error) {
    console.error("[Registration document upload failed]", error)
    return { success: false, error: "Gagal mengunggah ke server. Periksa koneksi internet Anda dan coba lagi." }
  }
}
