"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingBag,
  FaThLarge,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: FaTachometerAlt },
  { label: "Products", href: "/admin/products", icon: FaBoxOpen },
  { label: "Orders", href: "/admin/orders", icon: FaShoppingBag },
  { label: "Categories", href: "/admin/categories", icon: FaThLarge },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (isLoginPage) {
      return;
    }
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    Promise.resolve().then(() => setCheckingAuth(false));
  }, [isLoginPage, router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  // Login page renders full-screen with its own design — no sidebar/topbar.
  if (isLoginPage) return <>{children}</>;

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-bg">
        <span className="font-mono text-xs uppercase tracking-widest text-steel">Loading…</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-bg">
      {/* Mobile overlay */}
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 z-40 bg-ink/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col bg-ink text-paper transition-transform duration-200 lg:translate-x-0 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-paper bg-accent text-[14px] font-extrabold text-ink">
            FG
          </div>
          <div className="min-w-0 leading-none">
            <div className="truncate text-[13px] font-extrabold tracking-wide">FUZIO GORILLA</div>
            <div className="mt-1 font-mono text-[9px] tracking-[0.13em] text-accent">ADMIN PANEL</div>
          </div>
          <button
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close menu"
            className="ml-auto shrink-0 text-steel-light lg:hidden"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-[13.5px] font-semibold transition-colors ${
                  active ? "bg-accent text-ink" : "text-steel-light hover:bg-white/5 hover:text-paper"
                }`}
              >
                <Icon size={15} className="shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-[13.5px] font-semibold text-steel-light transition-colors hover:bg-white/5 hover:text-paper"
          >
            <FaSignOutAlt size={15} className="shrink-0" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-ink/10 bg-paper px-4 py-3.5 sm:px-6">
          <button
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-ink/15 lg:hidden"
          >
            <FaBars size={15} />
          </button>
          <h1 className="truncate text-[15px] font-extrabold text-ink">
            {NAV_ITEMS.find((n) => pathname.startsWith(n.href))?.label ?? "Admin"}
          </h1>
        </header>

        {/* Page content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}