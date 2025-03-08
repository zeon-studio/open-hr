"use client";

import Loader from "@/components/loader";
import Header from "@/partials/header";
import Sidebar from "@/partials/sidebar";
import { useGetEmployeesBasicsQuery } from "@/redux/features/employeeApiSlice/employeeSlice";
import { settingApi } from "@/redux/features/settingApiSlice/settingSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { AlertDialogFooter } from "@/ui/alert-dialog";
import { Button } from "@/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  useGetEmployeesBasicsQuery(undefined);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(settingApi.endpoints.getSetting.initiate(undefined));
  }, [dispatch]);
  const { data: session, status } = useSession();

  const { app_name, company_website, favicon_url } =
    useAppSelector((state) => state["setting-slice"]) || {};

  if (status === "loading" || !app_name) {
    return <Loader />;
  }

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
      <Dialog open={session?.error === "RefreshTokenError"}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
              <LogOut className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="text-xl">Session Expired</DialogTitle>
            <DialogDescription className="mt-4">
              Your session has expired or encountered an error. Please log out
              and sign in again to refresh your session. This will ensure you
              have full access to all features.
            </DialogDescription>
          </DialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                signOut();
              }}
            >
              Log Out
            </Button>
          </AlertDialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex justify-between">
        <aside className="w-0 overflow-hidden lg:block transition-[width] flex-none lg:w-[220px] bg-background min-h-screen h-screen sticky left-0 top-0">
          <Sidebar />
        </aside>

        <div className="flex-1 py-5 px-5 lg:pl-0 max-w-full overflow-x-hidden">
          <Header />
          <main className="flex-1 max-w-full h-full rounded-lg bg-light overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
