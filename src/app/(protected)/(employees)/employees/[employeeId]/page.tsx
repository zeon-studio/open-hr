"use client";

import Avatar from "@/components/Avatar";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetEmployeeQuery } from "@/redux/features/employeeApiSlice/employeeSlice";
import { Building, Calendar, Mail, Phone, UserRoundCog } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import PersonalInfo from "./_components/personal-info";

import { SiFacebook, SiInstagram, SiX } from "@icons-pack/react-simple-icons";
import Link from "next/link";

const tabs = [
  {
    label: "Personal",
    value: "personal",
    content: <PersonalInfo />,
  },
  {
    label: "Job",
    value: "job",
    content: <></>,
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

  return (
    <div className="bg-light mt-10 relative pt-10 flex space-x-6 after:bg-primary after:absolute after:left-0 after:w-full after:h-[20em] after:max-h-[212px] after:rounded after:-top-0.5 px-8">
      <div className="relative z-20 flex-none">
        <div className="size-[210px] bg-light">
          <Avatar
            className="rounded flex-none"
            width={210}
            height={210}
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
                  <span className="text-xs block">Dhaka, Bangladesh</span>
                </div>
              </li>

              <li className="flex space-x-2">
                <Phone className="size-4" />
                <span className="flex space-x-2 text-xs">801-724-6600</span>
              </li>

              <li className="flex space-x-2">
                <Mail className="size-4" />
                <span className="flex space-x-2 text-xs">
                  farhad.themefisher@gmail.com
                </span>
              </li>

              <li className="flex space-x-2">
                <UserRoundCog className="size-4" />
                <div className="space-y-1.5">
                  <span className="text-xs block font-semibold">
                    Sr. HR Administrator
                  </span>
                  <span className="text-xs block">Full-Time</span>
                </div>
              </li>

              <li className="flex space-x-2">
                <UserRoundCog className="size-4" />
                <div className="space-y-1.5">
                  <span className="text-xs block font-semibold">
                    Employee Id
                  </span>
                  <span className="text-xs block">Ad4660523</span>
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
                    Sep 28, 2021
                  </span>
                  <span className="text-xs block">3y - 1m - 30d</span>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="text-base font-semibold mb-4">Social</h6>
            <ul className="flex space-x-2">
              <li>
                <Link href={""}>
                  <SiX className="size-4" />
                </Link>
              </li>
              <li>
                <Link href={""}>
                  <SiFacebook className="size-4" />
                </Link>
              </li>
              <li className="flex space-x-2">
                <Link href={""}>
                  <SiInstagram className="size-4" />
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
                  <Button className="rounded-none data-[state=active]:rounded">
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
