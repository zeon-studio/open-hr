"use client";

import { cn } from "@/lib/shadcn";
import { useAppSelector } from "@/redux/hook";
import Link from "next/link";
import { useEffect, useState } from "react";

const Logo = ({ src, className }: { src?: string; className?: string }) => {
  const {
    logo_url: logo,
    logo_width,
    logo_height,
    app_name: logo_text,
  } = useAppSelector((state) => state["setting-slice"]);
  const logoPath = logo ? logo : src;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <Link href="/" className={cn("navbar-brand inline-block", className)}>
      {logoPath && logo_width && logo_height ? (
        <img
          width={logo_width}
          height={logo_height}
          src={logoPath}
          alt={logo_text}
        />
      ) : logo_text ? (
        logo_text
      ) : (
        logo_text
      )}
    </Link>
  );
};
export default Logo;
