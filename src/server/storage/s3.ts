import { S3Client } from "@aws-sdk/client-s3";
import variables from "@/config/variables";

export const s3Client = new S3Client({
  endpoint: `https://${variables.dos_region}.digitaloceanspaces.com`,
  region: variables.dos_region,
  credentials: {
    accessKeyId: variables.dos_public_access_key!,
    secretAccessKey: variables.dos_public_secret_key!,
  },
});
