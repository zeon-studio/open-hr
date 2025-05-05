"use client";

import Loader from "@/components/loader";
import ClearCache from "@/helpers/clear-cache";
import { useAppSelector } from "@/redux/hook";
import { useSession } from "next-auth/react";
import Gravatar from "react-gravatar";
import PendingTasks from "./_components/pending-tasks";
import UpcomingEvents from "./_components/upcoming-events";
import UpcomingHolidays from "./_components/upcoming-holidays";
import UpcomingLeaves from "./_components/upcoming-leaves";
import UserAssets from "./_components/user-assets";
import UserCourses from "./_components/user-courses";
import UserTools from "./_components/user-tools";

const isModuleEnabled = (modules: any[], name: string) =>
  modules.find((mod) => mod.name === name)?.enable;

const UserSection = ({
  modules,
  userId,
}: {
  modules: any[];
  userId: string;
}) => (
  <>
    {isModuleEnabled(modules, "tool") && (
      <div className="col-12">
        <UserTools userId={userId} />
      </div>
    )}
    {isModuleEnabled(modules, "course") && (
      <div className="col-12">
        <UserCourses userId={userId} />
      </div>
    )}
    {isModuleEnabled(modules, "asset") && (
      <div className="col-12">
        <UserAssets userId={userId} />
      </div>
    )}
  </>
);

const AdminSection = ({ modules }: { modules: any[] }) => (
  <>
    {isModuleEnabled(modules, "leave") && (
      <div className="lg:col-6">
        <UpcomingLeaves />
      </div>
    )}
    {isModuleEnabled(modules, "employee-lifecycle") && (
      <div className="lg:col-6">
        <PendingTasks />
      </div>
    )}
    {isModuleEnabled(modules, "calendar") && (
      <>
        <div className="lg:col-6">
          <UpcomingHolidays />
        </div>
        <div className="lg:col-6">
          <UpcomingEvents />
        </div>
      </>
    )}
  </>
);

const Dashboard = () => {
  const { data } = useSession();

  // check module enabled or not
  const { modules } = useAppSelector((state) => state["setting-slice"]);

  return (
    <section className="p-6">
      {!data ? (
        <Loader />
      ) : (
        <div className="row gx-3">
          <div className="col-12 mb-8">
            <ClearCache />
            <div className="flex">
              <Gravatar
                className="rounded-md shrink-0"
                email={data?.user?.email!}
                size={72}
                default="mp"
              />
              <div className="ml-4">
                <h1 className="text-2xl mb-2">Hi, {data?.user?.name}</h1>
                <p className="text-text-light">
                  Logged in as{" "}
                  <strong className="capitalize text-dark">
                    {data?.user?.role}
                  </strong>
                </p>
              </div>
            </div>
          </div>
          {data?.user.role === "user" ? (
            <UserSection modules={modules} userId={data?.user?.id!} />
          ) : data?.user.role === "admin" ? (
            <AdminSection modules={modules} />
          ) : data?.user.role === "former" ? (
            <div className="col-12">
              <h4 className="mb-3">Your Account Has Been Archived!</h4>
              <p>
                Thanks you for your service. Your contribution to the
                organization is greatly appreciated.
              </p>
            </div>
          ) : (
            <div className="col-12">
              <h4 className="mb-3">You Don't Have Permissions!</h4>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Dashboard;
