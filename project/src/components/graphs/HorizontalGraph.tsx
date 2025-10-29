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
  Cell,
} from "recharts";

interface GenreData {
  name: string;
  count: number;
}

interface Props {
  data: GenreData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 shadow-xl">
        <p className="text-gray-300 text-sm font-medium mb-1">
          {payload[0].payload.name}
        </p>
        <p className="text-indigo-400 text-xl font-bold">
          {payload[0].value} games
        </p>
      </div>
    );
  }
  return null;
};

// Vibrant color palette for different bars
const COLORS = [
  "#818cf8", "#a78bfa", "#c084fc", "#e879f9", "#f472b6",
  "#fb7185", "#f97316", "#fb923c", "#fbbf24", "#facc15",
  "#a3e635", "#4ade80", "#34d399", "#2dd4bf", "#22d3ee",
  "#38bdf8", "#60a5fa", "#818cf8"
];

export const GameGenreChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full h-[500px] bg-[#0A0A0A] rounded-2xl p-6 shadow-2xl">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-1">Genre Distribution</h3>
        <p className="text-gray-400 text-sm">Most popular game genres</p>
      </div>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, bottom: 10, left: 10 }}
        >
          <defs>
            {COLORS.map((color, index) => (
              <linearGradient key={index} id={`gradient${index}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                <stop offset="100%" stopColor={color} stopOpacity={1} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} horizontal={false} />
          <XAxis 
            type="number" 
            stroke="#94a3b8"
            style={{ fontSize: '12px', fontWeight: 500 }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            stroke="#94a3b8"
            style={{ fontSize: '13px', fontWeight: 600 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
          <Bar
            dataKey="count"
            radius={[0, 8, 8, 0]}
            barSize={22}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`url(#gradient${index % COLORS.length})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GameGenreChart;