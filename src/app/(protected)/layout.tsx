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
    <div className="flex justify-between">
      <aside className="w-0 overflow-hidden lg:block transition-[width] flex-none md:w-72 bg-background min-h-screen h-screen sticky left-0 top-0">
        <Sidebar />
      </aside>

      <div className="w-full p-5">
        <Header />
        <main className="h-full rounded-lg bg-light">{children}</main>
      </div>
    </div>
  );
}
