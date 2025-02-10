/* eslint-disable react-hooks/rules-of-hooks */
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
import {
  useSetEmployeeDiscordMutation,
  useSetEmployeeEmailMutation,
  useSetEmployeePersonalityMutation,
} from "@/redux/features/employeeApiSlice/employeeSlice";
import { ErrorResponse } from "@/types";
import { Check, ExternalLink, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import OnboardingForm from "./onboarding-form";

interface Props {
  isActive: boolean;
  isCompleted: boolean;
  currentStep: number;
  handleStepChange: (stepIndex?: number) => void;
  handleFormData: (data: any) => void;
  fromData: any;
  employeeId: string;
  token: string;
}

function StepperCard({
  isActive,
  isCompleted,
  title,
  description,
  children,
}: {
  isActive?: boolean;
  isCompleted: boolean;
  title: string;
  description: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Card className="text-left border-none">
      <CardHeader
        className={cn(
          "pointer-bullet border-transparent relative mt-0",
          isActive && "completed pb-0",
          isCompleted && "before:opacity-0 before:hidden"
        )}
      >
        <Check
          className={cn(
            "size-4 border border-success rounded-full hidden",
            isCompleted &&
              "block p-0.5 absolute left-6 top-[22px] translate-y-1/2 text-success"
          )}
        />
        <CardTitle className="!mt-0 text-black text-base">{title}</CardTitle>
        <CardDescription className="text-text-light text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      {isActive && <CardContent className="pt-5">{children}</CardContent>}
    </Card>
  );
}

export const steppers = [
  {
    id: 1,
    title: "Step 1",
    description: "Create your account",
    completed: false,
    component: ({
      isCompleted,
      isActive,
      handleStepChange,
      employeeId,
      token,
    }: Props) => {
      const [updateEmail, { isLoading }] = useSetEmployeeEmailMutation();
      return (
        <StepperCard
          isCompleted={isCompleted}
          isActive={isActive}
          title="Create your account"
          description={
            <p>
              Set up your company email address using the format:{" "}
              <strong>name.themefisher@gmail.com</strong>
            </p>
          }
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const formObject = Object.fromEntries(formData.entries());
              try {
                await updateEmail({
                  id: employeeId,
                  email: formObject.working_email as string,
                  token: token,
                }).unwrap();
                handleStepChange();
              } catch (error) {
                toast.error(
                  (error as ErrorResponse).data.message ||
                    "Something with wrong!"
                );
              }
            }}
            className="space-y-4"
          >
            <Input
              name="working_email"
              type="email"
              placeholder="name.themefisher@gmail.com"
            />
            <Button disabled={isLoading} type="submit" variant={"outline"}>
              Submit Email
              {isLoading && <Loader2 className="animate-spin size-4" />}
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
    component: ({
      isCompleted,
      isActive,
      handleStepChange,
      employeeId,
      token,
    }: Props) => {
      const [updateDiscord, { isLoading }] = useSetEmployeeDiscordMutation();

      return (
        <StepperCard
          isActive={isActive}
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
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const formObject = Object.fromEntries(formData.entries());
              try {
                await updateDiscord({
                  id: employeeId,
                  discord: formObject.discord as string,
                  token: token,
                }).unwrap();
                handleStepChange();
              } catch (error) {
                toast.error(
                  (error as ErrorResponse).data.message ||
                    "Something with wrong!"
                );
              }
            }}
          >
            <Input
              name="discord"
              type="text"
              placeholder="https://discord.com/invite/123456789"
            />
            <Button disabled={isLoading} type="submit" variant={"outline"}>
              Submit{" "}
              {isLoading && <Loader2 className="animate-spin size-4 ml-3" />}
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
    component: ({ isActive, isCompleted, employeeId }: Props) => {
      return (
        <StepperCard
          isActive={isActive}
          isCompleted={isCompleted}
          title="Complete Onboarding Form"
          description={
            <div>
              <p>
                Fill out and submit the new employee onboarding form with your
                details
              </p>
            </div>
          }
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-3">
                Open Form
                <ExternalLink className="ml-1.5 size-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Complete Onboarding Form</DialogTitle>
              </DialogHeader>
              <OnboardingForm employeeId={employeeId} />
            </DialogContent>
          </Dialog>
        </StepperCard>
      );
    },
  },
  {
    id: 4,
    title: "Step 4",
    description: "Complete Onboarding Form",
    completed: false,
    component: ({
      isActive,
      isCompleted,
      handleStepChange,
      employeeId,
      token,
    }: Props) => {
      const [updatePersonality, { isLoading }] =
        useSetEmployeePersonalityMutation();
      return (
        <StepperCard
          isActive={isActive}
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
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const formData = new FormData(e.currentTarget);
                const formObject = Object.fromEntries(formData.entries());
                await updatePersonality({
                  id: employeeId,
                  personality: formObject?.personality as string,
                  token,
                }).unwrap();
                handleStepChange();
              } catch (error) {
                toast.error(
                  (error as ErrorResponse).data.message ||
                    "Something with wrong!"
                );
              }
            }}
            className="space-y-4 -mt-3"
          >
            <Input type="text" placeholder="ENTG" name={"personality"} />
            <Button type="submit" variant={"outline"}>
              {isLoading && <Loader2 className="animate-spin size-4 ml-1.5" />}
              Submit
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
    component: ({ isActive, isCompleted, token }: Props) => {
      return (
        <StepperCard
          isActive={isActive}
          isCompleted={isCompleted}
          title="Read Company Policies"
          description={
            <div>
              <p>
                Read and acknowledge our organization{" "}
                <Link
                  className={buttonVariants({
                    className: "inline-block !p-0",
                    variant: "link",
                  })}
                  href={""}
                >
                  policy & Code of Conduct
                </Link>
              </p>
            </div>
          }
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              signIn("credentials", {
                token: token,
              });
            }}
          >
            <Button type="submit" variant={"outline"}>
              I Agree
            </Button>
          </form>
        </StepperCard>
      );
    },
  },
  {
    id: 6,
    title: "Step 6",
    description: "Complete Onboarding Form",
    completed: false,
    component: ({ isActive, isCompleted, token }: Props) => {
      return (
        <StepperCard
          isActive={isActive}
          isCompleted={isCompleted}
          title="Update Password"
          description={
            <div>
              <p>Update your password to secure your account</p>
              <Link
                className={buttonVariants({
                  className: "inline-block !p-0",
                  variant: "link",
                })}
                href={""}
              >
                Update Password
              </Link>
            </div>
          }
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              signIn("credentials", {
                token: token,
              });
            }}
          >
            <Button type="submit" variant={"outline"}>
              I Agree
            </Button>
          </form>
        </StepperCard>
      );
    },
  },
];
