import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import AdminSidebar from "@/components/admin/AdminSidebar";
import ThemeToggle from "@/components/admin/ThemeToggle";
import KPICards from "@/components/admin/KPICards";
import MobileMenuButton from "@/components/admin/MobileMenuButton";

import Link from "next/link";
import {
  Plus,
  ArrowLeft,
  ShieldCheck,
  LockKeyhole,
  Activity,
  LogOut,
  Database,
  ServerCog,
  Cpu,
  Timer,
  TriangleAlert,
  CheckCircle2,
  History,
  FileText,
  Box,
  RefreshCw,
  Wrench,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import os from "os";

export const metadata: Metadata = { title: "Admin • Fertechtive" };

/* ========= Data utils ========= */
type MonthPoint = { label: string; value: number };

async function getMonthlySeries(): Promise<MonthPoint[]> {
  const since = new Date();
  since.setMonth(since.getMonth() - 11);
  since.setHours(0, 0, 0, 0);

  const [projects, posts] = await Promise.all([
    prisma.project.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    }),
    prisma.post.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    }),
  ]);

  const buckets: Record<string, number> = {};
  const labels: string[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    labels.push(d.toLocaleString("en-US", { month: "short" }).toUpperCase());
    buckets[key] = 0;
  }
  const add = (date: Date) => {
    const k = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (k in buckets) buckets[k] += 1;
  };
  projects.forEach((p) => add(p.createdAt as Date));
  posts.forEach((p) => add(p.createdAt as Date));

  const keys = Object.keys(buckets).sort();
  return keys.map((k, idx) => ({ label: labels[idx], value: buckets[k] }));
}

/* ========= Recent Activity ========= */
type ActivityItem = {
  id: string;
  type: "project" | "post";
  title: string;
  createdAt: Date;
};

async function getRecentActivity(limit = 10): Promise<ActivityItem[]> {
  const [proj, post] = await Promise.all([
    prisma.project.findMany({
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    prisma.post.findMany({
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
  ]);
  const combined: ActivityItem[] = [
    ...proj.map((p) => ({
      id: p.id,
      type: "project" as const,
      title: p.title ?? "Untitled",
      createdAt: p.createdAt,
    })),
    ...post.map((p) => ({
      id: p.id,
      type: "post" as const,
      title: p.title ?? "Untitled",
      createdAt: p.createdAt,
    })),
  ];
  return combined.sort((a, b) => +b.createdAt - +a.createdAt).slice(0, limit);
}

/* ========= System health ========= */
type Health = {
  ok: boolean;
  db: { ok: boolean; latencyMs: number; error?: string };
  env: { ok: boolean; missing: string[] };
  runtime: {
    node: string;
    uptimeMin: number;
    memory: { rssMB: number; heapUsedMB: number };
    cpuLoad: number | null;
  };
};

async function getSystemHealth(): Promise<Health> {
  let dbOk = false;
  let dbLatency = 0;
  let dbErr: string | undefined;
  try {
    const t0 = Date.now();
    // @ts-ignore
    await prisma.$queryRaw`SELECT 1`;
    dbLatency = Date.now() - t0;
    dbOk = true;
  } catch (e: any) {
    dbOk = false;
    dbErr = e?.message ?? "DB error";
  }

  const required = ["DATABASE_URL", "NEXTAUTH_URL", "NEXTAUTH_SECRET"];
  const missing = required.filter((k) => !process.env[k]);

  const mem = process.memoryUsage();
  const rssMB = Math.round(mem.rss / 1024 / 1024);
  const heapMB = Math.round(mem.heapUsed / 1024 / 1024);
  const load =
    os.platform() === "win32" ? null : Number(os.loadavg()[0].toFixed(2));
  const uptimeMin = Math.round(os.uptime() / 60);

  const envOk = missing.length === 0;
  const ok = dbOk && envOk;

  return {
    ok,
    db: { ok: dbOk, latencyMs: dbLatency, error: dbErr },
    env: { ok: envOk, missing },
    runtime: {
      node: process.version,
      uptimeMin,
      memory: { rssMB, heapUsedMB: heapMB },
      cpuLoad: load,
    },
  };
}

/* ========= Lightweight chart ========= */
function MiniLineChart({
  series,
  stroke = "rgb(99 102 241)",
}: {
  series: MonthPoint[];
  stroke?: string;
}) {
  const W = 900,
    H = 240,
    P = 28;
  const values = series.map((s) => s.value);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const normY = (v: number) =>
    H - P - ((v - min) / Math.max(1, max - min)) * (H - P * 2);
  const step = (W - P * 2) / Math.max(1, series.length - 1);
  const path = series
    .map((s, i) => `${i === 0 ? "M" : "L"} ${P + i * step} ${normY(s.value)}`)
    .join(" ");
  const area = [
    `M ${P} ${H - P}`,
    ...series.map((s, i) => `L ${P + i * step} ${normY(s.value)}`),
    `L ${P + (series.length - 1) * step} ${H - P}`,
    "Z",
  ].join(" ");
  const endX = P + (series.length - 1) * step;
  const endY = normY(series[series.length - 1]?.value ?? 0);

  return (
    <div className="relative w-full h-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
        <defs>
          <pattern
            id="grid"
            width="36"
            height="36"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 36 0 L 0 0 0 36"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect x="0" y="0" width={W} height={H} fill="url(#grid)" />
        <path d={area} fill="rgba(99,102,241,0.08)" />
        <path
          d={path}
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          className="chart-line"
        />
        <circle
          cx={endX}
          cy={endY}
          r="4"
          fill="white"
          stroke={stroke}
          strokeWidth="3"
        />
      </svg>
      <div className="absolute bottom-1 left-0 right-0 px-3 flex justify-between text-[10px] text-zinc-500">
        {series.map((s) => (
          <span key={s.label} className="w-[36px] text-center truncate">
            {s.label}
          </span>
        ))}
      </div>
      <style>{`
        .chart-line { stroke-dasharray: 1200; stroke-dashoffset: 1200; animation: dash 1.6s ease-out forwards; }
        @keyframes dash { to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  );
}

/* ====================== PAGE ====================== */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  // ✅ route group (auth) tidak muncul di URL — gunakan /login
  if (!session?.user) redirect(`/login?callbackUrl=/admin`);

  const panel =
    "rounded-2xl border border-white/10 bg-[#0e1116]/70 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_30px_-18px_rgba(0,0,0,0.6)]";

  const [series, health, recent] = await Promise.all([
    getMonthlySeries(),
    getSystemHealth(),
    getRecentActivity(10),
  ]);

  /* ----- server actions untuk System Status ----- */
  async function recheck() {
    "use server";
    revalidatePath("/admin");
  }
  async function heal() {
    "use server";
    try {
      // @ts-ignore
      await prisma.$queryRaw`SELECT 1`;
      await Promise.all([prisma.project.count(), prisma.post.count()]);
    } finally {
      revalidatePath("/admin");
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0d12] text-zinc-200 antialiased relative">
      {/* Background */}
      <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:44px_44px]" />
        <div className="absolute inset-x-0 top-[-20%] h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(124,58,237,0.18),transparent)]" />
      </div>

      <div className="relative z-0 flex">
        {/* SIDEBAR – layer mandiri */}

        <AdminSidebar />

        {/* MAIN AREA – di-offset secara fisik */}
        <div className="ml-0 lg:ml-72 min-h-screen flex flex-col relative z-10">
          {/* HEADER */}
          <header
            className="
  sticky top-0 z-40
  border-b border-white/10
  bg-[#0b0e13]/80 backdrop-blur-xl
  transition-transform duration-300
"
          >
            <div className="mx-auto max-w-screen-2xl px-5 sm:px-6 py-3.5 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-3 min-w-0">
                <MobileMenuButton />
                <h1 className="truncate text-[1.15rem] font-semibold text-zinc-100">
                  Welcome,{" "}
                  <span className="text-violet-400">
                    {session?.user?.name ?? "Admin"}
                  </span>
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Link
                  href="/"
                  className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 transition"
                >
                  <ArrowLeft size={16} /> Main Site
                </Link>
                <Link
                  href="/admin/posts/new"
                  className="inline-flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-sm text-violet-300 hover:bg-violet-500/20 transition"
                >
                  <Plus size={16} /> New
                </Link>

                {/* Logout: POST ke NextAuth + arahkan ke /login */}
                <form
                  action="/api/auth/signout"
                  method="post"
                  className="inline"
                >
                  <input type="hidden" name="callbackUrl" value="/login" />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 transition"
                    title="Log out"
                  >
                    <LogOut size={16} /> Log out
                  </button>
                </form>
              </div>
            </div>
          </header>
          <script
            dangerouslySetInnerHTML={{
              __html: `
      (function () {
        const header = document.querySelector("header");
        const scroller = document.getElementById("admin-scroll");
        if (!header || !scroller) return;

        let lastY = 0;

        scroller.addEventListener("scroll", () => {
          const y = scroller.scrollTop;
          if (y > lastY && y > 40) {
            header.style.transform = "translateY(-100%)";
          } else {
            header.style.transform = "translateY(0)";
          }
          lastY = y;
        });
      })();
    `,
            }}
          />

          {/* CONTENT (page tidak scroll; panel terakhir scroll internal) */}
          <main
            className="
              mx-auto max-w-screen-2xl w-full px-5 sm:px-6 py-6 sm:py-8
              grid gap-6
              grid-rows-[auto_auto_1fr]   /* KPI, row chart+status, recent */
              h-[calc(100vh-64px)]        /* kunci tinggi viewport minus header */
              overflow-hidden              /* block page-level scroll */
            "
          >
            {/* KPI atas */}
            <section className={`${panel} p-4 sm:p-5`}>
              <div className="mt-4">
                <KPICards />
              </div>
            </section>

            {/* ROW: Revenue Trend (2/3) + System Status (1/3) */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Revenue */}
              <div className={`${panel} xl:col-span-2 p-5`}>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold text-zinc-400">
                    Revenue Trend
                  </h2>
                  <span className="text-[11px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/30">
                    {series.length
                      ? `+${Math.max(0, series.at(-1)!.value - (series.at(-2)?.value ?? 0))}`
                      : "0"}{" "}
                    this month
                  </span>
                </div>
                <div className="h-56 sm:h-64">
                  <MiniLineChart series={series} />
                </div>
              </div>

              {/* System Status */}
              <div className={`${panel} p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-zinc-400">
                    System Status
                  </h2>
                  <div className="flex items-center gap-2">
                    <form action={recheck}>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-white/10 transition"
                        title="Re-check health"
                      >
                        <RefreshCw size={14} /> Re-check
                      </button>
                    </form>
                    <form action={heal}>
                      <button
                        type="submit"
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs transition border ${
                          health.ok
                            ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20"
                            : "border-amber-400/30 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20"
                        }`}
                        title="Attempt to heal (warm DB & revalidate)"
                      >
                        <Wrench size={14} />{" "}
                        {health.ok ? "Warm up" : "Attempt Heal"}
                      </button>
                    </form>
                  </div>
                </div>

                <div className="mb-3">
                  {health.ok ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-xs">
                      <CheckCircle2 size={14} /> Healthy
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-400 text-xs">
                      <TriangleAlert size={14} /> Check system
                    </span>
                  )}
                </div>

                <ul className="space-y-3 text-sm">
                  <li className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-zinc-400">
                      <Database size={14} /> Database
                    </span>
                    <span
                      className={
                        health.db.ok ? "text-emerald-400" : "text-rose-400"
                      }
                    >
                      {health.db.ok
                        ? `OK (${health.db.latencyMs} ms)`
                        : `Down: ${health.db.error}`}
                    </span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-zinc-400">
                      <LockKeyhole size={14} /> Env vars
                    </span>
                    <span
                      className={
                        health.env.ok ? "text-emerald-400" : "text-amber-400"
                      }
                    >
                      {health.env.ok
                        ? "Complete"
                        : `Missing: ${health.env.missing.join(", ")}`}
                    </span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-zinc-400">
                      <ServerCog size={14} /> Uptime
                    </span>
                    <span className="text-zinc-200">
                      {health.runtime.uptimeMin} min
                    </span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-zinc-400">
                      <Cpu size={14} /> CPU load (1m)
                    </span>
                    <span className="text-zinc-200">
                      {health.runtime.cpuLoad === null
                        ? "n/a (Windows)"
                        : health.runtime.cpuLoad}
                    </span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-zinc-400">
                      <Activity size={14} /> Memory (RSS / Heap)
                    </span>
                    <span className="text-zinc-200">
                      {health.runtime.memory.rssMB} MB /{" "}
                      {health.runtime.memory.heapUsedMB} MB
                    </span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-zinc-400">
                      <Timer size={14} /> Node
                    </span>
                    <span className="text-zinc-200">{health.runtime.node}</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* ===== Recent Activity: modern, proporsional, scroll internal ===== */}
            <section className="relative h-full overflow-hidden">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/15 via-fuchsia-500/10 to-emerald-500/15 blur-xl opacity-35 pointer-events-none" />
              <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-white/10 via-white/5 to-white/10">
                <div className={`${panel} p-0 rounded-2xl overflow-hidden`}>
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                    <h2 className="text-sm font-semibold text-zinc-300 inline-flex items-center gap-2">
                      <History size={16} className="text-violet-300" />
                      Recent Activity
                    </h2>
                    <span className="text-xs text-zinc-500">
                      {recent.length} latest items
                    </span>
                  </div>

                  <div className="h-full max-h-[min(50vh,420px)] overflow-y-auto overscroll-contain">
                    {recent.length === 0 ? (
                      <div className="px-5 py-10 text-sm text-zinc-500">
                        No recent activity.
                      </div>
                    ) : (
                      <ul className="divide-y divide-white/8">
                        {recent.map((it) => (
                          <li key={`${it.type}-${it.id}`}>
                            <button
                              className="w-full text-left px-5 py-3.5 hover:bg-white/[0.035] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/40 group"
                              title={it.title}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span
                                  className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ring-1 ring-inset ${
                                    it.type === "post"
                                      ? "bg-violet-500/10 text-violet-300 ring-violet-500/30"
                                      : "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30"
                                  }`}
                                >
                                  {it.type === "post" ? (
                                    <FileText size={15} />
                                  ) : (
                                    <Box size={15} />
                                  )}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="truncate text-[15px] text-zinc-100 tracking-tight">
                                    {it.title}
                                  </div>
                                  <div className="text-[11px] text-zinc-500">
                                    {it.type === "post" ? "Post" : "Project"} •{" "}
                                    {new Date(it.createdAt).toLocaleString(
                                      "id-ID",
                                      {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      },
                                    )}
                                  </div>
                                </div>
                                <span
                                  className={`hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] ring-1 ring-inset ${
                                    it.type === "post"
                                      ? "bg-violet-500/10 text-violet-300 ring-violet-500/30"
                                      : "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30"
                                  }`}
                                >
                                  {it.type === "post" ? "POST" : "PROJECT"}
                                </span>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </main>
          <main
            id="admin-scroll"
            className="
    mx-auto max-w-screen-2xl w-full
    px-5 sm:px-6 py-6 sm:py-8
    flex-1 min-h-0
    overflow-y-auto
  "
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
