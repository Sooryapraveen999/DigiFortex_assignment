"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const LABELS: Record<string, string> = {
  fake_domain: "Fake domains",
  social_impersonation: "Impersonation",
  negative_mention: "Negative",
  unauthorized_use: "Unauthorized",
  brand_mention: "Brand mentions",
};

export default function CategoryBarChart({ counts }: { counts: Record<string, number> }) {
  const data = Object.entries(counts).map(([key, value]) => ({
    name: LABELS[key] ?? key,
    value,
  }));

  const chartData = data.length > 0 ? data : [{ name: "—", value: 0 }];

  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-12} textAnchor="end" height={56} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={32} />
          <Tooltip />
          <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} name="Findings" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
