import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/shadcn";
import { useUpdateEmployeePersonalityMutation } from "@/redux/features/employeeApiSlice/employeeSlice";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";
import OnboardingForm from "./onboarding-form";

interface Props {
  isCompleted: boolean;
  currentStep: number;
  handleStepChange: (stepIndex?: number) => void;
}

function StepperCard({
  isCompleted,
  title,
  description,
  children,
}: {
  isCompleted: boolean;
  title: string;
  description: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Card className="text-left border-none">
      <CardHeader
        className={cn(
          "pointer-bullet border-transparent relative",
          isCompleted && "completed pb-0"
        )}
      >
        <CardTitle className="space-y-0 text-black text-base">
          {title}
        </CardTitle>
        <CardDescription className="text-text-light text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      {isCompleted && <CardContent className="pt-5">{children}</CardContent>}
    </Card>
  );
}

export const steppers = [
  {
    id: 1,
    title: "Step 1",
    description: "Create your account",
    completed: false,
    component: ({ isCompleted, handleStepChange }: Props) => {
      return (
        <StepperCard
          isCompleted={isCompleted}
          title="Create your account"
          description={
            <p>
              Set up your company email address using the format:{" "}
              <strong>name.themefisher@gmail.com</strong>
            </p>
          }
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleStepChange();
            }}
            className="space-y-4"
          >
            <Input type="email" placeholder="name.themefisher@gmail.com" />
            <Button type="submit" variant={"outline"}>
              Submit Email
            </Button>
          </form>
        </StepperCard>
      );
    },
  },
  {
    id: 2,
    title: "Step 2",
    description: "Create A Discord Account",
    completed: false,
    component: ({ isCompleted, handleStepChange }: Props) => {
      return (
        <StepperCard
          isCompleted={isCompleted}
          title="Create A Discord Account"
          description={
            <p>
              Create a Discord account using your new company email and join our
              workspace
            </p>
          }
        >
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleStepChange();
            }}
          >
            <Input
              type="text"
              placeholder="https://discord.com/invite/123456789"
            />
            <Button type="submit" variant={"outline"}>
              Submit Id
            </Button>
          </form>
        </StepperCard>
      );
    },
  },
  {
    id: 3,
    title: "Step 3",
    description: "Complete Onboarding Form",
    completed: false,
    component: ({ isCompleted }: { isCompleted: boolean }) => {
      return (
        <StepperCard
          isCompleted={isCompleted}
          title="Complete Onboarding Form"
          description={
            <div>
              <p>
                Fill out and submit the new employee onboarding form with your
                details
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-3">Open Form</Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Complete Onboarding Form</DialogTitle>
                  </DialogHeader>
                  <OnboardingForm />
                </DialogContent>
              </Dialog>
            </div>
          }
        />
      );
    },
  },
  {
    id: 4,
    title: "Step 4",
    description: "Complete Onboarding Form",
    completed: false,
    component: ({ isCompleted, handleStepChange }: Props) => {
      return (
        <StepperCard
          isCompleted={isCompleted}
          title="Take this test and submit the result"
          description={
            <div>
              <p>
                Fill out and submit the new employee onboarding form with your
                details
              </p>
              <Link
                className={buttonVariants({
                  className: "pl-0 pb-0",
                  variant: "link",
                })}
                href="https://www.16personalities.com/bn/ব্যক্তিত্বের-পরীক্ষা"
                target="_black"
              >
                Take the test <ExternalLink className="size-4 ml-1" />
              </Link>
            </div>
          }
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleStepChange();
            }}
            className="space-y-4 -mt-3"
          >
            <Input type="text" placeholder="ENTG" />
            <Button type="submit" variant={"outline"}>
              Submit Result
            </Button>
          </form>
        </StepperCard>
      );
    },
  },
  {
    id: 5,
    title: "Step 5",
    description: "Complete Onboarding Form",
    completed: false,
    component: ({ isCompleted }: { isCompleted: boolean }) => {
      const [updateEmployee, { isLoading }] =
        useUpdateEmployeePersonalityMutation();
      return (
        <StepperCard
          isCompleted={isCompleted}
          title="Read Company Policies"
          description={
            <div>
              <p>
                Read and acknowledge our organization policies and Code of
                Conduct
              </p>
              <Link
                className={buttonVariants({
                  className: "pl-0",
                  variant: "link",
                })}
                href={""}
              >
                policy & Code of Conduct
              </Link>
            </div>
          }
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Button disabled={isLoading} type="submit" variant={"outline"}>
              I Agree
            </Button>
          </form>
        </StepperCard>
      );
    },
  },
];
