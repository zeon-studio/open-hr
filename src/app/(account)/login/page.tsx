"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-20 flex flex-col items-center rounded-lg bg-background">
        <h1 className="text-center">Welcome to Themefisher ERP</h1>
        <p className="text-center">
          Please login with your official google account
        </p>
        <div>
          <Button className="mt-5" onClick={() => signIn("google")}>
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
