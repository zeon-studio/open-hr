import { withApiAuth } from "@/server/auth/api-auth";

export async function GET(
  _request: Request,
  context: { params: Promise<{ key: string[] }> },
) {
  const { error } = await withApiAuth();
  if (error) return error;

  const { key } = await context.params;
  const filePath = key.join("/");
  const base = process.env.BUCKET_URL || process.env.NEXT_PUBLIC_BUCKET_URL || "";
  return Response.json({ url: `${base}/${filePath}` });
}
