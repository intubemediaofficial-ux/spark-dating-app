"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (pathname === "/login") {
      setIsAuthenticated(false);
      return;
    }

    const auth = localStorage.getItem("matchkar_admin_auth");
    if (auth) {
      try {
        const parsed = JSON.parse(auth);
        if (parsed.loggedIn) {
          setIsAuthenticated(true);
          return;
        }
      } catch {}
    }
    window.location.href = "/login";
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("matchkar_admin_auth");
    window.location.href = "/login";
  };

  if (pathname === "/login") {
    return <>{children}</>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-red-500">MatchKar</h1>
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
          <a href="/bots" className="flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-500 transition">
            <span className="mr-3">🤖</span> Bots
          </a>
          <a href="/subscriptions" className="flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-500 transition">
            <span className="mr-3">💎</span> Subscriptions
          </a>
          <a href="/settings" className="flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-500 transition">
            <span className="mr-3">⚙️</span> Settings
          </a>
        </nav>
        <div className="absolute bottom-4 left-0 right-0 px-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
          >
            <span className="mr-3">🚪</span> Logout
          </button>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
