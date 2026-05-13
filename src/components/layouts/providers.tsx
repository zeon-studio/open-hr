"use client";
import { AppStateProvider } from "@/lib/app-context";
import { ReactNode } from "react";

const Providers = ({ children }: { children: ReactNode }) => {
  return <AppStateProvider>{children}</AppStateProvider>;
};

export default Providers;
