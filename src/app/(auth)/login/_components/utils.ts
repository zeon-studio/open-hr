"use server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import "server-only";

export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    return await signIn("credentials", {
      email: email,
      password: password,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      const { message } = error.cause as {
        message: string;
      };

      switch ((error as AuthError & { type: string }).type) {
        case "CredentialsSignin": {
          return {
            success: false,
            error: {
              type: "AUTH_ERROR",
              message: error.message.substring(
                0,
                error.message.indexOf(". Read more")
              ),
              details: {
                originalError: "Unknown error occurred",
              },
            },
          };
        }
        case "AccessDenied":
          return {
            success: false,
            error: {
              type: "AUTH_ERROR",
              message: message,
              details: {
                originalError: "Access denied",
              },
            },
          };
        default:
          return {
            success: false,
            error: {
              type: "AUTH_ERROR",
              message: error.message,
              details: {
                originalError: "Unknown error occurred",
              },
            },
          };
      }
    }
    if (isRedirectError(error)) {
      throw error;
    }
  }
};
