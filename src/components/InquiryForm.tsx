"use client";

import { useRef, useState } from "react";

const MAX_IMAGES = 10;

type Status = "idle" | "submitting" | "success" | "error";

export function InquiryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [images, setImages] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    const combined = [...images, ...selected].slice(0, MAX_IMAGES);
    setImages(combined);
    e.target.value = "";
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");

    const form = formRef.current!;
    const formData = new FormData(form);
    images.forEach((file) => formData.append("images", file));

    try {
      const res = await fetch("/api/inquiries", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      form.reset();
      setImages([]);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center sm:p-8">
        <h3 className="text-lg font-semibold text-green-800">Inquiry received</h3>
        <p className="mt-2 text-green-700">
          Thanks for reaching out — we&apos;ll be in touch by email soon.
        </p>
        <button
          className="mt-4 text-sm font-medium text-green-800 underline"
          onClick={() => setStatus("idle")}
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-slate-500 focus:outline-none"
          placeholder="you@company.com"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          minLength={10}
          rows={5}
          className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-slate-500 focus:outline-none"
          placeholder="What are you looking to order? Include quantities, sizes, materials, etc."
        />
      </div>

      <div>
        <label htmlFor="images" className="block text-sm font-medium text-slate-700">
          Reference images (up to {MAX_IMAGES})
        </label>
        <input
          id="images"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          onChange={handleFileChange}
          disabled={images.length >= MAX_IMAGES}
          className="mt-1 block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-white hover:file:bg-slate-700"
        />
        {images.length > 0 && (
          <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {images.map((file, i) => (
              <li key={`${file.name}-${i}`} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-20 w-full rounded-md object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-xs text-white"
                  aria-label={`Remove ${file.name}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-md bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
      >
        {status === "submitting" ? "Submitting…" : "Submit Inquiry"}
      </button>
    </form>
  );
}
