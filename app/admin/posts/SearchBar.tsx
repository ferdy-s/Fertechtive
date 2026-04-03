"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SearchBar({
  initialQuery = "",
}: {
  initialQuery?: string;
}) {
  const [value, setValue] = useState(initialQuery);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const makeUrl = useMemo(() => {
    return (q: string) => {
      const sp = new URLSearchParams(params?.toString());
      if (q.trim()) sp.set("q", q);
      else sp.delete("q");
      return sp.toString() ? `${pathname}?${sp.toString()}` : pathname;
    };
  }, [params, pathname]);

  useEffect(() => {
    const urlQ = params?.get("q") ?? "";
    if (urlQ !== value) setValue(urlQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.get("q")]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValue(v);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      router.replace(makeUrl(v));
    }, 300); // debounce
  };

  const onClear = () => {
    setValue("");
    router.replace(makeUrl(""));
  };

  return (
    <div className="flex w-full sm:w-[350px] items-center gap-2">
      <input
        value={value}
        onChange={onChange}
        placeholder="Ketik untuk mencari judul & deskripsi…"
        className="w-full rounded-xl bg-white/10 px-3 py-2 text-sm outline-none placeholder-white/50"
        aria-label="Cari posting"
        autoFocus
      />
      {value ? (
        <button
          type="button"
          onClick={onClear}
          className="rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-sm"
          aria-label="Bersihkan pencarian"
          title="Reset"
        >
          Reset
        </button>
      ) : null}
    </div>
  );
}
