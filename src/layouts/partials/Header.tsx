import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDialog } from "@/hooks/useDialog";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

const Header = () => {
  const { isDialogOpen, onDialogChange } = useDialog();
  return (
    <header className="sticky px-4 h-[50px] top-0 lg:hidden flex justify-between items-center pb-5 border-b border-b-border/30 bg-light">
      <Logo />
      <Sheet open={isDialogOpen} onOpenChange={onDialogChange}>
        <SheetTrigger asChild>
          <Button size={"sm"} variant={"ghost"} className="p-2">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="max-w-xs">
          <SheetHeader className="sr-only">
            <SheetTitle>menu bar</SheetTitle>
          </SheetHeader>
          <Sidebar
            onClose={() => {
              onDialogChange(false);
            }}
          />
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;
