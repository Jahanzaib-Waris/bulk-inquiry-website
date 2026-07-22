"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const STATUS_COLORS = { new: "#d97706", reviewed: "#16a34a" };

export function StatsCharts({
  statusCounts,
  trend,
}: {
  statusCounts: { new: number; reviewed: number };
  trend: { date: string; count: number }[];
}) {
  const pieData = [
    { name: "New", value: statusCounts.new, color: STATUS_COLORS.new },
    { name: "Reviewed", value: statusCounts.reviewed, color: STATUS_COLORS.reviewed },
  ];
  const hasData = statusCounts.new + statusCounts.reviewed > 0;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <div className="rounded-lg border border-slate-200 bg-white p-5 lg:col-span-3">
        <p className="text-sm font-medium text-slate-700">Inquiries over the last 14 days</p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "#f1f5f9" }} />
              <Bar dataKey="count" fill="#0f172a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 lg:col-span-2">
        <p className="text-sm font-medium text-slate-700">Status breakdown</p>
        <div className="mt-4 h-64">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              No inquiries yet
            </div>
          )}
        </div>
        <div className="mt-2 flex justify-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLORS.new }} />
            New
          </span>
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLORS.reviewed }} />
            Reviewed
          </span>
        </div>
      </div>
    </div>
  );
}
