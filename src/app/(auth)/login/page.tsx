"use client";

import googleIcon from "@/assets/images/google.svg";
import { Button } from "@/layouts/components/ui/button";
import { Separator } from "@/layouts/components/ui/separator";
import { signIn } from "next-auth/react";
import Image from "next/image";
import LoginForm from "./_components/login-form";

export default function Login() {
  return (
    <>
      <div className="w-full">
        <p className="text-center text-text-light">
          Login with your official google account
        </p>
        <div className="mb-6 w-full">
          <Button
            variant="outline"
            className="mt-5 w-full flex items-center justify-center"
            onClick={() => signIn("google")}
          >
            <Image src={googleIcon} alt="google" className="size-5 mr-2" />
            Sign in with Google
          </Button>
        </div>

        <div className="relative mb-4">
          <span className="absolute left-1/2 top-1/2 -mt-0.5 -translate-x-1/2 -translate-y-1/2 bg-background font-medium leading-none text-text-light px-3">
            or
          </span>
          <Separator />
        </div>

        <LoginForm />
      </div>
    </>
  );
}
