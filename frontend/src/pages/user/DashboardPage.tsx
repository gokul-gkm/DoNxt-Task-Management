import { type FC, useEffect, useRef, useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { gsap } from "gsap";
import { taskService, type TaskData } from "../../services/api/task.api";
import { toast } from "sonner";
import { useSocket } from "../../context/SocketContext";
import { 
  SpinnerIcon, 
  DashboardGridIcon, 
  DashboardCheckIcon, 
  DashboardClockIcon, 
  DashboardWarningIcon,
  DashboardTrendIcon,
  PlusIcon
} from "../../components/ui/icons";
import DashboardStatCard, { type DashboardStat } from "../../components/ui/DashboardStatCard";
import TaskItem from "../../components/ui/TaskItem";
import TaskDetailsModal from "../../components/ui/TaskDetailsModal";
import CreateTaskModal, { type TaskForm } from "../../components/ui/CreateTaskModal";
import { formatPreciseTimeRemaining } from "../../utils/date.utils";

const DashboardPage: FC = () => {
  const { openNewTaskFlow } = useOutletContext<{ openNewTaskFlow: () => void }>();
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTaskData, setEditingTaskData] = useState<TaskForm | undefined>(undefined);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);

  const { socket } = useSocket();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await taskService.getTasks();
      const fetchedTasks = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setTasks(fetchedTasks);
    } catch (error: any) {
      toast.error(error.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleTaskEvent = (data: any) => {
      console.log("[DashboardPage] Received socket event:", data);
      fetchTasks();
    };

    socket.on("task:created", handleTaskEvent);
    socket.on("task:updated", handleTaskEvent);
    socket.on("task:deleted", handleTaskEvent);

    const handleProjectEvent = (data: any) => {
      console.log("[DashboardPage] Received project socket event:", data);
      fetchTasks();
    };

    socket.on("project:created", handleProjectEvent);
    socket.on("project:updated", handleProjectEvent);
    socket.on("project:deleted", handleProjectEvent);

    return () => {
      socket.off("task:created", handleTaskEvent);
      socket.off("task:updated", handleTaskEvent);
      socket.off("task:deleted", handleTaskEvent);
      socket.off("project:created", handleProjectEvent);
      socket.off("project:updated", handleProjectEvent);
      socket.off("project:deleted", handleProjectEvent);
    };
  }, [socket]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "done").length;
    const pending = total - completed;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdue = tasks.filter((t) => {
      if (!t.dueDate || t.status === "done") return false;
      const tDate = new Date(t.dueDate);
      return tDate < today;
    }).length;

    return { total, completed, pending, overdue };
  }, [tasks]);

  const statData: DashboardStat[] = [
    {
      label: "Total Tasks", value: stats.total, trend: 12, trendLabel: "vs last month",
      color: "text-indigo-600", bgColor: "bg-indigo-50",
      icon: <DashboardGridIcon />,
    },
    {
      label: "Completed", value: stats.completed, trend: 18, trendLabel: "vs last month",
      color: "text-green-600", bgColor: "bg-green-50",
      icon: <DashboardCheckIcon />,
    },
    {
      label: "Pending", value: stats.pending, trend: -4, trendLabel: "vs last month",
      color: "text-amber-600", bgColor: "bg-amber-50",
      icon: <DashboardClockIcon />,
    },
    {
      label: "Overdue", value: stats.overdue, trend: -8, trendLabel: "vs last month",
      color: "text-red-500", bgColor: "bg-red-50",
      icon: <DashboardWarningIcon />,
    },
  ];

  const statCardRefs = useRef<HTMLElement[]>([]);
  const taskItemRefs = useRef<HTMLElement[]>([]);
  const section1Ref  = useRef<HTMLDivElement>(null);
  const section2Ref  = useRef<HTMLDivElement>(null);

  const registerStat = (el: HTMLElement | null) => { if (el && !statCardRefs.current.includes(el)) statCardRefs.current.push(el); };
  const registerTask = (el: HTMLElement | null) => { if (el && !taskItemRefs.current.includes(el)) taskItemRefs.current.push(el); };

  useEffect(() => {
    if (loading) return; 

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(statCardRefs.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 });
    tl.fromTo(section2Ref.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2");
    
    if (taskItemRefs.current.length > 0) {
      tl.fromTo(taskItemRefs.current, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.05 }, "-=0.25");
    }
  }, [loading, tasks]);
  const nextDueTask = useMemo(() => {
    const pendingTasks = tasks.filter(t => t.status !== "done" && t.dueDate);
    if (!pendingTasks.length) return null;
    return pendingTasks.sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())[0];
  }, [tasks]);

  const handleEditClick = (task: TaskData) => {
    setSelectedTask(null);
    setEditTaskId(task._id || null);
    setEditingTaskData({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority as any,
      dueDate: task.dueDate || "",
      tags: task.tags || []
    });
    setIsTaskFormOpen(true);
  };

  const handleTaskFormSubmit = async (formData: TaskForm) => {
    try {
      if (editTaskId) {
        await taskService.updateTask(editTaskId, formData);
        fetchTasks();
        toast.success("Task updated");
      }
      setIsTaskFormOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update task");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Overview of your tasks and projects</p>
        </div>
        <button
          type="button"
          onClick={openNewTaskFlow}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-150 shadow-sm w-full sm:w-auto"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Create Task
        </button>
      </div>

      {/* ── Section 1 — Stat cards ────────────────────────────────────────── */}
      <div ref={section1Ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statData.map((stat) => (
          <DashboardStatCard key={stat.label} stat={stat} cardRef={registerStat} />
        ))}
      </div>

      {/* ── Next Task Due Reminder ────────────────────────────────────────── */}
      {nextDueTask && (
        <div ref={section2Ref} className="bg-indigo-600 rounded-xl shadow-md p-5 sm:p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
              <DashboardClockIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-1">Next Task Due</p>
              <h3 className="text-xl font-bold truncate max-w-70 sm:max-w-md">{nextDueTask.title}</h3>
              <p className="text-sm text-indigo-100 mt-1 flex items-center gap-2">
                 <span>{new Date(nextDueTask.dueDate!).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                 • <span className="font-semibold">{formatPreciseTimeRemaining(nextDueTask.dueDate).text} left</span>
              </p>
            </div>
          </div>
          <button onClick={() => setSelectedTask(nextDueTask)} className="bg-white text-indigo-600 px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-50 transition-colors whitespace-nowrap w-full sm:w-auto cursor-pointer">
            View Task
          </button>
        </div>
      )}

      {/* ── Quick summary bar ──────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center shrink-0 text-indigo-600">
            <DashboardTrendIcon className="w-4.5 h-4.5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">You're making great progress</p>
            <p className="text-xs text-gray-500">
              {stats.completed} of {stats.total} total tasks completed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
          <div className="flex-1 min-w-30 sm:w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-indigo-600 shrink-0">
            {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* ── Section 2 — Recent Tasks ──────────────────────────────────────── */}
      <div
        ref={section2Ref}
        className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col w-full"
      >
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Recent Tasks</h2>
            <p className="text-xs text-gray-400 mt-0.5">{tasks.length} tasks total</p>
          </div>
          <button
            type="button"
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors cursor-pointer"
          >
            View all
          </button>
        </div>

        {/* Column headers */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-2 border-b border-gray-50">
          <span className="w-2 shrink-0" />
          <span className="w-4 shrink-0" />
          <span className="flex-1 text-xs font-medium text-gray-400 uppercase tracking-wider">Task</span>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:block w-20 text-center">Status</span>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider w-24 text-right">Due</span>
        </div>

        {/* Task list  */}
        <div className="flex flex-col px-4 sm:px-5 py-2 gap-1.5 min-h-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center flex-1 h-full py-10 gap-2">
              <SpinnerIcon className="w-6 h-6 text-indigo-500 animate-spin" />
              <span className="text-sm text-gray-400">Loading tasks...</span>
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 h-full py-10 text-center">
              <p className="text-sm font-medium text-gray-900 mb-1">No tasks started</p>
              <p className="text-xs text-gray-500">Get organized by creating a new task.</p>
            </div>
          ) : (
            tasks.map((task, i) => (
              <TaskItem 
                key={task.id || task._id || i} 
                task={task} 
                itemRef={registerTask} 
                onClick={setSelectedTask}
                className="hover:bg-gray-50/50 transition-colors py-2 px-3 rounded-lg" 
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-5 py-3 border-t border-gray-100 mt-auto">
          <button
            type="button"
            onClick={openNewTaskFlow}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-150 cursor-pointer"
          >
            <PlusIcon className="w-3 h-3" />
            Add new task
          </button>
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <CreateTaskModal
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSubmit={handleTaskFormSubmit}
        initialData={editingTaskData}
      />

      {selectedTask && (
        <TaskDetailsModal
           isOpen={true}
           onClose={() => setSelectedTask(null)}
           task={selectedTask}
           onEdit={handleEditClick}
           onDelete={() => {
             setSelectedTask(null);
             fetchTasks();
           }}
           onUpdate={async (id, updates) => {
             await taskService.updateTask(id, updates);
             fetchTasks();
             setSelectedTask(prev => prev ? { ...prev, ...updates } : null);
           }}
        />
      )}
    </div>
  );
};

export default DashboardPage;