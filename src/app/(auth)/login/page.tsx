"use client";
import { Button } from "@/layouts/components/ui/button";
import { Separator } from "@/layouts/components/ui/separator";

import googleIcon from "@/assets/images/google.svg";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { use, useState } from "react";
import EmailVerify from "../_components/login-form";
import PasswordVerify from "../_components/PasswordVerify";
import Verify from "../_components/Verify";

export default function Login({
  searchParams,
}: {
  searchParams: Promise<{
    otpVerified: string;
    resetPassword: string;
    updatePassword: string;
    isUserExit: string;
  }>;
}) {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const searchparams = use(searchParams);
  const isUserExit = searchparams.isUserExit === "true";
  const showVerify =
    searchparams.otpVerified === "true" ||
    searchparams.resetPassword === "true" ||
    searchparams.updatePassword === "true";

  return (
    <>
      <div className="w-full">
        {showVerify ? (
          <Verify {...loginInfo} />
        ) : (
          <>
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

            {!isUserExit ? (
              <EmailVerify setLoginInfo={setLoginInfo} />
            ) : (
              <PasswordVerify {...loginInfo} />
            )}
          </>
        )}
      </div>
    </>
  );
}
