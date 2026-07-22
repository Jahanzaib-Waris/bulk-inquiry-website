"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoUploadForm({ initialLogoUrl }: { initialLogoUrl: string | null }) {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(initialLogoUrl);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function handleUpload() {
    if (!file) return;
    setStatus("uploading");
    setError(null);

    const formData = new FormData();
    formData.append("logo", file);

    const res = await fetch("/api/admin/settings/logo", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      setStatus("error");
      setError(data.error || "Upload failed.");
      return;
    }

    setStatus("idle");
    setFile(null);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <p className="block text-sm font-medium text-slate-700">Logo</p>
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-md border border-slate-200 bg-slate-50">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Logo preview" className="h-full w-full rounded-md object-contain" />
          ) : (
            <span className="text-xs text-slate-400">None</span>
          )}
        </div>
        <div>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleFileChange}
            className="block text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-white hover:file:bg-slate-700"
          />
          {file && (
            <button
              onClick={handleUpload}
              disabled={status === "uploading"}
              className="mt-2 rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
            >
              {status === "uploading" ? "Uploading…" : "Upload logo"}
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
