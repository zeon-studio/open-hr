"use client";
import Logo from "@/components/logo";
import { useAppState } from "@/lib/app-state";
import { useSettings } from "@/hooks/use-settings";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { setSetting } = useAppState();

  useEffect(() => {
    let mounted = true;

    const loadSetting = async () => {
      try {
        const response = await fetch("/api/setting", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        if (mounted && data?.result) {
          setSetting(data.result);
        }
      } catch {
        // Ignore setting bootstrap failures in auth pages.
      }
    };

    loadSetting();
    return () => {
      mounted = false;
    };
  }, [setSetting]);

  const { app_name, company_website, favicon_url } = useSettings() || {};

  return (
    <>
      <title>{app_name}</title>
      <link
        rel="icon"
        href={
          favicon_url ||
          `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${company_website}&size=64`
        }
      />
      <div className="h-screen flex items-center justify-center bg-light">
        <div className="p-10 rounded-lg bg-background max-w-md w-full">
          <div className="flex flex-col items-center">
            <Logo className="mb-4" />
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
