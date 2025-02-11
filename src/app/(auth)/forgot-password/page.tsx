"use client";

import { useUserVerifyMutation } from "@/redux/features/authenticationApiSlice/authenticationSlice";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import Verify from "./_components/verify-otp";

function ForgotPassword() {
  const [showVerify, setShowVerify] = useState(false);
  const [email, setEmail] = useState("");
  const [userVerify, { isLoading }] = useUserVerifyMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await userVerify(email).unwrap();
    if (res.result.id) {
      setShowVerify(true);
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
