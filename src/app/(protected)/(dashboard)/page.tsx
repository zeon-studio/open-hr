"use client";

import ClearCache from "@/helpers/ClearCache";
import UpcomingLeaves from "./_components/UpcomingLeaves";

const Home = () => {
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
