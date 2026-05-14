export async function GET(
  _request: Request,
  context: { params: Promise<{ key: string[] }> },
) {
  const { key } = await context.params;
  const filePath = key.join("/");
  const base = process.env.BUCKET_URL || process.env.NEXT_PUBLIC_BUCKET_URL || "";
  return Response.json({ url: `${base}/${filePath}` });
}
