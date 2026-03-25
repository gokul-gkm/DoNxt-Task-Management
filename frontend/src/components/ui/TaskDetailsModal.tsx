import {
  type FC,
  useEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { toast } from "sonner";
import { taskService, type TaskData } from "../../services/api/task.api";

type TaskStatus   = "todo" | "in_progress" | "done";
type TaskPriority = "high" | "medium" | "low";

type ModalProps = {
  isOpen:   boolean;
  onClose:  () => void;
  task:     TaskData;
  onEdit:   (task: TaskData) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TaskData>) => Promise<void>;
};

interface StatusDropdownProps {
  value:    TaskStatus;
  onChange: (s: TaskStatus) => void;
  disabled?: boolean;
}

interface PriorityDropdownProps {
  value:    TaskPriority;
  onChange: (p: TaskPriority) => void;
  disabled?: boolean;
}

const statusConfig: Record<TaskStatus, { classes: string; dot: string }> = {
  "todo":        { classes: "bg-gray-100 text-gray-600 border-gray-200",     dot: "bg-gray-400"   },
  "in_progress": { classes: "bg-indigo-50 text-indigo-600 border-indigo-100", dot: "bg-indigo-500" },
  "done":        { classes: "bg-green-50 text-green-700 border-green-100",    dot: "bg-green-500"  },
};

const priorityConfig: Record<TaskPriority, { classes: string; dot: string }> = {
  high:   { classes: "bg-red-50 text-red-500 border-red-100",     dot: "bg-red-400"   },
  medium: { classes: "bg-amber-50 text-amber-600 border-amber-100", dot: "bg-amber-400" },
  low:    { classes: "bg-gray-100 text-gray-500 border-gray-200",   dot: "bg-gray-300"  },
};

const tagColorMap: Record<string, string> = {
  Design:    "bg-purple-50 text-purple-600 border border-purple-100",
  Frontend:  "bg-blue-50 text-blue-600 border border-blue-100",
  Backend:   "bg-indigo-50 text-indigo-600 border border-indigo-100",
  API:       "bg-cyan-50 text-cyan-600 border border-cyan-100",
  Bug:       "bg-red-50 text-red-500 border border-red-100",
  Testing:   "bg-amber-50 text-amber-600 border border-amber-100",
  Research:  "bg-green-50 text-green-600 border border-green-100",
  Marketing: "bg-pink-50 text-pink-600 border border-pink-100",
};

const StatusDropdown: FC<StatusDropdownProps> = ({ value, onChange, disabled }) => {
  const [open, setOpen]   = useState(false);
  const wrapRef           = useRef<HTMLDivElement>(null);
  const dropRef           = useRef<HTMLDivElement>(null);
  const isAnim            = useRef(false);
  const statuses: TaskStatus[] = ["todo", "in_progress", "done"];

  const openDrop = (): void => {
    if (disabled || isAnim.current) return;
    isAnim.current = true; setOpen(true);
  };
  const closeDrop = (): void => {
    if (!dropRef.current || isAnim.current) return; isAnim.current = true;
    gsap.to(dropRef.current, { opacity: 0, y: -6, duration: 0.15, ease: "power2.in",
      onComplete: () => { setOpen(false); isAnim.current = false; } });
  };

  useEffect(() => {
    if (!open || !dropRef.current) return;
    gsap.fromTo(dropRef.current, { opacity: 0, y: -6 },
      { opacity: 1, y: 0, duration: 0.18, ease: "power3.out", onComplete: () => { isAnim.current = false; } });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent): void => { if (!wrapRef.current?.contains(e.target as Node)) closeDrop(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => open ? closeDrop() : openDrop()}
        disabled={disabled}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors duration-150 ${disabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer"} ${statusConfig[value]?.classes || "bg-gray-100"}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[value]?.dot || "bg-gray-400"}`} />
        {value}
        {!disabled && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true" className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}>
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      {open && (
        <div ref={dropRef} className="absolute left-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-xl shadow-md p-1.5 z-20" style={{ opacity: 0 }}>
          {statuses.map((s) => (
            <button key={s} type="button"
              onClick={() => { onChange(s); closeDrop(); }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-100 cursor-pointer ${s === value ? statusConfig[s].classes : "text-gray-700 hover:bg-gray-100"}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[s].dot}`} />
              {s}
              {s === value && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="ml-auto text-current" aria-hidden="true">
                  <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const PriorityDropdown: FC<PriorityDropdownProps> = ({ value, onChange, disabled }) => {
  const [open, setOpen] = useState(false);
  const wrapRef         = useRef<HTMLDivElement>(null);
  const dropRef         = useRef<HTMLDivElement>(null);
  const isAnim          = useRef(false);
  const priorities: TaskPriority[] = ["high", "medium", "low"];

  const openDrop  = (): void => { if (disabled || isAnim.current) return; isAnim.current = true; setOpen(true); };
  const closeDrop = (): void => {
    if (!dropRef.current || isAnim.current) return; isAnim.current = true;
    gsap.to(dropRef.current, { opacity: 0, y: -6, duration: 0.15, ease: "power2.in",
      onComplete: () => { setOpen(false); isAnim.current = false; } });
  };

  useEffect(() => {
    if (!open || !dropRef.current) return;
    gsap.fromTo(dropRef.current, { opacity: 0, y: -6 },
      { opacity: 1, y: 0, duration: 0.18, ease: "power3.out", onComplete: () => { isAnim.current = false; } });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent): void => { if (!wrapRef.current?.contains(e.target as Node)) closeDrop(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button type="button" onClick={() => open ? closeDrop() : openDrop()} disabled={disabled}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors duration-150 ${disabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer"} ${priorityConfig[value]?.classes || "bg-gray-100"}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig[value]?.dot || "bg-gray-400"}`} />
        {value}
        {!disabled && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true" className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}>
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      {open && (
        <div ref={dropRef} className="absolute left-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded-xl shadow-md p-1.5 z-20" style={{ opacity: 0 }}>
          {priorities.map((p) => (
            <button key={p} type="button"
              onClick={() => { onChange(p); closeDrop(); }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-100 cursor-pointer ${p === value ? priorityConfig[p].classes : "text-gray-700 hover:bg-gray-100"}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig[p].dot}`} />
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const MetaRow: FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col gap-1.5 pt-4 border-t border-gray-100 first:pt-0 first:border-0">
    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
    {children}
  </div>
);

const TaskDetailModal: FC<ModalProps> = ({ isOpen, onClose, task, onEdit, onDelete, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const overlayRef  = useRef<HTMLDivElement>(null);
  const modalRef    = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleUpdateStatus = async (status: TaskStatus) => {
    if (!task._id) return;
    setIsUpdating(true);
    try {
      await onUpdate(task._id, { status });
      toast.success(`Task marked as ${status}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePriority = async (priority: TaskPriority) => {
    if (!task._id) return;
    setIsUpdating(true);
    try {
      await onUpdate(task._id, { priority });
      toast.success(`Priority updated to ${priority}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update priority");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!task._id) return;
    try {
      await taskService.deleteTask(task._id);
      onDelete(task._id);
      toast.success("Task deleted successfully");
      handleClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete task");
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    setDeleteConfirm(false);
    isAnimating.current = true;

    const tl = gsap.timeline({ onComplete: () => { isAnimating.current = false; } });
    tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power2.out" });
    tl.fromTo(modalRef.current, { opacity: 0, scale: 0.95, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.28, ease: "power3.out" }, "-=0.1");
  }, [isOpen]);

  const handleClose = (): void => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        document.body.style.overflow = "";
        onClose();
      },
    });
    tl.to(modalRef.current, { opacity: 0, scale: 0.95, y: 12, duration: 0.2, ease: "power2.in" });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.18, ease: "power2.in" }, "-=0.1");
  };

  useEffect(() => {
    if (!isOpen) return;
    const h = (e: globalThis.KeyboardEvent): void => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [isOpen]);

  if (!isOpen || !task) return null;

  const completionPct = task.status === "done" ? 100 : task.status === "in_progress" ? 50 : 0;

  return (
    <div
      ref={overlayRef}
      onMouseDown={(e) => { if (e.target === overlayRef.current) handleClose(); }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-detail-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-3xl bg-white rounded-xl shadow-lg flex flex-col max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0 bg-gray-50/50">
          <div className="flex items-center gap-3">
             <span className="text-xs text-gray-500 font-mono bg-white border border-gray-200 px-2 py-0.5 rounded shadow-sm">
                TASK-{task._id?.substring(0, 5).toUpperCase() || "NEW"}
             </span>
             <span className="text-gray-300">|</span>
             <StatusDropdown value={task.status as TaskStatus} onChange={handleUpdateStatus} disabled={isUpdating} />
             <PriorityDropdown value={task.priority as TaskPriority} onChange={handleUpdatePriority} disabled={isUpdating} />
          </div>
          
          <div className="flex items-center gap-2">
            {!deleteConfirm ? (
              <>
                <button type="button" onClick={() => onEdit(task)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  Edit
                </button>
                <button type="button" onClick={() => setDeleteConfirm(true)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors shadow-sm bg-white border border-gray-200 hover:border-red-200 cursor-pointer"
                  title="Delete"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 3.5h10M4.5 3.5V2a1 1 0 011-1h3a1 1 0 011 1v1.5M5.5 6.5v4M8.5 6.5v4M3.5 3.5h7v8.5a1 1 0 01-1 1h-5a1 1 0 01-1-1v-8.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </>
            ) : (
              <div className="flex items-center bg-red-50 pl-3 pr-1 py-1 rounded-lg border border-red-100">
                <span className="text-xs text-red-600 font-medium mr-3">Are you sure?</span>
                <button onClick={handleDelete} className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors cursor-pointer mr-2">Yes, Delete</button>
                <button onClick={() => setDeleteConfirm(false)} className="text-xs bg-white text-gray-600 hover:text-gray-900 px-2 py-1 rounded border border-gray-200 transition-colors cursor-pointer">Cancel</button>
              </div>
            )}
            
            <div className="w-px h-5 bg-gray-200 mx-1" />
            
            <button type="button" onClick={handleClose}
              aria-label="Close"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <path d="M1 1L12 12M12 1L1 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 flex-1 overflow-auto">
          <div className="col-span-1 md:col-span-2 flex flex-col px-6 py-6 gap-6 border-r border-gray-100">
            <div className="flex flex-col gap-2">
              <h2 id="task-detail-title" className="text-2xl font-bold text-gray-900 leading-tight">
                {task.title}
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 shadow-sm ${
                      completionPct === 100 ? "bg-green-500" : completionPct === 0 ? "bg-gray-300" : "bg-indigo-600"
                    }`}
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-400 tabular-nums">{completionPct}%</span>
                
                {task.status !== "done" ? (
                   <button onClick={() => handleUpdateStatus("done")} disabled={isUpdating} className="ml-2 text-[10px] uppercase tracking-wider font-bold text-gray-500 border border-gray-200 hover:border-green-400 hover:bg-green-50 hover:text-green-700 px-2 py-1 rounded transition-colors cursor-pointer disabled:opacity-50">
                     Mark Done
                   </button>
                ) : (
                  <button onClick={() => handleUpdateStatus("in_progress")} disabled={isUpdating} className="ml-2 text-[10px] uppercase tracking-wider font-bold text-gray-500 border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 px-2 py-1 rounded transition-colors cursor-pointer disabled:opacity-50">
                     Mark In Progress
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Description</p>
              <div className="bg-gray-50/50 rounded-xl px-4 py-4 min-h-25 border border-gray-100">
                {task.description ? (
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {task.description}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic">No description provided...</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-1 flex flex-col px-5 py-6 gap-5 bg-white">
            
            <MetaRow label="Due Date">
               {task.dueDate ? (
                 <div className="flex items-center gap-2 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-indigo-500"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                   {new Date(task.dueDate).toLocaleString()}
                 </div>
               ) : (
                 <p className="text-xs text-gray-400 italic">Not set</p>
               )}
            </MetaRow>

            <MetaRow label="Tags">
              <div className="flex flex-wrap gap-1.5 mt-1">
                {task.tags && task.tags.length > 0 ? (
                  task.tags.map(tag => (
                   <span key={tag} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${tagColorMap[tag] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                     {tag}
                   </span>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic">No tags added</p>
                )}
              </div>
            </MetaRow>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;