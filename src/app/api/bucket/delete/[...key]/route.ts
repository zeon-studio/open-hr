import variables from "@/config/variables";
import { apiError, apiSuccess } from "@/server/utils/api-response";
import { s3Client } from "@/server/storage/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ key: string[] }> },
) {
  try {
    const { key } = await context.params;
    const filePath = key.map(decodeURIComponent).join("/");

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: variables.dos_bucket_name!,
        Key: filePath,
      }),
    );

    return apiSuccess(true, "File deleted successfully");
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : "Delete failed",
      500,
    );
  }
}
