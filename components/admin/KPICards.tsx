import { prisma } from "@/lib/prisma";
import { Boxes, FileText, Inbox, Eye } from "lucide-react";
export const runtime = "nodejs";

async function getViews7d(): Promise<number> {
  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const count = await (prisma as any).viewEvent?.count?.({
      where: { createdAt: { gte: since } },
    });
    return count ?? 0;
  } catch {
    return 0;
  }
}

export default async function KPICards() {
  const [projects, posts, cv, views7d] = await Promise.all([
    prisma.project.count(),
    prisma.post.count(),
    prisma.cvRequest.count(),
    getViews7d(),
  ]);

  const cards = [
    {
      label: "Projects",
      value: projects,
      hint: "total items",
      accent: "from-cyan-400/25 via-cyan-500/15 to-transparent",
      chip: "from-cyan-500/25 to-cyan-400/15",
      Icon: Boxes,
    },
    {
      label: "Posts",
      value: posts,
      hint: "total articles",
      accent: "from-emerald-400/25 via-emerald-500/15 to-transparent",
      chip: "from-emerald-500/25 to-emerald-400/15",
      Icon: FileText,
    },
    {
      label: "CV Requests",
      value: cv,
      hint: "inbox items",
      accent: "from-amber-400/25 via-amber-500/15 to-transparent",
      chip: "from-amber-500/25 to-amber-400/15",
      Icon: Inbox,
    },
    {
      label: "Views (7d)",
      value: views7d,
      hint: "portfolio & blog",
      accent: "from-violet-400/25 via-violet-500/15 to-transparent",
      chip: "from-violet-500/25 to-violet-400/15",
      Icon: Eye,
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map(({ label, value, hint, accent, chip, Icon }) => (
        <div
          key={label}
          className={[
            // card container (glassy hi-tech)
            "group relative overflow-hidden rounded-2xl",
            "border border-white/10 bg-[#0f1218]/70 backdrop-blur-xl",
            "ring-1 ring-inset ring-white/5",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_10px_35px_-20px_rgba(0,0,0,0.6)]",
            "transition-transform duration-300 hover:-translate-y-[1px]",
          ].join(" ")}
        >
          {/* soft gradient accent sweep */}
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${accent}`}
          />

          {/* subtle glow ring when hover */}
          <div
            aria-hidden
            className="absolute -inset-px rounded-2xl ring-1 ring-transparent group-hover:ring-white/10 transition duration-300"
          />

          <div className="relative p-4 sm:p-5">
            {/* header row: icon chip + label */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={[
                    "inline-flex h-9 w-9 items-center justify-center shrink-0 rounded-xl",
                    "border border-white/10",
                    "bg-gradient-to-br",
                    chip,
                  ].join(" ")}
                >
                  <Icon size={16} className="text-zinc-200" />
                </span>
                <div className="text-sm text-zinc-400 truncate">{label}</div>
              </div>

              {/* live dot */}
              <span className="h-1.5 w-1.5 rounded-full bg-white/40 group-hover:bg-white/60 transition shadow-[0_0_8px] shadow-white/40" />
            </div>

            {/* value */}
            <div className="mt-3 flex items-baseline gap-2">
              <div className="text-3xl font-semibold tracking-tight text-zinc-100">
                {value}
              </div>
            </div>

            {/* hint */}
            <div className="mt-1 text-[11px] leading-5 text-zinc-500">
              {hint}
            </div>

            {/* bottom hairline (gives device-like feel) */}
            <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </div>
      ))}
    </div>
  );
}
