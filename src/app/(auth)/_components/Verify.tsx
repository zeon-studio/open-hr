import { Button } from "@/components/ui/button";

import { Label } from "@/layouts/components/ui/label";
import { Loader2 } from "lucide-react";
import PasswordInput from "./password-input";
import { Timer } from "./timer";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  useResetPasswordMutation,
  useVerifyOTPMutation,
} from "@/redux/features/authentication-slice/authentication-api-slice";
import { ErrorResponse } from "@/types";
import { useState } from "react";
import { toast } from "sonner";

export default function Verify({ email }: { email: string }) {
  const [showVerify, setShowVerify] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [otp, setOtp] = useState("");
  const [verifyOTP, { isLoading }] = useVerifyOTPMutation();
  const [resetPassword, { isLoading: isResetPasswordLoading }] =
    useResetPasswordMutation();
  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await verifyOTP({ email, otp }).unwrap();
      setShowVerify(true);
    } catch (error) {
      const errorMessage =
        (error as ErrorResponse).data.message || "Something went wrong";
      toast.error(errorMessage);
      setShowVerify(false);
    }
  };

  const validatePassword = () => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validatePassword()) {
      return;
    }
    try {
      await resetPassword({ email, password }).unwrap();
      toast.success("Password reset successfully");
    } catch (error) {
      const errorMessage =
        (error as ErrorResponse).data.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  return showVerify ? (
    <form className="space-y-3 text-left" onSubmit={handleResetPassword}>
      <div>
        <Label className="from-input inline-block">
          New Password
          <span className="text-destruction">*</span>
        </Label>
        <PasswordInput
          type="password"
          placeholder="new password"
          name="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <Label className="from-input inline-block">
          Confirm new password
          <span className="text-destruction">*</span>
        </Label>
        <PasswordInput
          type="password"
          placeholder="confirm new password"
          name="confirmPassword"
          value={confirmPassword}
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {passwordError && (
          <p className="mt-1 text-sm text-destructive">{passwordError}</p>
        )}
      </div>

      <div className="text-right">
        <Button
          disabled={isResetPasswordLoading}
          type="submit"
          variant={"outline"}
          className="mt-3"
        >
          {isResetPasswordLoading ? (
            <>
              Submitting
              <Loader2 className="size-4 animate-spin ml-2" />
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  ) : (
    <form className="space-y-3 text-left" onSubmit={handleVerify}>
      <div className="mb-4 text-left">
        <Label className="from-input mb-1 inline-block">
          OTP <span className="text-destructive">*</span>
        </Label>

        <div className="space-y-2">
          <InputOTP
            value={otp}
            onChange={(value) => setOtp(value)}
            maxLength={6}
          >
            <InputOTPGroup className="w-full">
              <InputOTPSlot className="w-full" index={0} />
              <InputOTPSlot className="w-full" index={1} />
              <InputOTPSlot className="w-full" index={2} />
              <InputOTPSlot className="w-full" index={3} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>
      <Timer email={email!} />
      <Button disabled={isLoading} type="submit" className="w-full">
        {isLoading ? (
          <>
            Verifying
            <Loader2 className="size-4 animate-spin ml-2" />
          </>
        ) : (
          "Verify"
        )}
      </Button>
    </form>
  );
}
