"use client";

import { Confetti } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { checkCompletion } from "@/lib/check-completion";
import { useGetEmployeeDetailsByTokenQuery } from "@/redux/features/employeeApiSlice/employeeSlice";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { withStepperProvider } from "./_components/stepper-provider";
import { useStepper } from "./_components/use-stepper";

function OnBoarding() {
  const [employeeId, setEmployeeId] = useState<string>("");
  const params = useSearchParams();
  const token = params.get("token") as string;
  const { steppers, currentStep, handleStepChange, completedSteps } =
    useStepper();
  const { data, isLoading, isSuccess } = useGetEmployeeDetailsByTokenQuery({
    token: token,
  });

  useEffect(() => {
    if (isSuccess) {
      const ids = checkCompletion(data.result!);
      handleStepChange(ids);
      setEmployeeId(data?.result.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.result.id, isSuccess]);

  const isCompleted = completedSteps.length == steppers.length;

  if (isLoading) {
    return (
      <div className="max-w-[640px] w-full mx-auto py-20 text-center">
        <Card className="border-none">
          <CardHeader className="border-none">
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!isLoading && !data?.result.personal_email) {
    return (
      <div className="max-w-[640px] w-full mx-auto py-20 text-center">
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
    );
  }

  return (
    <div className="bg-light">
      <div className="max-w-[640px] w-full mx-auto py-20 text-center">
        <Image
          className="mx-auto"
          src={"/images/favicon.png"}
          width={61}
          height={64}
          alt="logo"
        />
        <h2>
          Welcome to Themefisher
          <Confetti className="inline-block ml-3 mb-4" />
        </h2>
        <p>Let's get you set up with everything you need to get started.</p>

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
              />
            );
          })}
        </div>

        {isCompleted && (
          <>
            <div className="mt-10 mb-8">
              <h6>Checkout all our brands & sub brands.</h6>
              <div className="flex gap-4 mt-4 justify-between bg-background p-5">
                <div className="bg-background rounded-lg border border-border/30 p-3">
                  <Image
                    src="/images/brands/brand-1.png"
                    width={92}
                    height={100}
                    alt="brand"
                  />
                </div>
                <div className="bg-background rounded-md p-3 border border-border/30">
                  <Image
                    src="/images/brands/brand-2.png"
                    width={63}
                    height={20}
                    alt="brand"
                  />
                </div>
                <div className="bg-background rounded-md border-border/30 border p-3">
                  <Image
                    src="/images/brands/brand-3.png"
                    width={102}
                    height={20}
                    alt="brand"
                  />
                </div>
                <div className="bg-background rounded-md border-border/30 border p-3">
                  <Image
                    src="/images/brands/brand-4.png"
                    width={95}
                    height={20}
                    alt="brand"
                  />
                </div>
                <div className="bg-background rounded-md border-border/30 border p-3">
                  <Image
                    src="/images/brands/brand-5.png"
                    width={85}
                    height={20}
                    alt="brand"
                  />
                </div>
              </div>
            </div>

            <Card className="border-none">
              <CardHeader className="border-none">
                <CardTitle className="mb-3">Thanks, Farhad!</CardTitle>
                <CardDescription>
                  Thank you for sharing your insights. Your responses will help
                  us enhance your experience and develop new products that align
                  with your goals. Thank you for being part of our journey!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={"/"} className={buttonVariants({})}>
                  Go to Dashboard
                </Link>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

export default withStepperProvider(OnBoarding);
