"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { RiskCounts } from "../../lib/riskMetrics";

const COLORS = {
  critical: "#b91c1c",
  high: "#ea580c",
  medium: "#ca8a04",
  low: "#16a34a",
};

type Row = { name: string; value: number; key: keyof RiskCounts };

export default function RiskPieChart({ counts }: { counts: RiskCounts }) {
  const data = (
    [
      { name: "Critical", value: counts.critical, key: "critical" as const },
      { name: "High", value: counts.high, key: "high" as const },
      { name: "Medium", value: counts.medium, key: "medium" as const },
      { name: "Low", value: counts.low, key: "low" as const },
    ] satisfies ReadonlyArray<Row>
  ).filter((d) => d.value > 0);

  const emptySlice: Row[] = [{ name: "No data", value: 1, key: "low" }];
  const chartData = data.length > 0 ? data : emptySlice;

  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={56}
            outerRadius={88}
            paddingAngle={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.key]} fillOpacity={data.length > 0 ? 1 : 0.25} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [value, "Count"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      {data.length === 0 ? <p className="chart-placeholder">Run a scan to populate risk distribution.</p> : null}
    </div>
  );
}
