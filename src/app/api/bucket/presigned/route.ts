import variables from "@/config/variables";
import { apiError, apiSuccess } from "@/server/utils/api-response";
import { s3Client } from "@/server/storage/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const key = String(body.key || `uploads/${Date.now()}`);
    const contentType = String(body.contentType || "application/octet-stream");

    const command = new PutObjectCommand({
      Bucket: variables.dos_bucket_name!,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return apiSuccess({ key, uploadUrl }, "presigned url generated");
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : "Failed to generate presigned URL",
      500,
    );
  }
}
