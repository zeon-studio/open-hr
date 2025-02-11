import { Button } from "@/layouts/components/ui/button";
import { useResendOTPMutation } from "@/redux/features/authenticationApiSlice/authenticationSlice";
import { useEffect, useState } from "react";

export function Timer({ email }: { email: string }) {
  const [resendOTP, { isLoading }] = useResendOTPMutation();
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    setMinutes(1);
    setSeconds(59);
  }, []);

  return (
    <div className="flex items-center justify-between">
      {(seconds > 0 || minutes > 0) && (
        <p>
          Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:
          {seconds < 10 ? `0${seconds}` : seconds}
        </p>
      )}
      {
        <Button
          type="button"
          variant={"link"}
          onClick={() => {
            setMinutes(1);
            setSeconds(59);
            resendOTP({ email });
          }}
          className="ml-auto text-right"
          disabled={minutes !== 0 || seconds !== 0 || isLoading}
        >
          Resend
        </Button>
      }
    </div>
  );
}
