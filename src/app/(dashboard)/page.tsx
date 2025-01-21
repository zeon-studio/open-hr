"use client";

import ClearCache from "@/helpers/ClearCache";

const Home = () => {
  return (
    <section className="p-4">
      <div className="row">
        <div className="col-12">
          <ClearCache />
        </div>
        <div className="lg:col-7">
          <div className="row"></div>
        </div>
        <div className="lg:col-5"></div>
      </div>
    </section>
  );
};

export default Home;
