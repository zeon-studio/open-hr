"use client";

import Header from "@/partials/Header";
import Sidebar from "@/partials/Sidebar";
import { useGetEmployeesIdQuery } from "@/redux/features/employeeApiSlice/employeeSlice";
import { updatePage } from "@/redux/features/filterSlice/filterSlice";
import { useAppDispatch } from "@/redux/hook";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  useGetEmployeesIdQuery(undefined);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(updatePage(1));
  }, [pathname, dispatch]);

  return (
    <div className="flex justify-between overflow-x-hidden">
      <aside className="w-0 overflow-hidden lg:block transition-[width] flex-none md:w-72 bg-background min-h-screen relative">
        <Sidebar />
      </aside>

      <div className="w-full p-5">
        <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
        <main className="h-full rounded-lg bg-light">{children}</main>
      </div>
    </div>
  );
}
