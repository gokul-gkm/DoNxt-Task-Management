import type { FC } from "react";

export interface ProgressBarProps {
  progress: number;
  barRef?: (el: HTMLDivElement | null) => void;
}

export const progressColor = (p: number): string => {
  if (p === 100) return "bg-green-500";
  if (p >= 60)   return "bg-indigo-600";
  if (p >= 30)   return "bg-indigo-400";
  return "bg-amber-400";
};

const ProgressBar: FC<ProgressBarProps> = ({ progress, barRef }) => (
  <div className="flex items-center gap-3 w-full">
    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        ref={barRef}
        className={`h-full rounded-full ${progressColor(progress)}`}
        style={{ width: "0%" }}
      />
    </div>
    <span className="text-xs font-medium text-gray-500 tabular-nums w-8 text-right shrink-0">
      {progress}%
    </span>
  </div>
);

export default ProgressBar;
