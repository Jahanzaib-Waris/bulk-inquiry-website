import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Inquiry, InquiryStatus } from "@/lib/types";
import { SignOutButton } from "@/components/SignOutButton";
import { InquiryCard } from "@/components/InquiryCard";

export const dynamic = "force-dynamic";

async function getInquiries(params: { q?: string; status?: string }): Promise<Inquiry[]> {
  const supabase = supabaseAdmin();
  let query = supabase.from("inquiries").select("*").order("created_at", { ascending: false });

  if (params.q) {
    query = query.or(`email.ilike.%${params.q}%,description.ilike.%${params.q}%`);
  }
  if (params.status === "new" || params.status === "reviewed") {
    query = query.eq("status", params.status);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as Inquiry[];
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const inquiries = await getInquiries(params);

  const statusFilter: InquiryStatus | undefined =
    params.status === "new" || params.status === "reviewed" ? params.status : undefined;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
        <h1 className="text-lg font-semibold text-slate-900">Bulk Inquiries</h1>
        <SignOutButton />
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <form className="mb-6 flex flex-wrap gap-3" action="/admin" method="get">
          <input
            type="text"
            name="q"
            defaultValue={params.q}
            placeholder="Search by email or description…"
            className="min-w-[240px] flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none"
          />
          <select
            name="status"
            defaultValue={statusFilter ?? ""}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none"
          >
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
          </select>
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Filter
          </button>
          {(params.q || statusFilter) && (
            <a
              href="/admin"
              className="rounded-md px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              Clear
            </a>
          )}
        </form>

        <div className="space-y-4">
          {inquiries.length === 0 && <p className="text-slate-500">No inquiries found.</p>}
          {inquiries.map((inquiry) => (
            <InquiryCard key={inquiry.id} inquiry={inquiry} />
          ))}
        </div>
      </main>
    </div>
  );
}
