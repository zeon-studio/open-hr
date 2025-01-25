"use client";

import Avatar from "@/components/Avatar";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetEmployeeQuery } from "@/redux/features/employeeApiSlice/employeeSlice";
import {
  Building,
  Calendar,
  ChevronDown,
  Mail,
  Phone,
  UserRoundCog,
} from "lucide-react";
import { notFound, useParams } from "next/navigation";
import PersonalInfo from "./_components/personal-info";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDuration } from "@/lib/dateFormat";
import { cn } from "@/lib/shadcn";
import { useGetEmployeeJobQuery } from "@/redux/features/employeeJobApiSlice/employeeJobSlice";
import { SiDiscord, SiFacebook, SiX } from "@icons-pack/react-simple-icons";
import Link from "next/link";
import { useState } from "react";
import Assets from "./_components/assets-details";
import Courses from "./_components/course-details";
import Document from "./_components/document-details";
import Emergency from "./_components/emergency-details";
import JobDetails from "./_components/job-details";
import Offboarding from "./_components/offboarding";
import Onboarding from "./_components/onboarding-details";

const tabs = [
  {
    label: "Personal",
    value: "personal",
    content: <PersonalInfo />,
  },
  {
    label: "Job",
    value: "job",
    content: <JobDetails />,
  },
  {
    label: "Documents",
    value: "documents",
    content: <Document />,
  },
  {
    label: "Courses",
    value: "courses",
    content: <Courses />,
  },
  {
    label: "Assets",
    value: "assets",
    content: <Assets />,
  },
  {
    label: "Emergency",
    value: "emergency",
    content: <Emergency />,
  },
  {
    label: "Onboarding",
    value: "onboarding",
    content: <Onboarding />,
  },
  {
    label: "Offboarding",
    value: "offboarding",
    content: <Offboarding />,
  },
];

const DISTANCE = "278px";

export default function Info() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { data: session } = useSession();
  const { data, isLoading } = useGetEmployeeQuery(
    employeeId ?? session?.user.id!
  );
  const { data: jobData } = useGetEmployeeJobQuery(
    employeeId ?? session?.user.id!
  );

  if (!isLoading && !data?.result) {
    return notFound();
  }

  const user =
    session?.user.id === data?.result.id
      ? {
          email: data?.result.work_email,
          name: data?.result.name,
        }
      : session?.user;

  const employmentDuration = getDuration(
    jobData?.result.joining_date!,
    new Date().toISOString()
  );

  const formattedDuration = `${employmentDuration.years || 0}y - ${employmentDuration.months || 0}m - ${employmentDuration.days || 0}d`;
  const [activeTab, setTab] = useState(tabs[0]);

  return (
    <div
      style={
        {
          "--distance": DISTANCE,
        } as React.CSSProperties
      }
      className="bg-light mt-10 xl:pt-10 pt-4 flex xl:space-x-6"
    >
      <div className="z-30 relative flex-none hidden xl:block pl-8 pt-8">
        <div className="lg:size-28 xl:size-[210px] bg-light rounded overflow-hidden">
          <Avatar
            className="flex-none w-full rounded-none"
            width={200}
            height={200}
            email={user?.email!}
            src=""
            alt={user?.name || "employee"}
          />
        </div>

        <div className="space-y-5 mt-10">
          <div>
            <h6 className="text-base font-semibold mb-4">Vitals</h6>
            <ul className="list-none space-y-4">
              <li className="flex space-x-2">
                <Building className="size-4" />
                <div className="space-y-1.5">
                  <span className="text-xs block font-semibold">
                    Present Address
                  </span>
                  <span className="text-xs block">
                    {data?.result.present_address}
                  </span>
                </div>
              </li>

              <li className="flex space-x-2">
                <Phone className="size-4" />
                <span className="flex space-x-2 text-xs">
                  {data?.result.phone}
                </span>
              </li>

              <li className="flex space-x-2">
                <Mail className="size-4" />
                <span className="flex space-x-2 text-xs">
                  {data?.result.work_email}
                </span>
              </li>

              <li className="flex space-x-2">
                <UserRoundCog className="size-4" />
                <div className="space-y-1.5">
                  <span className="text-xs block font-semibold capitalize">
                    {jobData?.result.designation}
                  </span>
                  <span className="text-xs block capitalize">
                    {jobData?.result.job_type.replace("_", " ")}
                  </span>
                </div>
              </li>

              <li className="flex space-x-2">
                <UserRoundCog className="size-4" />
                <div className="space-y-1.5">
                  <span className="text-xs block font-semibold">
                    Employee Id
                  </span>
                  <span className="text-xs block">{data?.result.id}</span>
                </div>
              </li>
            </ul>
            <Separator className="my-5" />
          </div>

          <div>
            <h6 className="text-base font-semibold mb-4">Join Date</h6>
            <ul className="list-none space-y-4">
              <li className="flex space-x-2">
                <Calendar className="size-4" />
                <div className="space-y-1.5">
                  <span className="text-xs block font-semibold">
                    {jobData?.result.joining_date
                      ? format(
                          new Date(jobData?.result.joining_date),
                          "MMM d, yyyy"
                        )
                      : null}
                  </span>
                  <span className="text-xs block">{formattedDuration}</span>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="text-base font-semibold mb-4">Social</h6>
            <ul className="flex space-x-2">
              <li>
                <Link href={data?.result.twitter ?? ""}>
                  <SiX className="size-4" />
                </Link>
              </li>
              <li>
                <Link href={data?.result.facebook ?? ""}>
                  <SiFacebook className="size-4" />
                </Link>
              </li>

              <li>
                <Link href={data?.result.discord ?? ""}>
                  <SiDiscord className="size-4" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative z-20 flex-1">
        <div>
          <div className="flex space-x-4 xl:space-x-0 relative after:absolute xl:after:-left-[var(--distance)] after:-z-10 after:bg-primary after:w-full xl:after:w-[calc(100%_+_var(--distance))] after:h-full after:rounded-t after:bottom-1 xl:px-8 px-4 lg:pb-6 2xl:pb-[60px] after:left-0 pt-4 xl:pt-8 max-lg:after:rounded">
            <div className="xl:hidden size-[100px] flex-none bg-light rounded overflow-hidden translate-y-1">
              <Avatar
                className="flex-none w-full rounded-none"
                width={100}
                height={100}
                email={user?.email!}
                src={""}
                alt={user?.name || "employee"}
              />
            </div>
            <div>
              <h2 className="text-primary-foreground max-lg:text-h5 mb-0.5 lg:mb-2.5">
                Hi, {data?.result.name}
              </h2>
              <p className="text-xs font-semibold lg:font-normal lg:text-base text-primary-foreground/90">
                {jobData?.result.designation}
              </p>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={"secondary"}
                    className="bg-background mt-3 flex space-x-1 focus-visible:ring-offset-0 ring-offset-0 lg:hidden focus-visible:border-none focus-visible:outline-none focus-visible:!ring-0"
                  >
                    <span>{activeTab.label}</span>
                    <ChevronDown className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="p-2 border-none bg-background"
                >
                  {tabs.map((tab, index) => (
                    <DropdownMenuItem
                      onClick={() => {
                        setTab(tab);
                      }}
                      key={tab.value}
                      asChild
                    >
                      <Button
                        className={cn(
                          "h-auto w-full justify-start focus-visible:ring-offset-0 ring-offset-0 lg:hidden focus-visible:border-none focus-visible:outline-none focus-visible:!ring-0 cursor-pointer p-1.5",

                          tab.value === activeTab.value &&
                            "bg-[#F3F4F6] text-text-dark"
                        )}
                        variant={"ghost"}
                      >
                        {tab.label}
                      </Button>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Tabs value={activeTab.value} className="shadow-none">
            <TabsList className="h-auto flex-wrap gap-x-4 space-x-0 space-y-0 bg-transparent border-none justify-start items-start shadow-none w-full after:bg-primary relative after:absolute xl:after:w-[calc(100%_+_var(--distance))] xl:after:-left-[var(--distance)] after:w-full after:rounded-b after:bottom-1 xl:px-8 px-4 after:h-full after:-z-10 after:left-0 hidden lg:flex">
              {tabs.map((tab, index) => (
                <TabsTrigger
                  value={tab.value}
                  key={index}
                  asChild
                  className="data-[state=active]:bg-light"
                >
                  <Button
                    onClick={() => {
                      setTab(tab);
                    }}
                    className="rounded-none data-[state=active]:border-none data-[state=active]:rounded !rounded-b-none md:px-6 data-[state=active]:ring-offset-0 data-[state=active]:ring-0 !shadow-none"
                  >
                    {tab.label}
                  </Button>
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab, index) => (
              <TabsContent
                key={index}
                className="w-full mt-14"
                value={tab.value}
              >
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
