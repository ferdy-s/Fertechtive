"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Boxes,
  Newspaper,
  Mail,
  Settings as SettingsIcon,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  Icon: LucideIcon;
};

const NAV: NavItem[] = [
  { href: "/admin", label: "Overview", Icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", Icon: Boxes },
  { href: "/admin/posts", label: "Posts", Icon: Newspaper },
  { href: "/admin/cv", label: "CV Requests", Icon: Mail },
  { href: "/admin/settings", label: "Settings", Icon: SettingsIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openHandler = () => setOpen(true);
    document.addEventListener("open-admin-sidebar", openHandler as any);
    return () =>
      document.removeEventListener("open-admin-sidebar", openHandler as any);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed z-50 inset-y-0 left-0 w-72
        border-r border-white/10
        bg-[#0b0d12]/80 backdrop-blur-xl
        shadow-[0_0_35px_-18px_rgba(124,58,237,0.55)]
        transition-transform duration-300 lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Admin sidebar"
      >
        {/* Top brand / close */}
        <div className="h-16 px-7 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="text-base font-semibold tracking-tight">
              <span className="text-zinc-200">Fertechtive</span>{" "}
              <span className="text-zinc-400">Admin</span>
            </div>
          </div>
          <button
            className="lg:hidden rounded-lg border border-white/10 bg-white/5 p-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3l6.3-6.3-6.3-6.3L4.3 4.3l6.3 6.3 6.3-6.3z"
              />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="px-3 py-4">
          <p className="px-3 pb-2 text-[10px] uppercase tracking-[0.15em] text-zinc-500">
            Navigation
          </p>

          <ul className="space-y-1.5">
            {NAV.map(({ href, label, Icon }) => {
              const active =
                pathname === href || pathname.startsWith(href + "/");
              return (
                <li key={href} className="relative">
                  {/* Left active bar */}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-[3px] rounded-r bg-gradient-to-b from-violet-400 to-fuchsia-500 shadow-[0_0_12px] shadow-violet-600/60"
                    />
                  )}

                  <Link
                    href={href}
                    className={[
                      "group flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-xl text-sm",
                      "border transition ring-1 ring-inset",
                      active
                        ? "border-violet-500/30 ring-white/5 bg-violet-500/[0.10] hover:bg-violet-500/[0.16] text-zinc-100"
                        : "border-white/10 ring-white/5 bg-white/5 hover:bg-white/10 text-zinc-300",
                    ].join(" ")}
                    aria-current={active ? "page" : undefined}
                  >
                    <span
                      className={[
                        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        active
                          ? "bg-violet-500/15 border border-violet-500/30"
                          : "bg-white/5 border border-white/10 group-hover:border-white/20",
                      ].join(" ")}
                    >
                      <Icon
                        size={16}
                        className={active ? "text-violet-300" : "text-zinc-300"}
                      />
                    </span>

                    <span className="truncate">{label}</span>

                    {active && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_10px] shadow-violet-500/70" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer / status */}
        <div className="absolute bottom-0 inset-x-0 p-4 border-t border-white/10">
          <div className="text-[11px] text-zinc-400">
            <div className="flex items-center justify-between">
              <span>Data encrypted</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400/90 shadow-[0_0_10px] shadow-emerald-500/70" />
            </div>
            <div className="mt-1 text-zinc-500">Role-based access</div>
          </div>
        </div>
      </aside>
    </>
  );
}
