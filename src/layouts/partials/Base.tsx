import { updatePage } from "@/redux/features/filterSlice/filterSlice";
import { useAppDispatch } from "@/redux/hook";
import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import Loader from "../components/Loader";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Base = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/");
    },
  });

  const pathname = usePathname();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(updatePage(1));
  }, [pathname, dispatch]);

  return !session ? (
    <Loader />
  ) : (
    <div className="flex justify-between overflow-x-hidden">
      <Sidebar className={`${sidebarOpen ? "left-0" : "-left-[180px]"}`} />
      <main
        className={`sm:w-[calc(100%-180px)] w-full sm:ml-[180px] ${
          sidebarOpen && "-mr-[180px] ml-[180px]"
        }`}
      >
        <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
        {children}
      </main>
    </div>
  );
};

export default Base;
