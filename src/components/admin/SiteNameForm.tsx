"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SiteNameForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setError(null);

    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ site_name: name }),
    });
    const data = await res.json();

    if (!res.ok) {
      setStatus("error");
      setError(data.error || "Something went wrong.");
      return;
    }

    setStatus("saved");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="site_name" className="block text-sm font-medium text-slate-700">
          Website name
        </label>
        <input
          id="site_name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setStatus("idle");
          }}
          maxLength={60}
          required
          className="mt-1 block w-full max-w-sm rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {status === "saved" && <p className="text-sm text-green-600">Saved.</p>}
      <button
        type="submit"
        disabled={status === "saving"}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {status === "saving" ? "Saving…" : "Save name"}
      </button>
    </form>
  );
}
