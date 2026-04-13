"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { History, LayoutDashboard, Radar } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/scan", label: "Scan", icon: Radar },
  { href: "/history", label: "History", icon: History },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="app-sidebar">
      <div className="app-sidebar__brand">
        <span className="app-sidebar__logo" aria-hidden>
          ◆
        </span>
        <div>
          <div className="app-sidebar__title">BrandGuard</div>
          <div className="app-sidebar__subtitle">Monitoring</div>
        </div>
      </div>
      <nav className="app-sidebar__nav" aria-label="Primary">
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link key={href} href={href} className={`app-sidebar__link ${active ? "is-active" : ""}`}>
              <Icon size={18} strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="app-sidebar__footer">
        <p className="app-sidebar__hint">© 2026 BrandGuard • Brand Monitoring System</p>
      </div>
    </aside>
  );
}
