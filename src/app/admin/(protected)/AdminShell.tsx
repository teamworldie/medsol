"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, LogOut, LayoutDashboard, Users, Home, Calendar, CheckSquare, MessageSquare, FileText, Settings, BarChart3, Image as ImageIcon } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { signOutAction } from "@/app/actions/auth";

export default function AdminShell({
  user,
  children,
}: {
  user: { name?: string | null; email?: string | null };
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer whenever the route changes (e.g. after tapping a nav
  // link). Adjusting state during render avoids the extra cascading render
  // pass an effect would cause here.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 flex font-sans">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 z-20 transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <span className="font-serif text-lg font-bold tracking-wide text-gray-900">Admin Portal</span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-900"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <SidebarItem href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <SidebarItem href="/admin/leads" icon={<Users size={20} />} label="Leads" />
          <SidebarItem href="/admin/properties" icon={<Home size={20} />} label="Properties" />
          <SidebarItem href="/admin/viewings" icon={<Calendar size={20} />} label="Viewings" />
          <SidebarItem href="/admin/tasks" icon={<CheckSquare size={20} />} label="Tasks" />
          <SidebarItem href="/admin/messages" icon={<MessageSquare size={20} />} label="Messages" />
          <SidebarItem href="/admin/blog" icon={<FileText size={20} />} label="Blog Posts" />
          <SidebarItem href="/admin/media" icon={<ImageIcon size={20} />} label="Media" />
          <SidebarItem href="/admin/analytics" icon={<BarChart3 size={20} />} label="Analytics" />
          <div className="pt-4 mt-4 border-t border-gray-100">
            <SidebarItem href="/admin/settings" icon={<Settings size={20} />} label="Settings" />
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm">
              {user.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>

          <form action={signOutAction}>
            <button type="submit" className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors">
              <LogOut size={20} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:justify-end lg:px-8 sticky top-0 z-10">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-gray-700 hover:text-gray-900"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="text-sm text-gray-500 hover:text-gray-900">
              View Website ↗
            </Link>
          </div>
        </header>
        <div className="p-4 sm:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
