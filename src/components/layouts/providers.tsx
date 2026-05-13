"use client";
import { AppStateProvider } from "@/lib/app-state";
import { ReactNode } from "react";

const Providers = ({ children }: { children: ReactNode }) => {
  return <AppStateProvider>{children}</AppStateProvider>;
};

export default Providers;
