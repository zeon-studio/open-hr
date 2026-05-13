"use client";

import { clientApi } from "@/platform/network";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Verify from "./_components/verify-otp";

function ForgotPassword() {
  const [showVerify, setShowVerify] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await clientApi("/authentication/verify-user", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setShowVerify(true);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to send verification OTP",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {showVerify ? (
        <Verify email={email} />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <Label>Work Email:</Label>
            <Input
              type="email"
              placeholder="Enter work email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Button disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  Sending
                  <Loader2 className="size-4 animate-spin ml-2" />
                </>
              ) : (
                "Send OTP"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ForgotPassword;
