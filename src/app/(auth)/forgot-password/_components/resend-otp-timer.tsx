"use client";

import { Button } from "@/layouts/components/ui/button";
import { clientApi } from "@/platform/network";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function Timer({ email }: { email: string }) {
  const [isLoading, setIsLoading] = useState(false);
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
            setIsLoading(true);
            clientApi("/authentication/resend-otp", {
              method: "POST",
              body: JSON.stringify({ email }),
            })
              .catch((error) => {
                toast.error(
                  error instanceof Error
                    ? error.message
                    : "Failed to resend OTP",
                );
              })
              .finally(() => {
                setIsLoading(false);
              });
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
