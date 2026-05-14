import variables from "@/config/variables";
import { apiError, apiSuccess } from "@/server/utils/api-response";
import { s3Client } from "@/server/storage/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = String(formData.get("folder") || "misc");

    if (!file) {
      return apiError("No file provided", 400);
    }

    const fileName = `${folder}/${Date.now()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await s3Client.send(
      new PutObjectCommand({
        Bucket: variables.dos_bucket_name!,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
        ACL: "public-read",
      }),
    );

    return apiSuccess({ key: fileName }, "file uploaded successfully");
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : "Upload failed",
      500,
    );
  }
}
