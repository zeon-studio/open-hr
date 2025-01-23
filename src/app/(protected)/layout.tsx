"use client";

import Header from "@/partials/Header";
import Sidebar from "@/partials/Sidebar";
import { useGetEmployeesBasicsQuery } from "@/redux/features/employeeApiSlice/employeeSlice";
import { updatePage } from "@/redux/features/filterSlice/filterSlice";
import { useAppDispatch } from "@/redux/hook";
import { Loader2 } from "lucide-react";
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
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin size-8" />
      </div>
    );
  }

  return (
    <div className="flex justify-between">
      <aside className="w-0 overflow-hidden lg:block transition-[width] flex-none lg:w-72 bg-background min-h-screen h-screen sticky left-0 top-0">
        <Sidebar />
      </aside>

      <div className="w-full p-5">
        <Header />
        <main className="h-full rounded-lg bg-light">{children}</main>
      </div>
    </div>
  );
}
