"use client";

import config from "@/config/config.json";
import { cn } from "@/lib/shadcn";
import Image from "next/image";
import Link from "next/link";

const Logo = ({ src, className }: { src?: string; className?: string }) => {
  const {
    logo,
    logo_width,
    logo_height,
    logo_text,
    title,
  }: {
    logo: string;
    logo_width: any;
    logo_height: any;
    logo_text: string;
    title: string;
  } = config.site;

  const logoPath = logo ? logo : src;

  return (
    <Link href="/" className={cn("navbar-brand inline-block", className)}>
      {logoPath ? (
        <Image
          width={logo_width}
          height={logo_height}
          src={logoPath}
          alt={title}
          priority
        />
      ) : logo_text ? (
        logo_text
      ) : (
        title
      )}
    </Link>
  );
};
export default Logo;
