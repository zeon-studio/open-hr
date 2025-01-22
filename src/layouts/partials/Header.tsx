import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

const Header = () => {
  return (
    <header className="sticky px-4 h-[50px] top-0 shadow-sm bg-white lg:hidden flex justify-between items-center">
      <Logo />
      <Sheet>
        <SheetTrigger asChild>
          <Button>
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="max-w-xs">
          <Sidebar />
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;
