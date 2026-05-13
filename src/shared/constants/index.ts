export const MAX_SIZE = 1000000 * 10; // 10MB
export const MAX_FILES = 10;
export const AcceptImages = {
  "image/png": [],
  "image/jpg": [],
  "image/jpeg": [],
  "image/webp": [],
  "image/svg+xml": [".svg"],
  "application/pdf": [".pdf"],
};
export const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL;
