import type { FC } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SpinnerIcon } from "./icons";

export interface ChartDataPoint {
  date: string;
  completed: number;
  added: number;
  displayDate?: string;
}

interface TaskActivityChartProps {
  chartData: ChartDataPoint[];
  days: number;
  loading: boolean;
}

export const TaskActivityChart: FC<TaskActivityChartProps> = ({ chartData, days, loading }) => {
  return (
    <div className="chart-container bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 flex flex-col opacity-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-gray-900">Task Activity</h2>
          <p className="text-xs text-gray-500 mt-0.5">Tasks added vs completed over {days} days</p>
        </div>
        {loading && <SpinnerIcon className="w-5 h-5 text-indigo-500 animate-spin" />}
      </div>

      <div className="w-full h-70">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAdded" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} dy={10} minTickGap={20} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", padding: "10px 14px", borderBlock: "none" }}
              itemStyle={{ fontSize: "13px", fontWeight: 500 }}
              labelStyle={{ color: "#64748b", marginBottom: "6px", fontSize: "12px", fontWeight: 600 }}
            />
            <Area type="monotone" dataKey="added" name="Tasks Added" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorAdded)" activeDot={{ r: 5, strokeWidth: 0, fill: "#818cf8" }} />
            <Area type="monotone" dataKey="completed" name="Tasks Completed" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" activeDot={{ r: 5, strokeWidth: 0, fill: "#34d399" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
