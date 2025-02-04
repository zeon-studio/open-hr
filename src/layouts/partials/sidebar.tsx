import { menuIcons } from "@/components/icons";
import Logo from "@/components/logo";
import { cn } from "@/lib/shadcn";
import { useAppSelector } from "@/redux/hook";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Gravatar from "react-gravatar";
import ConfirmationPopup from "../components/confirmation-popup";

const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { menus: menu } = useAppSelector((state) => state["setting-slice"]);
  const filterMenu = menu.filter((item) =>
    item.access?.includes(session?.user?.role!)
  );

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="my-10">
        <Logo className="pl-5" />
      </div>
      <nav className="px-5 flex-1 flex flex-col">
        <ul className="flex-1">
          {filterMenu.map((item) => {
            const Icon =
              menuIcons[item.name.toLocaleLowerCase()] || menuIcons.default;
            return (
              <li className="mb-2" key={item.name}>
                <Link
                  {...(onClose && { onMouseDown: onClose })}
                  href={item.url!}
                  className={cn(
                    "rounded text-black text-sm font-medium block px-2 py-2.5",
                    item.url === pathname &&
                      "bg-primary text-primary-foreground"
                  )}
                >
                  <Icon className="inline h-5 mb-0.5 mr-2" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="pb-4">
          <Dialog>
            <DialogTrigger className="bg-light w-full rounded flex items-center px-3 py-2">
              <Gravatar
                className="rounded-full mr-2 size-5"
                email={session?.user?.email!}
                size={30}
              />
              <span className="text-sm capitalize font-medium text-text-dark">
                {session?.user?.name?.slice(0, 13)}
              </span>
              <LogOut className="inline ml-auto h-5 mb-0.5" />
            </DialogTrigger>
            <ConfirmationPopup
              handleConfirmation={handleLogout}
              description="You will be logged out"
              skipWrite={true}
            />
          </Dialog>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
