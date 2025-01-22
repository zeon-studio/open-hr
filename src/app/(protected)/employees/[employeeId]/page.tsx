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
import { SiFacebook, SiX } from "@icons-pack/react-simple-icons";
import Link from "next/link";
import JobDetails from "./_components/job-details";

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
    label: "Courses",
    value: "courses",
    content: <></>,
  },
  {
    label: "Assets",
    value: "assets",
    content: <></>,
  },
  {
    label: "Emergency",
    value: "emergency",
    content: <></>,
  },
  {
    label: "Offboarding",
    value: "offboarding",
    content: <></>,
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
    <div className="bg-light mt-10 relative pt-10 flex space-x-6 after:bg-primary after:absolute after:left-0 after:w-full after:h-[20em] after:max-h-[212px] after:rounded after:-top-0.5 px-8">
      <div className="relative z-20 flex-none">
        <div className="size-[210px] bg-light rounded">
          <Avatar
            className="rounded flex-none"
            width={500}
            height={500}
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
            </ul>
          </div>
        </div>
      </div>

      <div className="relative z-20 flex-1">
        <div className="">
          <div>
            <h2 className="text-primary-foreground">Hi, {user?.name}</h2>
            <p className="text-primary-foreground/90">Sr. Developer</p>
          </div>

          <Tabs defaultValue={tabs[0].value} className="mt-[55px]">
            <TabsList defaultValue={tabs[0].value} className="bg-transparent">
              {tabs.map((tab, index) => (
                <TabsTrigger value={tab.value} key={index} asChild>
                  <Button className="rounded-none data-[state=active]:rounded !rounded-b-none">
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
