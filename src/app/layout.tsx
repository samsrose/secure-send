import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { googleSans, googleSansCode } from "@/lib/fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: "Secure Share",
  description: "Encrypt and share secrets with a password-protected link.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${googleSans.variable} ${googleSansCode.variable} ${googleSans.className} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          {children}
          <Toaster richColors closeButton position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
