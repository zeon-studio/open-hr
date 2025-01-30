"use client";

import TwSizeIndicator from "@/helpers/TwSizeIndicator";
import { AuthProvider } from "@/partials/AuthProvider";
import Providers from "@/partials/Providers";
import "@/styles/main.scss";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
const fontPrimary = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex" />
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
