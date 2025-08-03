import type { Metadata } from "next";
import { Geist, Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import QueryProvider from "@/components/providers/query-provider";
import AuthDebug from "@/components/debug/auth-debug";
import { ThemeProvider } from "@/components/providers/theme-provider";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "NEBIB",
  description: "generate forms of your own",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster position="top-right" richColors />
            {/* <AuthDebug /> */}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
