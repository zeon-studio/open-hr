import { auth } from "@/auth";
import TwSizeIndicator from "@/helpers/tw-size-indicator";
import Providers from "@/partials/providers";
import "@/styles/main.css";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const fontPrimary = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-primary",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex" />
      </head>
      <body className={fontPrimary.variable} suppressHydrationWarning={true}>
        <TwSizeIndicator />
        <SessionProvider key={JSON.stringify(session)} session={session}>
          <Providers>{children}</Providers>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
