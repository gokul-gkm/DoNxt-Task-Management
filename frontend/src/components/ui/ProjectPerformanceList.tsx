import { useEffect, useRef, type FC } from "react";
import { gsap } from "gsap";

export interface ProjectStat {
  id: string;
  name: string;
  progress: number;
  status: "Active" | "Completed" | "Paused";
  tasks: number;
}

interface ProjectPerformanceListProps {
  projectStats: ProjectStat[];
}

const progressColor = (p: number): string => {
  if (p === 100) return "bg-green-500";
  if (p >= 70) return "bg-indigo-600";
  if (p >= 40) return "bg-indigo-400";
  return "bg-amber-400";
};

const statusBadge: Record<ProjectStat["status"], string> = {
  Active: "bg-green-50 text-green-700 border-green-100",
  Completed: "bg-indigo-50 text-indigo-600 border-indigo-100",
  Paused: "bg-amber-50 text-amber-600 border-amber-100",
};

export const ProjectPerformanceList: FC<ProjectPerformanceListProps> = ({ projectStats }) => {
  const progressRefs = useRef<HTMLDivElement[]>([]);
  const progressItems = useRef<HTMLElement[]>([]);

  useEffect(() => {
    gsap.fromTo(
      progressItems.current,
      { opacity: 0, x: -8 },
      { opacity: 1, x: 0, duration: 0.3, stagger: 0.06 }
    );

    progressRefs.current.forEach((bar, i) => {
      if (bar) {
        gsap.set(bar, { width: "0%" });
        const pct = projectStats[i]?.progress ?? 0;
        gsap.to(bar, { width: `${pct}%`, duration: 0.8, delay: 0.1 + i * 0.05, ease: "power3.out" });
      }
    });

  }, [projectStats]);

  return (
    <div className="chart-container bg-white border border-gray-200 rounded-2xl shadow-sm opacity-0 overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 bg-gray-50/50">
        <div>
          <h2 className="text-base font-bold text-gray-900">Project Performance</h2>
          <p className="text-xs text-gray-500 mt-0.5">Completion progress per project</p>
        </div>
        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 tabular-nums">
          {projectStats.length} projects
        </span>
      </div>
      <div className="px-5 py-4 flex flex-col gap-6 max-h-100 overflow-y-auto custom-scrollbar">
        {projectStats.length > 0 ? (
          projectStats.map((p, i) => (
            <div 
              ref={(el) => { if (el) progressItems.current[i] = el; }} 
              key={p.id} 
              className="flex flex-col gap-2 opacity-0"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-sm font-medium text-gray-800 truncate">{p.name}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border shrink-0 ${statusBadge[p.status]}`}>
                    {p.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-400">{p.tasks} tasks</span>
                  <span className={`text-sm font-semibold tabular-nums ${
                    p.progress === 100 ? "text-green-600" : "text-gray-700"
                  }`}>
                    {p.progress}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  ref={(el) => { if (el) progressRefs.current[i] = el; }}
                  className={`h-full rounded-full ${progressColor(p.progress)}`}
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-gray-400 py-6">No projects found.</p>
        )}
      </div>
    </div>
  );
};
