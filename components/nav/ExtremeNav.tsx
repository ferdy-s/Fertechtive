"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  UserRound,
  Briefcase,
  Newspaper,
  Phone,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";

type NavItem = { href: string; label: string; icon: any };
const NAV: NavItem[] = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/about", label: "Tentang", icon: UserRound },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/blog", label: "Tips & Trik", icon: Newspaper },
  { href: "/contact", label: "Kontak", icon: Phone },
];

export default function ExtremeNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Scroll style
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ESC close drawer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* container */}
      <div
        className={`mx-auto max-w-screen-2xl transition-all duration-300
        ${scrolled ? "mt-2 px-4" : "mt-5 px-3"}`}
      >
        <div
          className={`flex items-center justify-between rounded-3xl border
          transition-colors duration-300 px-5 py-4 md:px-8 md:py-5
          ${
            scrolled
              ? "border-white/10 bg-black/60 backdrop-blur-xl"
              : "border-white/0 bg-transparent"
          }`}
        >
          {/* Brand (desktop) */}
          <Link
            href="/"
            className="hidden md:inline-flex items-center gap-2 text-[26px] font-extrabold tracking-wide"
            aria-label="Fertechtive home"
          >
            Fertechtive<span className="text-cyan-300">.</span>
          </Link>

          {/* NAV pill center (desktop) — bigger */}
          <div className="hidden md:flex w-full justify-center">
            <nav
              aria-label="Primary"
              className="inline-flex items-center gap-6 rounded-full border border-white/5
              bg-white/10 backdrop-blur-xl px-3.5 py-2.5 shadow-[0_10px_28px_rgba(0,0,0,.25)]"
            >
              {NAV.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`inline-flex items-center gap-2.5 rounded-full px-4.5 py-2.5 text-[15px] font-semibold transition
                  ${isActive(href) ? "bg-white text-black" : "text-white/90 hover:bg-white/12"}`}
                >
                  <Icon
                    className={`h-[18px] w-[18px] ${isActive(href) ? "text-black" : "text-white/70"}`}
                    aria-hidden="true"
                  />
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* CTA (desktop) — bigger */}
          <a
            href="https://wa.me/6282134027993"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat via WhatsApp"
            className="
  group
  hidden md:inline-flex
  items-center gap-2.5
  rounded-full
  border border-white/20
  bg-gradient-to-r
  from-zinc-200/90 via-zinc-100 to-zinc-300
  px-5 py-2.5
  text-[14px]
  font-semibold
  text-black
  backdrop-blur
  shadow-[0_8px_25px_rgba(255,255,255,0.12)]
  transition-all
  duration-300
  hover:scale-[1.03]
  hover:shadow-[0_10px_35px_rgba(255,255,255,0.2)]
  active:scale-[0.97]
"
          >
            <MessageCircle className="h-[18px] w-[18px] transition-transform duration-300 group-hover:rotate-6" />
            Chat
          </a>

          {/* Mobile: brand + hamburger */}
          <div className="flex w-full items-center justify-between md:hidden">
            <Link
              href="/"
              className="text-[20px] font-extrabold tracking-wide"
              aria-label="Fertechtive home"
            >
              Fertechtive<span className="text-cyan-300">.</span>
            </Link>
            <button
              onClick={() => setOpen(true)}
              aria-label="Buka menu"
              className="grid h-11 w-11 place-items-center rounded-xl border border-white/20
                bg-black/60 backdrop-blur-md"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* === Mobile Overlay === */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* === Mobile Drawer === */}
      <aside
        className={`fixed right-0 top-0 z-50 h-screen w-[84%] max-w-sm
        bg-deep-900/95 border-l border-white/10 backdrop-blur-xl
        transition-transform duration-500 md:hidden
        ${open ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer header with brand + X */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <Link
            href="/"
            className="text-[20px] font-extrabold tracking-wide"
            onClick={() => setOpen(false)}
          >
            Fertechtive<span className="text-cyan-300">.</span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Tutup menu"
            className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-white/5"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav
          className="mt-2 flex flex-col gap-2 px-5"
          aria-label="Mobile Primary"
        >
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-semibold transition
              ${isActive(href) ? "bg-white text-black" : "text-white/90 hover:bg-white/10"}`}
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </Link>
          ))}

          <a
            href="https://wa.me/6282134027993"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat via WhatsApp"
            onClick={() => setOpen(false)}
            className="
  group
  mt-5
  inline-flex
  w-full
  items-center
  justify-center
  gap-2.5
  rounded-full
  border border-white/20
  bg-gradient-to-r
  from-zinc-200
  via-zinc-100
  to-zinc-300
  px-5
  py-3.5
  text-[15px]
  font-semibold
  text-black
  backdrop-blur
  shadow-[0_10px_28px_rgba(255,255,255,0.15)]
  transition-all
  duration-200
  active:scale-[0.96]
  active:shadow-[0_4px_12px_rgba(255,255,255,0.1)]
  focus:outline-none
  focus-visible:ring-2
  focus-visible:ring-white/40
"
          >
            <MessageCircle
              className="
    h-[18px]
    w-[18px]
    transition-transform
    duration-200
    group-active:scale-110
  "
            />

            <span>Chat via WhatsApp</span>
          </a>
        </nav>
      </aside>
    </header>
  );
}
