"use client";

import Loader from "@/components/Loader";
import Header from "@/partials/Header";
import Sidebar from "@/partials/Sidebar";
import { useGetEmployeesBasicsQuery } from "@/redux/features/employeeApiSlice/employeeSlice";
import { updatePage } from "@/redux/features/filterSlice/filterSlice";
import { useAppDispatch } from "@/redux/hook";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  useGetEmployeesBasicsQuery(undefined);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(updatePage(1));
  }, [pathname, dispatch]);

  const { status } = useSession();

  if (status === "loading") {
    return <Loader />;
  }

  return (
    <div className="flex justify-between">
      <aside className="w-0 overflow-hidden lg:block transition-[width] flex-none lg:w-72 bg-background min-h-screen h-screen sticky left-0 top-0">
        <Sidebar />
      </aside>

      <div className="w-full p-5 bg-light">
        <Header />
        <main className="h-full rounded-lg bg-light">{children}</main>
      </div>
    </div>
  );
}
