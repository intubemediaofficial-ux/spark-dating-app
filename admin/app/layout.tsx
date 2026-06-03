import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spark Dating - Admin Panel",
  description: "Admin dashboard for Spark Dating App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 fixed h-full">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-red-500">🔥 Spark</h1>
              <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
            </div>
            <nav className="mt-4">
              <a href="/" className="flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-500 transition">
                <span className="mr-3">📊</span> Dashboard
              </a>
              <a href="/users" className="flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-500 transition">
                <span className="mr-3">👥</span> Users
              </a>
              <a href="/reports" className="flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-500 transition">
                <span className="mr-3">🚨</span> Reports
              </a>
              <a href="/matches" className="flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-500 transition">
                <span className="mr-3">💕</span> Matches
              </a>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="ml-64 flex-1 p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
