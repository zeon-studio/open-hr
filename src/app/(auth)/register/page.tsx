"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/layouts/components/ui/button";
import { Separator } from "@/layouts/components/ui/separator";
import facebookIcon from "@/public/images/svgs/facebook-colored.svg";
import googleIcon from "@/public/images/svgs/google.svg";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import PasswordInput from "../_components/PasswordInput";

function Register() {
  const [isLoading, starLoading] = useTransition();

  return (
    <>
      <section>
        <div className="container">
          <div className="dark-gradient-bg relative mx-auto w-full max-w-[360px] rounded-[20px] border border-border p-5 -tracking-[0.2px]">
            <div className="mb-4 grid grid-cols-2 gap-4">
              <Button
                className="h-auto border border-border px-3 py-[11px] text-text-dark"
                variant="basic"
                onClick={() => signIn("google")}
              >
                <Image src={googleIcon} alt="google" />
                Google
              </Button>
              {/* @TODO: remove disabled and make it work */}
              <Button
                className="h-auto border border-border px-3 py-[11px] text-text-dark disabled:opacity-50"
                variant="basic"
                disabled
              >
                <Image src={facebookIcon} alt="facebook" />
                Facebook
              </Button>
            </div>
            <div className="relative mb-3.5 py-3.5">
              <span className="absolute left-1/2 top-1/2 -mt-0.5 -translate-x-1/2 -translate-y-1/2 bg-background/50 font-medium leading-none text-text-light">
                or
              </span>
              <Separator />
            </div>

            <form>
              <fieldset className="mb-3">
                <Label htmlFor="user">First Name*</Label>
                <Input type="text" id="user" placeholder="Enter First Name" />
              </fieldset>
              <fieldset className="mb-3">
                <Label htmlFor="user">Last Name*</Label>
                <Input type="text" id="user" placeholder="Enter Last Name" />
              </fieldset>
              <fieldset className="mb-3">
                <Label htmlFor="user">Email*</Label>
                <Input type="text" id="user" placeholder="Enter Email" />
              </fieldset>
              <fieldset className="mb-3">
                <Label htmlFor="user">Password*</Label>
                <Input type="text" id="user" placeholder="Enter Password" />
              </fieldset>
              <fieldset className="mb-7">
                <Label htmlFor="user">Confirm Password*</Label>
                <Input
                  type="text"
                  id="user"
                  placeholder="Enter Confirm Password"
                />
              </fieldset>
              <fieldset className="mb-7">
                <Label htmlFor="password">Password*</Label>
                <PasswordInput name="password" />
              </fieldset>

              <div className="mb-3">
                <Button disabled={isLoading} className="w-full" size="lg">
                  {isLoading ? (
                    <>
                      Sign Up <Loader2 className="size-4" />
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-between gap-4 text-muted-foreground max-md:text-xs">
                <span>Already have an account?</span>
                <Link
                  className="py-0 text-primary underline underline-offset-2"
                  href="/login"
                >
                  Log in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default Register;
