"use client";

import Avatar from "@/components/Avatar";
import { useSession } from "next-auth/react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetEmployeeQuery } from "@/redux/features/employeeApiSlice/employeeSlice";
import { notFound, useParams } from "next/navigation";
import PersonalInfo from "./_components/personal-info";

import { Discord, Facebook, Linkedin, Twitter } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getDuration } from "@/lib/dateFormat";
import { useGetEmployeeJobQuery } from "@/redux/features/employeeJobApiSlice/employeeJobSlice";
import { format } from "date-fns";
import {
  Building,
  Calendar,
  ChevronDown,
  Mail,
  Phone,
  UserRoundCog,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Assets from "./_components/assets-details";
import Courses from "./_components/course-details";
import Document from "./_components/document-details";
import Emergency from "./_components/emergency-details";
import JobDetails from "./_components/job-details";
import Offboarding from "./_components/offboarding";
import Onboarding from "./_components/onboarding-details";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/shadcn";

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

export default function Info() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { data: session } = useSession();
  const { data, isLoading } = useGetEmployeeQuery(
    employeeId ?? session?.user.id!
  );
  const { data: jobData } = useGetEmployeeJobQuery(
    employeeId ?? session?.user.id!
  );
  const [activeTab, setTab] = useState(tabs[0]);

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

  return (
    <div className="bg-light">
      <Tabs value={activeTab.value}>
        <div className="flex xl:grid grid-cols-10 gap-5 2xl:grid-cols-12 bg-primary p-4 xl:p-0 xl:pl-8 pb-0 rounded max-xl:gap-x-6">
          <div className="col-span-5 lg:col-span-2 2xl:col-span-2 translate-y-6 2xl:translate-y-8">
            <div className="bg-light rounded overflow-hidden max-w-[210px]">
              <Avatar
                className="flex-none w-full rounded-none max-w-[100px] lg:max-w-[210px]"
                width={200}
                height={200}
                email={user?.email!}
                src=""
                alt={user?.name || "employee"}
              />
            </div>
          </div>

          <div className="col-span-5 lg:col-span-8 2xl:col-span-10 flex flex-col">
            <div className="xl:translate-y-6 2xl:translate-y-8">
              <h2 className="text-primary-foreground max-lg:text-h5 mb-0.5 lg:mb-2.5">
                Hi, {data?.result.name}
              </h2>
              <p className="text-xs font-semibold lg:font-normal lg:text-base text-primary-foreground/90">
                {jobData?.result.designation}
              </p>
            </div>

            <div className="mt-auto xl:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={"secondary"}
                    className="mt-3 flex space-x-1 focus-visible:ring-offset-0 ring-offset-0 xl:hidden focus-visible:border-none focus-visible:outline-none focus-visible:!ring-0 rounded-b-none bg-light shadow-none"
                  >
                    <span>{activeTab.label}</span>
                    <ChevronDown className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="p-2 border-none bg-background"
                >
                  {tabs.map((tab) => (
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

            <TabsList className="hidden xl:flex h-auto flex-wrap 2xl:gap-x-8 space-x-0 space-y-0 bg-transparent border-none justify-start items-start shadow-none w-full pb-0 self-end justify-self-end mt-auto">
              {tabs.map((tab, index) => (
                <TabsTrigger
                  value={tab.value}
                  key={index}
                  asChild
                  className="data-[state=active]:bg-light flex-1"
                >
                  <Button
                    onClick={() => {
                      setTab(tab);
                    }}
                    className="rounded-none data-[state=active]:border-none data-[state=active]:rounded !rounded-b-none data-[state=active]:ring-offset-0 data-[state=active]:ring-0 !shadow-none"
                  >
                    {tab.label}
                  </Button>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-12 mt-14 xl:mt-16">
          <div className="space-y-5 col-span-3 2xl:col-span-2 hidden xl:block">
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
                  <Phone className="size-4 flex-none" />
                  <span className="flex space-x-2 text-xs">
                    {data?.result.phone}
                  </span>
                </li>

                <li className="flex space-x-2">
                  <Mail className="size-4 flex-none" />
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
                  <Link href={data?.result.linkedin ?? ""}>
                    <Linkedin className="size-7" />
                  </Link>
                </li>
                <li>
                  <Link href={data?.result.twitter ?? ""}>
                    <Twitter className="size-6" />
                  </Link>
                </li>
                <li>
                  <Link href={data?.result.facebook ?? ""}>
                    <Facebook className="size-7" />
                  </Link>
                </li>

                <li>
                  <Link href={data?.result.discord ?? ""}>
                    <Discord className="size-7" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="2xl:col-span-10 col-span-9 xl:pl-6">
            {tabs.map((tab, index) => (
              <TabsContent
                key={index}
                className="w-full mt-0"
                value={tab.value}
              >
                {tab.content}
              </TabsContent>
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  );
}
