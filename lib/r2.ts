import "server-only"

import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const accountId = process.env.R2_ACCOUNT_ID
const accessKeyId = process.env.R2_ACCESS_KEY_ID
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
const bucketName = process.env.R2_BUCKET_NAME

function getR2Client() {
  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    return null
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  })
}

export async function uploadToR2({
  key,
  body,
  contentType,
}: {
  key: string
  body: Uint8Array
  contentType: string
}) {
  const client = getR2Client()
  if (!client || !bucketName) {
    throw new Error("Cloudflare R2 belum dikonfigurasi")
  }

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  )

  return key
}

/**
 * Generate Presigned URL sementara yang aman untuk mengakses berkas R2 privat.
 * Berlaku selama durasi `expiresIn` detik (default: 3600 detik / 1 jam).
 */
export async function getPresignedR2Url(fileUrlOrKey: string, expiresIn = 3600): Promise<string> {
  if (!fileUrlOrKey) return ""

  // Jika berupa data base64 (fallback lokal), kembalikan langsung
  if (fileUrlOrKey.startsWith("data:")) return fileUrlOrKey

  const client = getR2Client()
  if (!client || !bucketName) {
    return fileUrlOrKey
  }

  // Ekstrak R2 Object Key dari URL atau path
  let key = fileUrlOrKey
  if (fileUrlOrKey.startsWith("http://") || fileUrlOrKey.startsWith("https://")) {
    try {
      const parsed = new URL(fileUrlOrKey)
      key = parsed.pathname.replace(/^\/+/, "")
    } catch {
      key = fileUrlOrKey
    }
  } else {
    key = fileUrlOrKey.replace(/^\/+/, "")
  }

  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
    return await getSignedUrl(client, command, { expiresIn })
  } catch (error) {
    console.error("[getPresignedR2Url Error]", error)
    return fileUrlOrKey
  }
}
