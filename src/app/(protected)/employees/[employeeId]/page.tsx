"use client";

import Avatar from "@/components/avatar";
import { Facebook, Linkedin, Twitter } from "@/components/icons";
import { getDuration } from "@/lib/date-converter";
import { cn } from "@/lib/shadcn";
import { useGetEmployeeQuery } from "@/redux/features/employeeApiSlice/employeeSlice";
import { useGetEmployeeJobQuery } from "@/redux/features/employeeJobApiSlice/employeeJobSlice";
import { useAppSelector } from "@/redux/hook";
import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Separator } from "@/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { format } from "date-fns";
import {
  Building,
  Calendar,
  ChevronDown,
  Hash,
  Mail,
  MessageCircle,
  Phone,
  UserRoundCog,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  notFound,
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useState } from "react";
import Achievement from "./_components/achievement-details";
import Assets from "./_components/asset-details";
import Courses from "./_components/course-details";
import Document from "./_components/document-details";
import Emergency from "./_components/emergency-details";
import JobDetails from "./_components/job-details";
import Offboarding from "./_components/offboarding-details";
import Onboarding from "./_components/onboarding-details";
import Payroll from "./_components/payroll-details";
import PersonalInfo from "./_components/personal-info";
import Tools from "./_components/tool-details";

const tabs = [
  {
    label: "Personal",
    value: "personal",
    module: "employee",
    content: <PersonalInfo />,
  },
  {
    label: "Job",
    value: "job",
    module: "employee-job",
    content: <JobDetails />,
  },
  {
    label: "Payroll",
    value: "payroll",
    module: "payroll",
    content: <Payroll />,
  },
  {
    label: "Emergency",
    value: "emergency",
    module: "employee-contact",
    content: <Emergency />,
  },
  {
    label: "Documents",
    value: "documents",
    module: "employee-document",
    content: <Document />,
  },
  {
    label: "Achievements",
    value: "achievements",
    module: "employee-achievement",
    content: <Achievement />,
  },
  {
    label: "Courses",
    value: "courses",
    module: "course",
    content: <Courses />,
  },
  {
    label: "Tools",
    value: "tools",
    module: "tool",
    content: <Tools />,
  },
  {
    label: "Assets",
    value: "assets",
    module: "asset",
    content: <Assets />,
  },
  {
    label: "Onboarding",
    value: "onboarding",
    module: "employee-lifecycle",
    content: <Onboarding />,
  },
  {
    label: "Offboarding",
    value: "offboarding",
    module: "employee-lifecycle",
    content: <Offboarding />,
  },
];

export default function EmployeeSingle() {
  const { modules, communication_platform, communication_platform_url } =
    useAppSelector((state) => state["setting-slice"]);

  // only show tab if module is enabled
  const filterTabByModule = tabs.filter((tab) => {
    const mod = modules?.find((mod) => mod.name === tab.module);
    return mod ? mod.enable : true;
  });

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const params = useParams<{ employeeId: string }>();
  let employeeId = params?.employeeId;
  if (!employeeId) {
    employeeId = session?.user.id as string;
  }
  const { data, isLoading } = useGetEmployeeQuery(employeeId);
  const { data: jobData } = useGetEmployeeJobQuery(employeeId);
  const [activeTab, setTab] = useState(tabs[0]);

  if (!isLoading && !data?.result) {
    return notFound();
  }

  const user =
    session?.user.id !== data?.result.id
      ? {
          email: data?.result.work_email ?? data?.result.personal_email,
          name: data?.result.name,
        }
      : session?.user;

  // hide tabs from former
  const hideFromAlumni = [
    "courses",
    "tools",
    "assets",
    "emergency",
    "documents",
    "onboarding",
  ];
  const filteredTabs = filterTabByModule.filter((tab) => {
    if (session?.user.role === "former") {
      return !hideFromAlumni.includes(tab.value);
    }
    return true;
  });

  const employmentDuration = getDuration(
    jobData?.result?.joining_date!,
    new Date().toISOString()
  );

  const formattedDuration = `${employmentDuration.years || 0}y - ${employmentDuration.months || 0}m - ${employmentDuration.days || 0}d`;

  const handleMouseDown = (tab: (typeof tabs)[0]) => {
    const urlSearchParams = new URLSearchParams(searchParams?.toString());
    urlSearchParams.set("tab", tab.value);
    router.push(pathname + "?" + urlSearchParams.toString());
  };

  return (
    <div className="bg-light">
      <Tabs value={searchParams?.get("tab") || activeTab.value}>
        <div className="flex p-4 xl:p-0 xl:pl-8 pb-0 rounded max-xl:gap-x-6 mt-5 relative after:bg-primary after:absolute after:-top-[20px] lg:after:-top-6 after:left-0 after:size-full after:rounded after:-z-10 z-20 gap-x-8">
          <div className="flex-shrink-0 xl:basis-[210px] size-[100px] lg:size-[210px]">
            <Avatar
              className="rounded-md w-[100px] lg:w-[210px]"
              width={210}
              height={210}
              email={user?.email!}
              alt={user?.name || "employee"}
            />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-primary-foreground max-lg:text-h5 mb-0.5 lg:mb-2.5">
                {data?.result.name}
              </h2>
              <p className="text-xs font-semibold lg:font-normal lg:text-base text-primary-foreground/90 capitalize">
                {data?.result?.designation}
                {data?.result?.role === "former" && (
                  <span className="text-destructive font-normal">
                    {" (Former)"}
                  </span>
                )}
              </p>
            </div>

            <div className="-translate-y-2 lg:-translate-y-6">
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
                    {filteredTabs.map((tab) => (
                      <DropdownMenuItem
                        onClick={() => {
                          setTab(tab);
                        }}
                        key={tab.value}
                        asChild
                      >
                        <Button
                          className={cn(
                            "h-auto w-full justify-start focus-visible:ring-offset-0 ring-offset-0 xl:hidden focus-visible:border-none focus-visible:outline-none focus-visible:!ring-0 cursor-pointer p-1.5",

                            tab.value === activeTab.value &&
                              "bg-[#F3F4F6] text-text-dark"
                          )}
                          variant={"ghost"}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleMouseDown(tab);
                          }}
                        >
                          {tab.label}
                        </Button>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <TabsList className="hidden xl:flex h-auto 2xl:gap-x-4 space-x-0 space-y-0 bg-transparent border-none justify-start items-start shadow-none w-full pb-0 self-end justify-self-end -mt-6 max-w-[750px] 2xl:max-w-full overflow-x-auto rounded-none">
                {filteredTabs.map((tab, index) => (
                  <TabsTrigger
                    value={tab.value}
                    key={index}
                    asChild
                    className="data-[state=active]:bg-light flex-1"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleMouseDown(tab);
                    }}
                  >
                    <Button
                      onClick={() => {
                        setTab(tab);
                      }}
                      className="rounded-none px-4 h-9 data-[state=active]:border-none data-[state=active]:rounded !rounded-b-none data-[state=active]:ring-offset-0 data-[state=active]:ring-0 !shadow-none"
                    >
                      {tab.label}
                    </Button>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>
        </div>

        <div className="gap-5 px-4 pb-4 mt-6 lg:mt-8 xl:mt-16 flex">
          <div className="space-y-5 xl:basis-[210px] hidden xl:block xl:pl-8">
            <div className="xl:max-w-[210px]">
              <h6 className="text-base font-semibold mb-4">Vitals</h6>
              <ul className="list-none space-y-4">
                <li className="flex space-x-2 text-text-light">
                  <Building className="size-4 stroke-current" />
                  <div className="space-y-1.5">
                    <span className="text-xs block font-semibold text-text-light">
                      Present Address
                    </span>
                    <span className="text-xs block text-text-light">
                      {data?.result.present_address}
                    </span>
                  </div>
                </li>

                <li className="flex space-x-2 text-text-light">
                  <Phone className="size-4 flex-none stroke-current" />
                  <Link
                    href={`tel:${data?.result.phone}`}
                    className="flex space-x-2 text-xs"
                  >
                    {data?.result.phone}
                  </Link>
                </li>

                <li className="flex space-x-2 text-text-light">
                  <Mail className="size-4 flex-none text-current" />
                  <Link
                    href={`mailto:${data?.result.work_email}`}
                    className="flex space-x-2 text-xs"
                  >
                    {data?.result.work_email}
                  </Link>
                </li>

                <li className="flex space-x-2 text-text-light">
                  <MessageCircle className="size-4 flex-none text-current" />
                  <Link
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    href={
                      communication_platform_url + data?.result.communication_id
                    }
                    className="flex space-x-2 text-xs"
                  >
                    {communication_platform}
                  </Link>
                </li>

                <li className="flex space-x-2 text-text-light">
                  <UserRoundCog className="size-4 stroke-current" />
                  <div className="space-y-1.5">
                    <span className="text-xs block font-semibold capitalize">
                      {data?.result?.designation}
                    </span>
                    <span className="text-xs block capitalize">
                      {jobData?.result?.job_type?.replace("_", " ")}
                    </span>
                  </div>
                </li>

                <li className="flex space-x-2 text-text-light">
                  <Hash className="size-4 stroke-current" />
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

            {!jobData?.result?.resignation_date && (
              <div>
                <h6 className="text-base font-semibold mb-4 text-text-dark">
                  Join Date
                </h6>
                <ul className="list-none space-y-4">
                  {(jobData?.result?.permanent_date ||
                    jobData?.result?.joining_date) && (
                    <li className="flex space-x-2 text-text-light">
                      <Calendar className="size-4 stroke-current" />
                      <div className="space-y-1.5">
                        <span className="text-xs block font-semibold">
                          {format(
                            new Date(
                              jobData?.result?.permanent_date
                                ? jobData?.result?.permanent_date
                                : jobData?.result?.joining_date
                            ),
                            "MMM d, yyyy"
                          )}
                        </span>
                        <span className="text-xs block">
                          {formattedDuration}
                        </span>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            )}

            <div>
              <h6 className="text-base font-semibold mb-4 text-text-dark">
                Social
              </h6>
              <ul className="flex space-x-2">
                <li>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    href={data?.result.linkedin ?? ""}
                  >
                    <Linkedin className="size-7" />
                  </Link>
                </li>
                <li className="flex items-center justify-center">
                  <Link
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    href={data?.result.twitter ?? ""}
                  >
                    <Twitter className="size-7" />
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    href={data?.result.facebook ?? ""}
                  >
                    <Facebook className="size-7" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="xl:pl-6 flex-1">
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
