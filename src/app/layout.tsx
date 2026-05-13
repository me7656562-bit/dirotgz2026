import type { Metadata } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import { SiteNav } from "@/components/SiteNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "דירות לחג — סטאלין קארלין",
  description: "חיפוש דירות לחג וסימולציית מחיר לפי תקנון המרכז",
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
          <div className="min-h-screen bg-gradient-to-b from-stone-50 via-amber-50/[0.07] to-teal-50/35 dark:from-stone-950 dark:via-stone-950 dark:to-teal-950/25">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
