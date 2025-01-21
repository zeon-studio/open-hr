"use client";

import ClearCache from "@/helpers/ClearCache";
import { useSession } from "next-auth/react";
import UpcomingLeaves from "./_components/UpcomingLeaves";

const Home = () => {
  const { data } = useSession();
  console.log(data?.user);
  return (
    <section className="px-8 py-4">
      <div className="row">
        <div className="col-12">
          <ClearCache />
        </div>
        <div className="lg:col-6">
          <div className="row">
            <UpcomingLeaves />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
