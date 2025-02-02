"use client";

import TwSizeIndicator from "@/helpers/tw-size-indicator";
import { AuthProvider } from "@/partials/auth-provider";
import Providers from "@/partials/providers";
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
