import { useRef } from "react";
import type { FC } from "react";
import { gsap } from "gsap";

export type DashboardStat = {
  label: string;
  value: number;
  trend: number;
  trendLabel: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
};

export interface DashboardStatCardProps {
  stat: DashboardStat;
  cardRef: (el: HTMLElement | null) => void;
}

const DashboardStatCard: FC<DashboardStatCardProps> = ({ stat, cardRef }) => {
  const wrapRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    gsap.to(wrapRef.current, { y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", duration: 0.2, ease: "power2.out" });
  };
  const handleMouseLeave = () => {
    gsap.to(wrapRef.current, { y: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", duration: 0.2, ease: "power2.out" });
  };

  return (
    <div
      ref={(el) => {
        (wrapRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        cardRef(el);
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm cursor-default"
    >
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
          <span className={stat.color}>{stat.icon}</span>
        </div>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            stat.trend >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
          }`}
        >
          {stat.trend >= 0 ? "+" : ""}{stat.trend}%
        </span>
      </div>
      <div>
        <p className="text-sm text-gray-500">{stat.label}</p>
        <p className="text-2xl font-semibold text-gray-900 mt-0.5">{stat.value}</p>
        <p className="text-xs text-gray-400 mt-1">{stat.trendLabel}</p>
      </div>
    </div>
  );
};

export default DashboardStatCard;
