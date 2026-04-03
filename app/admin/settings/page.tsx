import os from "os";
import { headers, cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * HIGH-TECH ADMIN SETTINGS
 * Single-file • Server-only • Next.js 15 compatible
 */

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  /* ===============================
     REQUEST & SECURITY TELEMETRY
     =============================== */

  const h = await headers();
  const c = await cookies();

  const ip =
    h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "unknown";

  const userAgent = h.get("user-agent") ?? "unknown";
  const isBot = /bot|crawler|spider|curl|wget/i.test(userAgent);
  const cookieCount = c.getAll().length;

  /* ===============================
     SYSTEM TELEMETRY
     =============================== */

  const uptimeMin = Math.floor(process.uptime() / 60);
  const memory = process.memoryUsage();
  const cpuLoad = os.loadavg()[0];
  const nodeVersion = process.version;
  const platform = `${os.platform()} (${os.arch()})`;

  /* ===============================
     SERVER ACTIONS
     =============================== */

  async function updateAccount(formData: FormData) {
    "use server";

    const username = formData.get("username");
    const password = formData.get("password");

    if (!username && !password) return;

    // Slot produksi (hash password, update DB, audit log, dll)
    revalidatePath("/admin/settings");
  }

  async function refreshSystem() {
    "use server";

    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");
    revalidatePath("/admin/settings");
  }

  /* ===============================
     UI
     =============================== */

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-16">
      {/* HEADER */}
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Admin Settings & System Control
        </h1>
        <p className="text-sm opacity-60 max-w-2xl">
          Advanced runtime inspection, security telemetry, account management,
          and system revalidation. Server-side, real data, no simulation.
        </p>
      </header>

      {/* SYSTEM STATUS */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat label="Uptime" value={`${uptimeMin} min`} />
        <Stat label="CPU Load (1m)" value={cpuLoad.toFixed(2)} />
        <Stat
          label="Memory (RSS)"
          value={`${Math.round(memory.rss / 1024 / 1024)} MB`}
        />
        <Stat label="Node.js" value={nodeVersion} />
      </section>

      {/* SECURITY */}
      <section className="space-y-4">
        <SectionTitle>Security & Request Telemetry</SectionTitle>

        <div className="rounded-xl border border-white/10 divide-y divide-white/10">
          <Row label="Request IP" value={ip} />
          <Row label="User-Agent" value={userAgent} />
          <Row label="Bot Detected" value={isBot ? "YES" : "NO"} />
          <Row label="Cookies Present" value={`${cookieCount}`} />
          <Row label="Platform" value={platform} />
        </div>
      </section>

      {/* ACCOUNT */}
      <section className="space-y-4 max-w-md">
        <SectionTitle>Administrator Account</SectionTitle>

        <form action={updateAccount} className="space-y-3">
          <input
            name="username"
            placeholder="Update username"
            className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-white"
          />
          <input
            name="password"
            type="password"
            placeholder="Update password"
            className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-white"
          />
          <button className="rounded-lg border border-white/30 px-4 py-2 text-sm hover:bg-white hover:text-black transition">
            Apply Changes
          </button>
        </form>
      </section>

      {/* SYSTEM CONTROL */}
      <section className="space-y-4">
        <SectionTitle>System Control</SectionTitle>

        <form action={refreshSystem}>
          <button className="rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-5 py-2.5 text-sm text-emerald-300 hover:bg-emerald-400/20 transition">
            Revalidate & Refresh Entire System
          </button>
        </form>
      </section>
    </section>
  );
}

/* ===============================
   UI PRIMITIVES
   =============================== */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 p-4">
      <div className="text-sm opacity-60">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm uppercase tracking-wide opacity-60">{children}</h2>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3 text-sm">
      <span className="opacity-60">{label}</span>
      <span className="text-right break-all">{value}</span>
    </div>
  );
}
