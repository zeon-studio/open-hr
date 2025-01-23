"use client";

import Avatar from "@/components/Avatar";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetEmployeeQuery } from "@/redux/features/employeeApiSlice/employeeSlice";
import { Building, Calendar, Mail, Phone, UserRoundCog } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import PersonalInfo from "./_components/personal-info";

import { getDuration } from "@/lib/dateFormat";
import { useGetEmployeeJobQuery } from "@/redux/features/employeeJobApiSlice/employeeJobSlice";
import { SiDiscord, SiFacebook, SiX } from "@icons-pack/react-simple-icons";
import Link from "next/link";
import Assets from "./_components/assets-details";
import Courses from "./_components/course-details";
import Document from "./_components/document-details";
import Emergency from "./_components/emergency-details";
import JobDetails from "./_components/job-details";
import Offboarding from "./_components/offboarding";

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
    <div className="bg-light mt-10 relative xl:pt-10 pt-4 flex sm:space-x-6 after:bg-primary after:absolute after:left-0 after:w-full min-[588px]:after:h-[166px] xl:after:h-[212px] after:rounded after:-top-0.5 xl:px-8 px-4 after:h-[206px]">
      <div className="relative z-20 flex-none hidden xl:block">
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
        <div className="">
          <div className="flex space-x-3 xl:space-x-0">
            <div className="xl:hidden size-[80px] flex-none bg-light rounded overflow-hidden">
              <Avatar
                className="flex-none w-full rounded-none"
                width={80}
                height={80}
                email={user?.email!}
                src=""
                alt={user?.name || "employee"}
              />
            </div>
            <div>
              <h2 className="text-primary-foreground">
                Hi, {data?.result.name}
              </h2>
              <p className="text-primary-foreground/90">
                {jobData?.result.designation}
              </p>
            </div>
          </div>

          <Tabs
            defaultValue={tabs[0].value}
            className="mt-6 xl:mt-[51px] shadow-none"
          >
            <TabsList
              defaultValue={tabs[0].value}
              className="h-auto flex-wrap space-x-0 space-y-0 bg-transparent border-none justify-start items-start shadow-none w-full"
            >
              {tabs.map((tab, index) => (
                <div key={index} className="md:flex-1">
                  <TabsTrigger value={tab.value} key={index} asChild>
                    <Button className="rounded-none data-[state=active]:border-none data-[state=active]:rounded !rounded-b-none md:px-6">
                      {tab.label}
                    </Button>
                  </TabsTrigger>
                </div>
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
