"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserVerifyMutation } from "@/redux/features/authentication-slice/authentication-api-slice";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import Verify from "../_components/verify";

function Page() {
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
          <fieldset className="mb-7">
            <Label htmlFor="user">
              Working Email
              <span className="text-destruction">*</span>
            </Label>
            <Input
              type="email"
              id="user"
              placeholder="Enter working email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </fieldset>
          <div className="mb-3">
            <Button disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  Sending
                  <Loader2 className="size-4 animate-spin ml-2" />
                </>
              ) : (
                "Send"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Page;
