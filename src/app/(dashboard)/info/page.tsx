"use client";

import Avatar from "@/components/Avatar";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetEmployeeQuery } from "@/redux/features/employeeApiSlice/employeeSlice";
import PersonalInfo from "./_components/personal-info";

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
  const { data: session } = useSession();
  const { data } = useGetEmployeeQuery(session?.user.id!);
  const { user } = session || {};

  return (
    <div className="bg-light mt-10 relative pt-10 flex space-x-6 after:bg-primary after:absolute after:left-0 after:w-full after:h-[20em] after:max-h-[212px] after:rounded after:-top-0.5 px-8">
      <div className="relative z-20 flex-none size-[210px]">
        <Avatar
          className="rounded flex-none"
          width={210}
          height={210}
          email={user?.email!}
          src=""
          alt=""
        />
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
                className="border border-border/10 rounded bg-background p-10 w-full"
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
