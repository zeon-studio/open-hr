"use client";

import { Button, buttonVariants } from "@/layouts/components/ui/button";
import { cn } from "@/lib/shadcn";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import PasswordInput from "@/ui/password-input";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState, useTransition } from "react";

export default function LoginForm() {
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
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <Label htmlFor="user">Work Email:</Label>
        <Input
          type="email"
          id="user"
          placeholder="Enter work email"
          value={loginInfo.email}
          required
          onChange={(e) =>
            setLoginInfo({ ...loginInfo, email: e.target.value })
          }
        />
      </div>

      <div className="">
        <Label htmlFor="password">Password:</Label>
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
      </div>

      <div className="text-right mb-5">
        <Link
          className={cn(
            buttonVariants({
              variant: "link",
              className: "underline px-0 text-text-light",
            })
          )}
          href="/forgot-password"
        >
          Forgot password?
        </Link>
      </div>
      <div>
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
    </form>
  );
}
