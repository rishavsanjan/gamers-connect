"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type YearData = {
  year: number;
  count: number;
};

interface Props {
  yearCount: Record<number, number>;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 shadow-xl">
        <p className="text-gray-300 text-sm font-medium">
          {payload[0].payload.year}
        </p>
        <p className="text-indigo-400 text-lg font-bold">
          {payload[0].value} games
        </p>
      </div>
    );
  }
  return null;
};

const GamesByYearChart: React.FC<Props> = ({ yearCount }) => {
  const data: YearData[] = Object.entries(yearCount)
    .map(([year, count]) => ({
      year: Number(year),
      count,
    }))
    .sort((a, b) => a.year - b.year);

  return (
    <div className="w-full h-80 bg-[#0A0A0A] rounded-2xl p-6 shadow-2xl">
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-white mb-1">Games by Year</h3>
        <p className="text-gray-400 text-sm">Release distribution over time</p>
      </div>
      <ResponsiveContainer>
        <BarChart 
          data={data} 
          margin={{ top: 10, right: 10, bottom: 20, left: -10 }}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity={1} />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis 
            dataKey="year" 
            stroke="#94a3b8"
            style={{ fontSize: '12px', fontWeight: 500 }}
            tickLine={false}
          />
          <YAxis 
            stroke="#94a3b8"
            style={{ fontSize: '12px', fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
          <Bar 
            dataKey="count" 
            fill="url(#barGradient)" 
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GamesByYearChart;