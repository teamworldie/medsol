"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));

  return (
    <Link 
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
        isActive 
          ? "bg-gray-100 text-gray-900" 
          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
