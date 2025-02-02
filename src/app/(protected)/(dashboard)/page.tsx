"use client";

import Loader from "@/components/loader";
import ClearCache from "@/helpers/clear-cache";
import { useSession } from "next-auth/react";
import Gravatar from "react-gravatar";
import PendingTasks from "./_components/pending-tasks";
import UpcomingEvents from "./_components/upcoming-events";
import UpcomingHolidays from "./_components/upcoming-holidays";
import UpcomingLeaves from "./_components/upcoming-leaves";
import UserAssets from "./_components/user-assets";
import UserCourses from "./_components/user-courses";
import UserTools from "./_components/user-tools";

const Home = () => {
  const { data } = useSession();

  return (
    <section className="p-8">
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
              />
              <div className="ml-4">
                <h1 className="text-2xl mb-2">Hi, {data?.user?.name}</h1>
                <p className="text-light">
                  Logged in as{" "}
                  <strong className="capitalize text-dark">
                    {data?.user?.role}
                  </strong>
                </p>
              </div>
            </div>
          </div>
          {data?.user.role === "user" ? (
            <>
              <div className="col-12">
                <UserTools userId={data?.user?.id!} />
              </div>
              <div className="col-12">
                <UserCourses userId={data?.user?.id!} />
              </div>
              <div className="col-12">
                <UserAssets userId={data?.user?.id!} />
              </div>
            </>
          ) : (
            <>
              <div className="lg:col-6">
                <UpcomingLeaves />
              </div>
              <div className="lg:col-6">
                <PendingTasks />
              </div>
              <div className="lg:col-6">
                <UpcomingHolidays />
              </div>
              <div className="lg:col-6">
                <UpcomingEvents />
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default Home;
