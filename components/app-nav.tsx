"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import type { AuthUser } from "@/lib/auth";

type NavItem = { href: string; label: string; shortLabel: string; icon: string };

const navItems: NavItem[] = [
  { href: "/dashboard", label: "工作台", shortLabel: "工作台", icon: "▦" },
  { href: "/career-plan", label: "职业规划", shortLabel: "规划", icon: "◇" },
  { href: "/career-paths", label: "职业方向", shortLabel: "方向", icon: "◎" },
  { href: "/learning", label: "学习实践", shortLabel: "学习", icon: "✓" },
  { href: "/profile", label: "个人中心", shortLabel: "我的", icon: "◌" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppNav({ user }: { user: AuthUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const displayName = user.username.length > 12 ? `${user.username.slice(0, 12)}…` : user.username;

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <aside className="app-nav" aria-label="已登录导航">
      <Link className="app-nav-brand" href="/dashboard" aria-label="返回工作台">
        <span className="app-nav-mark">✦</span><span>职业规划工作台</span>
      </Link>
      <nav className="app-nav-links">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link className={active ? "app-nav-link active" : "app-nav-link"} href={item.href} key={item.href} aria-current={active ? "page" : undefined}>
              <span className="app-nav-icon" aria-hidden="true">{item.icon}</span>
              <span className="app-nav-label">{item.label}</span><span className="app-nav-short-label">{item.shortLabel}</span>
            </Link>
          );
        })}
      </nav>
      <div className="app-nav-user">
        <div className="app-nav-avatar" aria-hidden="true">{user.username.slice(0, 1).toUpperCase()}</div>
        <div className="app-nav-user-copy"><strong title={user.username}>{displayName}</strong><span>{user.email}</span></div>
        <button className="logout-button" type="button" onClick={handleLogout} disabled={isLoggingOut}>{isLoggingOut ? "正在退出…" : "退出登录"}</button>
      </div>
    </aside>
  );
}
