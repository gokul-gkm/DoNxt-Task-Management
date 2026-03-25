import type { FC } from "react";

export interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  textColor: string;
  delay: number;
}

export const StatCard: FC<StatCardProps> = ({ title, value, icon, iconBg, textColor, delay }) => {
  return (
    <div
      className="stat-card bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center justify-between opacity-0 translate-y-4"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          {title}
        </h3>
        <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
    </div>
  );
};
