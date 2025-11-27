"use client";

import Loader from "@/components/loader";
import Header from "@/partials/header";
import Sidebar from "@/partials/sidebar";
import { useGetEmployeesBasicsQuery } from "@/redux/features/employeeApiSlice/employeeSlice";
import { settingApi } from "@/redux/features/settingApiSlice/settingSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  useGetEmployeesBasicsQuery(undefined);
  const dispatch = useAppDispatch();

  // Initialize settings on first render
  useEffect(() => {
    dispatch(settingApi.endpoints.getSetting.initiate(undefined));
  }, [dispatch]);

  const { status } = useSession();
  const { app_name, company_website, favicon_url } =
    useAppSelector((state) => state["setting-slice"]) || {};

  // Only show loader for session loading, not for mounting
  if (status === "loading") {
    return <Loader />;
  }

  return (
    <>
      <title>{app_name || "Loading..."}</title>
      <link
        rel="icon"
        href={
          favicon_url ||
          `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${company_website}&size=64`
        }
      />
      <div className="flex">
        <aside className="w-0 overflow-hidden lg:block transition-[width] flex-none lg:w-[220px] bg-background min-h-screen h-screen sticky left-0 top-0">
          <Sidebar />
        </aside>

        <div className="flex-1 flex flex-col min-h-screen min-w-0">
          <Header />

          <div className="flex-1 overflow-y-auto py-5 px-5 lg:pl-0 max-w-full">
            <main className="max-w-full rounded-lg bg-light min-h-full">
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
