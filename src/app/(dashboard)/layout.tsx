"use client";

import Header from "@/partials/Header";
import Sidebar from "@/partials/Sidebar";
import { updatePage } from "@/redux/features/filterSlice/filterSlice";
import { useAppDispatch } from "@/redux/hook";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(updatePage(1));
  }, [pathname, dispatch]);

  return (
    <div className="flex justify-between overflow-x-hidden">
      <aside className="w-0 overflow-hidden lg:block transition-[width] flex-none md:w-72 bg-background min-h-screen relative border-r border-r-border/10">
        <Sidebar />
      </aside>

      <div className="w-full">
        <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
        <main className="h-full">{children}</main>
      </div>
    </div>
  );
}
