"use client";

type SidebarEventDetail = {
  source: "mobile-menu-button";
  at: number;
};

export default function MobileMenuButton() {
  const openSidebar = () => {
    // Kirim event yang sama (kompatibel) + sedikit detail untuk observabilitas
    const evt = new CustomEvent<SidebarEventDetail>("open-admin-sidebar", {
      detail: { source: "mobile-menu-button", at: Date.now() },
    });
    document.dispatchEvent(evt);
  };

  return (
    <button
      type="button"
      onClick={openSidebar}
      aria-label="Buka menu"
      title="Buka menu"
      aria-controls="admin-sidebar"
      className={[
        "lg:hidden inline-flex h-10 w-10 items-center justify-center",
        "rounded-xl border border-white/10 bg-white/5 hover:bg-white/10",
        "transition-colors duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-0",
        "active:scale-[0.98]",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]",
        "backdrop-blur-sm",
      ].join(" ")}
    >
      {/* Icon hamburger dengan animasi subtle */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="opacity-80 transition-transform duration-200 group-hover:translate-y-px"
      >
        <path fill="currentColor" d="M3 7h18v2H3zM3 11h18v2H3zM3 15h18v2H3z" />
      </svg>
    </button>
  );
}
