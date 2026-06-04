import type { Metadata } from "next";
import "./globals.css";
import AdminShell from "@/components/AdminShell";

export const metadata: Metadata = {
  title: "MatchKar - Admin Panel",
  description: "Admin dashboard for MatchKar Dating App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
