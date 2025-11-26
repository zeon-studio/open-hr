"use client";

import { Button } from "@/layouts/components/ui/button";
import { useResendOTPMutation } from "@/redux/features/authenticationApiSlice/authenticationSlice";
import { useEffect, useState, useRef } from "react";

export function Timer({ email }: { email: string }) {
  const [resendOTP, { isLoading }] = useResendOTPMutation();
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(59);

  const minutesRef = useRef(minutes);

  useEffect(() => {
    minutesRef.current = minutes;
  }, [minutes]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds > 0) {
          return prevSeconds - 1;
        }

        if (minutesRef.current === 0) {
          clearInterval(intervalId);
          return 0;
        }

        setMinutes((prevMinutes) => {
          const next = prevMinutes - 1;
          minutesRef.current = next;
          return next;
        });
        return 59;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
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
            minutesRef.current = 1;
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
