import { useEffect, useRef, type FC } from "react";
import { gsap } from "gsap";

export interface StatusBarData {
  label: string;
  value: number;
  color: string;
}

interface TasksByStatusChartProps {
  data: StatusBarData[];
  maxBarValue: number;
}

export const TasksByStatusChart: FC<TasksByStatusChartProps> = ({ data, maxBarValue }) => {
  const barRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    barRefs.current.forEach((bar) => {
      if (bar) {
        gsap.set(bar, { height: "0%" });
        const h = bar.getAttribute("data-height") || "0";
        gsap.to(bar, { height: `${h}%`, duration: 0.7, delay: 0.3, ease: "power3.out" });
      }
    });
  }, [data]);

  return (
    <div className="chart-container bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 flex flex-col opacity-0">
      <div className="mb-6">
        <h2 className="text-base font-bold text-gray-900">Tasks by Status</h2>
        <p className="text-xs text-gray-500 mt-0.5">Current snapshot of all tasks</p>
      </div>

      <div className="flex items-end justify-between gap-2 h-65 pb-5 px-2">
        {data.map((bar, i) => {
          const heightPct = (bar.value / maxBarValue) * 100;
          return (
            <div key={bar.label} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group">
              <span className="text-xs font-semibold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-200">
                {bar.value}
              </span>
              <div className="w-full flex items-end justify-center h-full">
                <div
                  ref={(el) => {
                    if (el) barRefs.current[i] = el;
                  }}
                  data-height={heightPct}
                  className={`w-full max-w-10 rounded-t-lg ${bar.color} opacity-90 group-hover:opacity-100 transition-all cursor-pointer`}
                  style={{ height: "0%" }}
                />
              </div>
              <span className="text-[10px] sm:text-xs text-gray-400 text-center leading-tight truncate w-full">
                {bar.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
