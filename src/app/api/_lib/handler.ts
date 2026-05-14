import { connectMongoose } from "@/server/db/mongoose";
import { apiError } from "@/server/utils/api-response";
import { NextResponse } from "next/server";

export const withDb = async (
  fn: () => Promise<NextResponse>,
): Promise<NextResponse> => {
  try {
    await connectMongoose();
    return await fn();
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : "Internal server error",
      500,
    );
  }
};
