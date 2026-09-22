import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  endpoint: process.env.STORAGE_ENDPOINT,
  region: "us-east-1", // MinIO ігнорує регіон, значення потрібне лише для SDK
  forcePathStyle: true, // обов'язково для MinIO (bucket.endpoint/… не підтримується)
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY!,
    secretAccessKey: process.env.STORAGE_SECRET_KEY!,
  },
});

const BUCKET = process.env.STORAGE_BUCKET!;

/**
 * Завантажує файл у сховище й повертає відносний ключ (наприклад "works/абв123.jpg"),
 * а НЕ повну URL — повний URL збирається окремо через getPublicUrl() з
 * STORAGE_PUBLIC_BASE_URL, щоб переїзд сховища не вимагав правок у базі даних.
 */
export async function uploadFile(
  folder: string,
  file: File,
): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const key = `${folder}/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
    }),
  );

  return key;
}

export async function deleteFile(key: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

export function getPublicUrl(key: string | null | undefined): string | null {
  if (!key) return null;
  return `${process.env.STORAGE_PUBLIC_BASE_URL}/${key}`;
}
