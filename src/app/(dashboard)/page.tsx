"use client";

import ClearCache from "@/helpers/ClearCache";
import Base from "@/partials/Base";
import { useSession } from "next-auth/react";

const Home = () => {
  const { data: session } = useSession();

  return (
    <Base>
      <section className="p-4">
        {session?.user?.role === "admin" ? (
          <div className="row">
            <div className="col-12">
              <ClearCache />
            </div>
            <div className="lg:col-7">
              <div className="row"></div>
            </div>
            <div className="lg:col-5"></div>
          </div>
        ) : (
          <>hello</>
        )}
      </section>
    </Base>
  );
};

export default Home;
