"use client";

import { useTheme } from "@/context/ThemeContext";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

interface DailyTrendItem {
  day: string;
  attendance: number;
}

interface SubjectStatItem {
  name: string;
  code: string;
  percentage: number;
  total: number;
}

export function AttendanceTrendChart({ data }: { data?: DailyTrendItem[] }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const chartData = data && data.length > 0 ? data : [
    { day: "Mon", attendance: 92 },
    { day: "Tue", attendance: 88 },
    { day: "Wed", attendance: 95 },
    { day: "Thu", attendance: 90 },
    { day: "Fri", attendance: 86 },
  ];

  const gridColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
  const textColor = isDark ? "#9F9AA3" : "#7E7971";
  const strokeColor = isDark ? "#AB2D4E" : "#5A1629";

  return (
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => `${val}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1B1A20" : "#FFFFFF",
              borderColor: isDark ? "#2E2B38" : "#E8E3D9",
              borderRadius: 10,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              color: isDark ? "#F7F6F2" : "#1C1917",
              fontSize: 12,
              padding: "8px 12px",
            }}
            formatter={(value: any) => [`${value}%`, "Attendance"]}
          />
          <Area
            type="monotone"
            dataKey="attendance"
            stroke={strokeColor}
            strokeWidth={2.5}
            fill="url(#attendanceGradient)"
            dot={{ r: 4, fill: strokeColor, strokeWidth: 2, stroke: isDark ? "#141317" : "#FFFFFF" }}
            activeDot={{ r: 6, fill: strokeColor }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SubjectBarChart({ data }: { data: SubjectStatItem[] }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const gridColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
  const textColor = isDark ? "#9F9AA3" : "#7E7971";

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="code"
            tick={{ fill: textColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            angle={-20}
            textAnchor="end"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: textColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => `${val}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1B1A20" : "#FFFFFF",
              borderColor: isDark ? "#2E2B38" : "#E8E3D9",
              borderRadius: 10,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              color: isDark ? "#F7F6F2" : "#1C1917",
              fontSize: 12,
              padding: "8px 12px",
            }}
            formatter={(value: any) => [`${value}%`, "Attendance Rate"]}
            labelFormatter={(code) => {
              const item = data.find((d) => d.code === code);
              return item ? `${item.name} (${item.code})` : String(code);
            }}
          />
          <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => {
              const color =
                entry.percentage >= 85
                  ? isDark ? "#22C55E" : "#16A34A"
                  : entry.percentage >= 75
                  ? isDark ? "#D2E85A" : "#849619"
                  : isDark ? "#FB7185" : "#BE123C";
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
