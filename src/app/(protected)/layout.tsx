"use client";

import Loader from "@/components/loader";
import { useSettingsQuery } from "@/features/settings/api";
import { useAppState } from "@/lib/app-context";
import { useSettings } from "@/hooks/use-settings";
import Header from "@/layouts/header";
import Sidebar from "@/layouts/sidebar";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  const { setSetting } = useAppState();
  const { data: settingData } = useSettingsQuery(undefined);

  useEffect(() => {
    if (settingData?.result) {
      setSetting(settingData.result);
    }
  }, [settingData, setSetting]);

  const { status } = useSession();
  const { app_name, company_website, favicon_url } = useSettings() || {};

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
        <aside className="w-0 overflow-hidden lg:block transition-[width] flex-none lg:w-55 bg-background min-h-screen h-screen sticky left-0 top-0">
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
