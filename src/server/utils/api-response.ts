import { NextResponse } from "next/server";

export const apiSuccess = <T>(result: T, message = "success", meta?: unknown) =>
  NextResponse.json(
    {
      success: true,
      message,
      result,
      ...(meta ? { meta } : {}),
    },
    { status: 200 },
  );

export const apiError = (
  message: string,
  status = 400,
  errorMessage: { path: string; message: string }[] = [],
) =>
  NextResponse.json(
    {
      success: false,
      message,
      errorMessage,
    },
    { status },
  );
