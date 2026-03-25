import { useRef } from "react";
import type { FC } from "react";
import { gsap } from "gsap";
import type { TaskData } from "../../services/api/task.api";
import { formatPreciseTimeRemaining } from "../../utils/date.utils";

interface TaskItemProps {
  task: TaskData;
  itemRef?: (el: HTMLElement | null) => void;
  onClick: (task: TaskData) => void;
  className?: string;
}

const statusConfig: Record<string, { label: string; classes: string }> = {
  "todo":        { label: "Todo",        classes: "bg-gray-100 text-gray-600 border border-gray-200" },
  "in_progress": { label: "In Progress", classes: "bg-indigo-50 text-indigo-600 border border-indigo-100" },
  "done":        { label: "Done",        classes: "bg-green-50 text-green-700 border border-green-100" },
};

const priorityDot: Record<string, string> = {
  High:   "bg-red-400",
  Medium: "bg-amber-400",
  Low:    "bg-gray-300",
};

export const TaskItem: FC<TaskItemProps> = ({ task, itemRef, onClick, className }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    gsap.to(rowRef.current, { 
      backgroundColor: "#f8fafc", 
      y: -2,
      duration: 0.2, 
      ease: "power2.out" 
    });
  };
  const handleMouseLeave = () => {
    gsap.to(rowRef.current, { 
      backgroundColor: "#ffffff", 
      y: 0,
      duration: 0.2, 
      ease: "power2.in" 
    });
  };

  const sConf = statusConfig[task.status] || statusConfig["todo"];
  const pDot = priorityDot[task.priority] || priorityDot["Low"];

  const timeRemaining = formatPreciseTimeRemaining(task.dueDate);

  return (
    <div
      ref={(el) => {
        (rowRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        if (itemRef) itemRef(el);
      }}
      onClick={() => onClick(task)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`flex items-center gap-3 px-5 py-4 rounded-xl cursor-pointer group transition-all duration-200 ${className || ""}`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${pDot}`} />
      <div
        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
          task.status === "done" ? "bg-green-500 border-green-500" : "border-gray-300 group-hover:border-indigo-400"
        }`}
      >
        {task.status === "done" && (
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
            <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      <span
        className={`flex-1 text-sm min-w-0 truncate ${
          task.status === "done" ? "line-through text-gray-400" : "text-gray-700"
        }`}
      >
        {task.title}
      </span>

      <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 hidden sm:inline-flex ${sConf.classes}`}>
        {sConf.label}
      </span>

      <span
        className={`text-xs shrink-0 w-24 text-right truncate ${
          timeRemaining.status === 'overdue' && task.status !== "done"
            ? "text-red-500 font-semibold"
            : timeRemaining.status === 'due-soon' && task.status !== "done"
            ? "text-amber-500 font-medium"
            : "text-gray-400"
        }`}
      >
        {timeRemaining.text}
      </span>
    </div>
  );
};

export default TaskItem;
