"use client";

import Loader from "@/components/Loader";
import Header from "@/partials/Header";
import Sidebar from "@/partials/Sidebar";
import { useGetEmployeesBasicsQuery } from "@/redux/features/employeeApiSlice/employeeSlice";
import { settingApi } from "@/redux/features/settingApiSlice/settingSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  useGetEmployeesBasicsQuery(undefined);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(settingApi.endpoints.getSetting.initiate(undefined));
  }, [dispatch]);
  const { status } = useSession();
  const { app_name, logo_url } = useAppSelector(
    (state) => state["setting-slice"]
  );

  if (status === "loading") {
    return <Loader />;
  }

  return (
    <>
      <title>{app_name}</title>
      <link rel="icon" href={logo_url} />
      <div className="flex justify-between">
        <aside className="w-0 overflow-hidden lg:block transition-[width] flex-none lg:w-[220px] bg-background min-h-screen h-screen sticky left-0 top-0">
          <Sidebar />
        </aside>

        <div className="flex-1 p-5 max-w-full overflow-x-hidden">
          <Header />
          <main className="flex-1 max-w-full h-full rounded-lg bg-light overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
