"use client";

import { Toaster } from "@/components/ui/toaster";
import config from "@/config/config.json";
import TwSizeIndicator from "@/helpers/TwSizeIndicator";
import { AuthProvider } from "@/partials/AuthProvider";
import Providers from "@/partials/Providers";
import "@/styles/main.scss";
import { Inter } from "next/font/google";

const fontPrimary = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { title, favicon } = config.site;
  return (
    <html lang="en">
      <head>
        <meta name="description" content={title} />
        <meta name="robots" content="noindex" />
        <link rel="icon" href={favicon} />
        <title>{title}</title>
      </head>
      <body className={fontPrimary.className} suppressHydrationWarning={true}>
        <TwSizeIndicator />
        <AuthProvider>
          <Providers>{children}</Providers>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
