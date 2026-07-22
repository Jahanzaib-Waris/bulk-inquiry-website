"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export function ChangePasswordForm({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setError(null);

    const formData = new FormData(e.currentTarget);
    const currentPassword = String(formData.get("current_password"));
    const newPassword = String(formData.get("new_password"));
    const confirmPassword = String(formData.get("confirm_password"));

    if (newPassword.length < 8) {
      setStatus("error");
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus("error");
      setError("New passwords do not match.");
      return;
    }

    const supabase = supabaseBrowser();

    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });
    if (reauthError) {
      setStatus("error");
      setError("Current password is incorrect.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) {
      setStatus("error");
      setError(updateError.message);
      return;
    }

    setStatus("saved");
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm space-y-3">
      <div>
        <label htmlFor="current_password" className="block text-sm font-medium text-slate-700">
          Current password
        </label>
        <input
          id="current_password"
          name="current_password"
          type="password"
          required
          className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="new_password" className="block text-sm font-medium text-slate-700">
          New password
        </label>
        <input
          id="new_password"
          name="new_password"
          type="password"
          required
          minLength={8}
          className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="confirm_password" className="block text-sm font-medium text-slate-700">
          Confirm new password
        </label>
        <input
          id="confirm_password"
          name="confirm_password"
          type="password"
          required
          minLength={8}
          className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {status === "saved" && <p className="text-sm text-green-600">Password updated.</p>}
      <button
        type="submit"
        disabled={status === "saving"}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {status === "saving" ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
