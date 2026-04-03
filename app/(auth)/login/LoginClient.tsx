// app/(auth)/login/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

/* ====== Data CAPTCHA: keluarga Ferdy ====== */
const FAMILY = {
  ayah: "supardi",
  ibu: "tatywigyati",
  kaka1: "ruri irawan",
  kaka2: "popi ari kurniawan",
  kaka3: "yessa saptiani",
  saya: "ferdy salsabilla",
} as const;

type FamKey = keyof typeof FAMILY;

const QUESTION_BANK: Array<{ key: FamKey; q: string; a: string }> = [
  { key: "ayah", q: "Siapa nama ayah Ferdy?", a: FAMILY.ayah },
  { key: "ibu", q: "Siapa nama ibu Ferdy?", a: FAMILY.ibu },
  { key: "kaka1", q: "Siapa nama kakak 1 Ferdy?", a: FAMILY.kaka1 },
  { key: "kaka2", q: "Siapa nama kakak 2 Ferdy?", a: FAMILY.kaka2 },
  { key: "kaka3", q: "Siapa nama kakak 3 Ferdy?", a: FAMILY.kaka3 },
  { key: "saya", q: "Siapa nama lengkap Ferdy sendiri?", a: FAMILY.saya },
];

/* ====== Utils ====== */
function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function sample<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function LoginPage() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/admin";

  // NOTE: Prefill untuk dev; hapus saat production
  const [email, setEmail] = useState("ferdysalsabilla87@gmail.com");
  const [password, setPassword] = useState("ferdysal123");

  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // ====== CAPTCHA state ======
  const [question, setQuestion] = useState<{ q: string; a: string } | null>(
    null,
  );
  const allNames = useMemo(() => Object.values(FAMILY) as string[], []);
  const [choices, setChoices] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string>("");

  const buildCaptcha = () => {
    const picked = sample(QUESTION_BANK);
    const others = shuffle(allNames.filter((n) => n !== picked.a)).slice(0, 3);
    const opts = shuffle([picked.a, ...others]);
    setQuestion({ q: picked.q, a: picked.a });
    setChoices(opts);
    setAnswer("");
  };

  useEffect(() => {
    buildCaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    // Validasi CAPTCHA
    if (!answer) {
      setErr("Mohon jawab CAPTCHA terlebih dahulu.");
      return;
    }
    if (answer !== question?.a) {
      setErr("Jawaban CAPTCHA salah. Coba lagi.");
      buildCaptcha();
      return;
    }

    setLoading(true);
    try {
      await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl,
      });
    } catch {
      setErr("Terjadi kesalahan saat login.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 grid place-items-center bg-[radial-gradient(60rem_60rem_at_50%_-20%,rgba(99,102,241,.25),transparent)]">
      {/* Background grid + glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,.75) 60%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Card */}
      <form
        onSubmit={onSubmit}
        className="relative w-[95%] max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_30px_80px_-20px_rgba(80,80,255,0.25)] backdrop-blur-xl sm:p-8"
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Admin Login</h1>
          <p className="mt-1 text-sm text-white/60">
            Akses dashboard dengan keamanan tambahan (Custom CAPTCHA).
          </p>
        </div>

        {/* Email */}
        <label className="mb-2 block text-sm font-medium text-white/80">
          Email
        </label>
        <input
          className="mb-4 w-full rounded-xl border border-white/10 bg-white/[0.06] p-3 outline-none placeholder:text-white/40 focus:border-violet-300/40 focus:ring-2 focus:ring-violet-400/50"
          placeholder="nama@email.com"
          type="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <label className="mb-2 block text-sm font-medium text-white/80">
          Password
        </label>
        <div className="relative mb-4">
          <input
            className="w-full rounded-xl border border-white/10 bg-white/[0.06] p-3 pr-12 outline-none placeholder:text-white/40 focus:border-violet-300/40 focus:ring-2 focus:ring-violet-400/50"
            placeholder="••••••••"
            type={showPass ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPass((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10"
          >
            {showPass ? "Sembunyikan" : "Tampilkan"}
          </button>
        </div>

        {/* CAPTCHA */}
        <div className="mb-3 flex items-center justify-between">
          <label className="block text-sm font-medium text-white/80">
            CAPTCHA (Custom)
          </label>
          <button
            type="button"
            onClick={buildCaptcha}
            className="text-xs text-white/70 underline decoration-dotted underline-offset-4 hover:text-white"
          >
            Ganti pertanyaan
          </button>
        </div>

        <div className="mb-5 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <p className="mb-3 text-sm text-white/75">
            {question?.q ?? "Memuat pertanyaan..."}
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {choices.map((c) => (
              <label
                key={c}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 ${answer === c ? "ring-2 ring-cyan-400/50" : "hover:bg-white/[0.06]"}`}
              >
                <input
                  type="radio"
                  name="captcha"
                  value={c}
                  checked={answer === c}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="accent-violet-400"
                />
                <span className="text-sm capitalize">{c}</span>
              </label>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-4 text-white/50">
            Petunjuk: Nama keluarga valid meliputi{" "}
            <span className="italic">
              supardi, tatywigyati, ruri irawan, popi ari kurniawan, yessa
              saptiani, ferdy salsabilla
            </span>
            .
          </p>
        </div>

        {/* Error */}
        {err && (
          <p
            role="alert"
            aria-live="assertive"
            className="mb-4 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300"
          >
            {err}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`group relative inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-gradient-to-tr from-violet-500/30 to-cyan-400/30 py-3 font-medium text-white backdrop-blur ring-1 ring-inset ring-white/10 hover:from-violet-500/40 hover:to-cyan-400/40 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 ${loading ? "cursor-not-allowed opacity-70" : ""}`}
        >
          <span className="relative z-10">
            {loading ? "Memproses..." : "Masuk"}
          </span>
          <span className="pointer-events-none absolute inset-0 -z-0 rounded-xl bg-[radial-gradient(40%_60%_at_50%_120%,rgba(255,255,255,0.25),transparent)] opacity-0 transition group-hover:opacity-100" />
        </button>

        {/* Footer */}
        <p className="mt-4 text-center text-xs text-white/50">
          Kamu akan diarahkan ke:{" "}
          <span className="text-white/80">{callbackUrl}</span>
        </p>
      </form>
    </div>
  );
}
