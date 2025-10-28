"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function SearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  useEffect(() => {
    setQ(searchParams.get("q") ?? "");
  }, [searchParams]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (q.trim()) params.set("q", q.trim());
    else params.delete("q");
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="relative">
      <input
        className="w-full rounded-xl border px-4 py-2"
        placeholder="Search hats…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1 text-sm">
        Search
      </button>
    </form>
  );
}
