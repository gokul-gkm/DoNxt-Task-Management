import { type FC } from "react";
import { dashTasks, type DashTask } from "../../data/landingData";

const priorityClasses: Record<DashTask["priority"], string> = {
  high: "bg-rose-50 text-rose-500",
  med: "bg-orange-50 text-orange-500",
  low: "bg-gray-100 text-gray-400",
};
const priorityLabel: Record<DashTask["priority"], string> = {
  high: "High",
  med: "Med",
  low: "Low",
};

const MiniDashboard: FC = () => (
  <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-slate-200/60 p-5 w-full max-w-lg mx-auto">
    <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
      <div className="flex items-center gap-2.5">
        <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
        <span className="text-sm font-bold text-gray-800">My Dashboard</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-red-400" />
        <div className="w-2 h-2 rounded-full bg-yellow-400" />
        <div className="w-2 h-2 rounded-full bg-green-400" />
      </div>
    </div>

    <div className="grid grid-cols-3 gap-3 mb-5">
      {[
        { label: "Projects", val: "6", color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Completed", val: "34", color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Pending", val: "12", color: "text-orange-600", bg: "bg-orange-50" },
      ].map(({ label, val, color, bg }) => (
        <div key={label} className={`${bg} rounded-2xl p-3 text-center`}>
          <p className={`text-2xl font-black ${color}`}>{val}</p>
          <p className="text-[10px] text-gray-500 mt-0.5 font-medium">{label}</p>
        </div>
      ))}
    </div>

    <div className="flex flex-col gap-2.5">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Recent Tasks</p>
      {dashTasks.map(({ task, due, done, priority }) => (
        <div
          key={task}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
            done ? "bg-slate-50 border-slate-100" : "bg-white border-slate-200/80"
          }`}
        >
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${done ? "bg-emerald-500 border-emerald-500" : "border-gray-300"}`}>
            {done && (
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M1.5 4.5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <p className={`text-xs font-medium flex-1 leading-tight ${done ? "line-through text-gray-400" : "text-gray-700"}`}>
            {task}
          </p>
          <div className="flex items-center gap-1.5">
            {!done && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${priorityClasses[priority]}`}>
                {priorityLabel[priority]}
              </span>
            )}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${done ? "bg-emerald-50 text-emerald-500" : "bg-blue-50 text-blue-500"}`}>
              {due}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default MiniDashboard;
