import type { Metadata } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: "דירות לחג — סטאלין קארלין",
  description: "חיפוש דירות לחג וסימולטור מחיר לפי תקנון המרכז",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className="font-sans antialiased text-stone-900 dark:text-stone-50">
        <AuthProvider>
          <SiteNav />
          <div className="flex min-h-screen flex-col bg-gradient-to-b from-stone-50 via-amber-50/[0.07] to-teal-50/35 dark:from-stone-950 dark:via-stone-950 dark:to-teal-950/25">
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
