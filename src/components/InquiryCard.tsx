"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Inquiry } from "@/lib/types";

export function InquiryCard({ inquiry }: { inquiry: Inquiry }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggleStatus() {
    setBusy(true);
    const nextStatus = inquiry.status === "new" ? "reviewed" : "new";
    await fetch(`/api/inquiries/${inquiry.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    setBusy(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Delete this inquiry? This cannot be undone.")) return;
    setBusy(true);
    await fetch(`/api/inquiries/${inquiry.id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <a href={`mailto:${inquiry.email}`} className="font-medium text-slate-900">
            {inquiry.email}
          </a>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                inquiry.status === "new"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {inquiry.status === "new" ? "New" : "Reviewed"}
            </span>
            <time className="text-sm text-slate-400">
              {new Date(inquiry.created_at).toLocaleString()}
            </time>
          </div>
        </div>
        <div className="flex shrink-0 gap-3 text-sm">
          <button
            onClick={toggleStatus}
            disabled={busy}
            className="font-medium text-slate-600 hover:text-slate-900 disabled:opacity-50"
          >
            Mark as {inquiry.status === "new" ? "reviewed" : "new"}
          </button>
          <button
            onClick={handleDelete}
            disabled={busy}
            className="font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-slate-700">{inquiry.description}</p>

      {inquiry.image_urls.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
          {inquiry.image_urls.map((url) => (
            <a key={url} href={url} target="_blank" rel="noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-20 w-full rounded-md object-cover" />
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
