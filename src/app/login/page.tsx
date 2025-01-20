"use client";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function SignIn() {
  const { data: session } = useSession();
  if (session?.user?.email) redirect("/");
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
