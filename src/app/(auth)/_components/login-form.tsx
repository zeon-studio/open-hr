"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/layouts/components/ui/button";
import { cn } from "@/lib/shadcn";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState, useTransition } from "react";
import PasswordInput from "./PasswordInput";

export default function EmailVerify() {
  const [isLoading, startLoading] = useTransition();

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startLoading(async () => {
      signIn("credentials", {
        email: loginInfo.email,
        password: loginInfo.password,
      });
    });
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <fieldset key={"email"}>
        <Label htmlFor="user">Email*</Label>
        <Input
          type="email"
          id="user"
          placeholder="Enter working email"
          value={loginInfo.email}
          required
          onChange={(e) =>
            setLoginInfo({ ...loginInfo, email: e.target.value })
          }
        />
      </fieldset>

      <fieldset>
        <Label htmlFor="password">Password*</Label>
        <PasswordInput
          id="password"
          name="password"
          placeholder="Enter password"
          value={loginInfo.password}
          required
          onChange={(e) =>
            setLoginInfo({ ...loginInfo, password: e.target.value })
          }
        />
      </fieldset>
      <div className="pb-4">
        <div className="flex items-center justify-end">
          <Link
            className={cn(
              buttonVariants({ variant: "link", className: "underline" })
            )}
            href="/forgot-password"
          >
            Forgot password?
          </Link>
        </div>

        <div className="my-3">
          <Button disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                Login
                <Loader2 className="size-4 ml-2 animate-spin" />
              </>
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
