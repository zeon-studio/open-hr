"use client";

import TwSizeIndicator from "@/helpers/tw-size-indicator";
import { AuthProvider } from "@/partials/auth-provider";
import Providers from "@/partials/providers";
import "@/styles/main.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const fontPrimary = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-primary",
});

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
      <body className={fontPrimary.variable} suppressHydrationWarning={true}>
        <TwSizeIndicator />
        <AuthProvider>
          <Providers>{children}</Providers>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
