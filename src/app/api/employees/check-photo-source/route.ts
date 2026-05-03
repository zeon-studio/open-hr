import { hasGravatarByEmail } from "@/lib/gravatar";
import { NextResponse } from "next/server";

/**
 * POST /api/employees/check-photo-source
 * Checks if user has gravatar and returns photo source
 */
export async function POST(request: Request) {
  try {
    const { email, hasUploadedImage } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // If user has uploaded image, photo_source is "upload"
    if (hasUploadedImage) {
      return NextResponse.json({
        photo_source: "upload",
        hasPhoto: true,
      });
    }

    // Check if gravatar exists
    const hasGravatar = await hasGravatarByEmail(email);

    return NextResponse.json({
      photo_source: hasGravatar ? "gravatar" : null,
      hasPhoto: hasGravatar,
    });
  } catch (error) {
    console.error("Error checking photo source:", error);
    return NextResponse.json(
      { error: "Failed to check photo source" },
      { status: 500 },
    );
  }
}
