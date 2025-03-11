"use client";

import { Confetti } from "@/components/icons";
import Loader from "@/components/loader";
import { checkCompletion } from "@/lib/check-completion";
import { useGetEmployeeDetailsByTokenQuery } from "@/redux/features/employeeApiSlice/employeeSlice";
import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";
import { useAppSelector } from "@/redux/hook";
import { buttonVariants } from "@/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { withStepperProvider } from "./_components/stepper-provider";
import { useStepper } from "./_components/use-stepper";

function OnBoarding() {
  const { status, data: session } = useSession();
  const [employeeId, setEmployeeId] = useState<string>("");

  const { company_name, logo_url } = useAppSelector(
    (state) => state["setting-slice"]
  );
  const params = useSearchParams();
  const token = params?.get("token") as string;
  const { steppers, currentStep, handleStepChange, completedSteps } =
    useStepper();
  const { data, isLoading, isSuccess } = useGetEmployeeDetailsByTokenQuery(
    {
      token: token,
    },
    {
      skip: !token,
    }
  );

  useEffect(() => {
    if (status === "authenticated") {
      handleStepChange(steppers.map((step) => step.id));
    } else if (isSuccess && data.result) {
      const ids = checkCompletion(data.result!);
      handleStepChange(ids);
      setEmployeeId(data?.result?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.result?.id, isSuccess, status]);
  const isCompleted = completedSteps.length == steppers.length;

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (
    !isLoading &&
    !data?.result?.personal_email &&
    status !== "authenticated"
  ) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="!max-w-[640px] w-full mx-auto py-20 text-center">
          <Card>
            <CardHeader>
              <CardTitle>Sorry Invalid Token</CardTitle>
            </CardHeader>
            <CardContent className="space-x-4">
              <Link
                href="/onboard?token=invalid-token"
                className={buttonVariants({ variant: "outline" })}
              >
                Try again
              </Link>

              <Link href="/" className={buttonVariants({ variant: "outline" })}>
                Go to Home
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light">
      <div className="!max-w-[640px] w-full mx-auto py-20 text-center">
        <img
          className="mx-auto mb-4"
          src={logo_url}
          width={61}
          height={64}
          alt="logo"
        />
        <h2>
          Welcome to {company_name}
          <Confetti className="inline-block ml-3 mb-4" />
        </h2>
        <p>Let's get you set up with everything you need to get started.</p>

        {!isCompleted && (
          <div className="space-y-4 mt-12 text-left">
            {steppers.map((stepper) => {
              // @ts-ignore
              const Component = stepper.component as ({
                isCompleted,
              }: {
                isActive: boolean;
                token: string;
                employeeId: string;
                isCompleted: boolean;
                currentStep: number;
                value: any;
                handleStepChange: (stepIndex?: number) => void;
              }) => React.JSX.Element;

              return (
                <Component
                  token={token}
                  employeeId={employeeId}
                  handleStepChange={handleStepChange}
                  currentStep={currentStep}
                  isCompleted={completedSteps.includes(stepper.id)}
                  isActive={currentStep === stepper.id}
                  key={stepper.id}
                  value={
                    stepper.name === "onboarding_form"
                      ? data?.result
                      : data?.result?.[stepper.name as keyof TEmployee]
                  }
                />
              );
            })}
          </div>
        )}

        {isCompleted && (
          <Card className="border-none mt-12">
            <CardHeader className="border-none">
              <CardTitle className="mb-3 text-2xl">
                Thanks, {session?.user.name}!
              </CardTitle>
              <CardDescription>
                Thank you for sharing your insights. Your responses will help us
                enhance your experience and develop new products that align with
                your goals. Thank you for being part of our journey!
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link href={"/"} className={buttonVariants({})}>
                Go to Dashboard
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default withStepperProvider(OnBoarding);
