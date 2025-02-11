import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import PasswordInput from "./PasswordInput";

export default function PasswordVerify({ email }: { email: string }) {
  const router = useRouter();
  const [isLoading, startLoading] = useTransition();

  return (
    <form>
      <fieldset className="mb-4" key={"password"}>
        <Label htmlFor="password">Password*</Label>
        <PasswordInput name="password" />
      </fieldset>
      <div className="mb-7 flex items-center justify-end gap-4 text-accent max-md:text-xs">
        <Link
          className="py-0 text-primary underline underline-offset-2"
          href="/forgot-password"
        >
          Forgot password?
        </Link>
      </div>

      <div className="my-3">
        <Button disabled={isLoading} className="w-full" size="lg">
          {isLoading ? (
            <>
              Login <Loader2 className="size-4" />
            </>
          ) : (
            "Login"
          )}
        </Button>
      </div>
    </form>
  );
}
