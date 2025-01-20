import config from "@/config/config.json";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Header = ({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: Function;
}) => {
  const { logo, logo_height, logo_width, logo_text } = config.site;
  return (
    <header className="sticky px-4 py-2 h-[50px] top-0 shadow-sm bg-white sm:hidden">
      {!sidebarOpen && (
        <Link href="/">
          <Image
            src={logo}
            alt={logo_text}
            width={logo_width}
            height={logo_height}
          />
        </Link>
      )}
      <div
        className={`p-3 absolute top-0 ${
          sidebarOpen ? "right-[180px]" : "right-0"
        }`}
      >
        {sidebarOpen ? (
          <X size={25} onClick={() => setSidebarOpen(!sidebarOpen)} />
        ) : (
          <Menu size={25} onClick={() => setSidebarOpen(!sidebarOpen)} />
        )}
      </div>
    </header>
  );
};

export default Header;
