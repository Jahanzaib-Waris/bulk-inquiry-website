import { supabaseAdmin } from "@/lib/supabase/admin";
import { StatsCharts } from "@/components/admin/StatsCharts";

export const dynamic = "force-dynamic";

const TREND_DAYS = 14;

function buildDailyTrend(rows: { created_at: string }[]) {
  const counts = new Map<string, number>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = TREND_DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    counts.set(d.toISOString().slice(0, 10), 0);
  }

  for (const row of rows) {
    const key = row.created_at.slice(0, 10);
    if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return Array.from(counts.entries()).map(([date, count]) => ({
    date: date.slice(5), // MM-DD
    count,
  }));
}

export default async function DashboardPage() {
  const supabase = supabaseAdmin();
  const { data, error } = await supabase.from("inquiries").select("status, created_at");

  if (error) throw new Error(error.message);

  const rows = data ?? [];
  const total = rows.length;
  const newCount = rows.filter((r) => r.status === "new").length;
  const reviewedCount = rows.filter((r) => r.status === "reviewed").length;
  const trend = buildDailyTrend(rows);

  return (
    <div>
      <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total inquiries</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">{total}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">New</p>
          <p className="mt-1 text-3xl font-semibold text-amber-600">{newCount}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Reviewed</p>
          <p className="mt-1 text-3xl font-semibold text-green-600">{reviewedCount}</p>
        </div>
      </div>

      <div className="mt-8">
        <StatsCharts statusCounts={{ new: newCount, reviewed: reviewedCount }} trend={trend} />
      </div>
    </div>
  );
}
