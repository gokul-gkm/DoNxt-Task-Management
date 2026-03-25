import { useEffect, useState, useRef, type FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { toast } from "sonner";
import { projectService, type ProjectData } from "../../services/api/project.api";
import { taskService, type TaskData } from "../../services/api/task.api";
import CreateTaskModal, { type TaskForm } from "../../components/ui/CreateTaskModal";
import TaskDetailModal from "../../components/ui/TaskDetailsModal";
import TaskItem from "../../components/ui/TaskItem";
import { SpinnerIcon, PlusIcon } from "../../components/ui/icons";
import { formatPreciseTimeRemaining } from "../../utils/date.utils";
import { useSocket } from "../../context/SocketContext";

const ProjectDetailsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);

  const { socket } = useSocket();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "todo" | "in_progress" | "done">("All");
  const [view, setView] = useState<"grid" | "list">("list");

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [editingTaskData, setEditingTaskData] = useState<TaskForm | undefined>(undefined);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editTaskId, setEditTaskId] = useState<string | null>(null);

  const cardRefs = useRef<HTMLElement[]>([]);
  const registerCard = (el: HTMLElement | null): void => {
    if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el);
  };

  const fetchProject = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await projectService.getProjectById(id);
      setProject(res?.data || res);
    } catch (error: any) {
      toast.error(error.message || "Failed to load project info");
      navigate("/projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    if (!id) return;
    try {
      setTasksLoading(true);
      const res = await taskService.getTasks({
        projectId: id,
        search: search.trim() || undefined,
        status: filter === "All" ? undefined : filter
      });
      setTasks(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
    } catch (error: any) {
      toast.error(error.message || "Failed to load tasks");
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  useEffect(() => {
    if (!socket || !id) return;
    
    socket.emit("join-project", id);
    
    const handleEvent = (data: any) => {
      console.log("[ProjectDetailsPage] Received socket event:", data);
      fetchTasks();
    };
    socket.on("task:created", handleEvent);
    socket.on("task:updated", handleEvent);
    socket.on("task:deleted", handleEvent);

    const handleProjectUpdate = (data: any) => {
      if (data._id === id || data.id === id) {
        console.log("[ProjectDetailsPage] Received project update event:", data);
        fetchProject();
      }
    };

    const handleProjectDelete = (data: any) => {
      if (data.projectId === id) {
        console.log("[ProjectDetailsPage] Current project deleted, navigating back...");
        toast.error("This project has been deleted.");
        navigate("/projects");
      }
    };

    socket.on("project:updated", handleProjectUpdate);
    socket.on("project:deleted", handleProjectDelete);

    return () => {
      socket.emit("leave-project", id);
      socket.off("task:created", handleEvent);
      socket.off("task:updated", handleEvent);
      socket.off("task:deleted", handleEvent);
      socket.off("project:updated", handleProjectUpdate);
      socket.off("project:deleted", handleProjectDelete);
    };
  }, [socket, id]);

  useEffect(() => {
    const handler = setTimeout(() => {
      cardRefs.current = [];
      fetchTasks();
    }, 300);
    return () => clearTimeout(handler);
  }, [search, filter, id]);

  useEffect(() => {
    if (tasksLoading || cardRefs.current.length === 0) return;
    gsap.fromTo(
      cardRefs.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" }
    );
  }, [tasksLoading, view]);

  const handleCreateNewClick = () => {
    setFormMode("create");
    setEditingTaskData(undefined);
    setIsTaskFormOpen(true);
  };

  const handleEditClick = (task: TaskData) => {
    setSelectedTask(null);
    setFormMode("edit");
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
      if (formMode === "create") {
        await taskService.createTask({ ...formData, projectId: id } as TaskData);
        toast.success("Task created");
      } else if (formMode === "edit" && editTaskId) {
        await taskService.updateTask(editTaskId, formData);
        if (selectedTask?._id === editTaskId) {
          setSelectedTask({ ...selectedTask, ...formData } as TaskData);
        }
        toast.success("Task updated");
      }
      setIsTaskFormOpen(false);
      fetchTasks();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${formMode} task`);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      toast.success("Task deleted");
      setSelectedTask(null);
      fetchTasks();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete task");
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<TaskData>) => {
    try {
      await taskService.updateTask(taskId, updates);
      if (selectedTask?._id === taskId) {
        setSelectedTask(prev => prev ? { ...prev, ...updates } : null);
      }
      fetchTasks();
    } catch (error: any) {
      toast.error(error.message || "Failed to update task");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <SpinnerIcon className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-sm text-gray-500">Loading project...</p>
      </div>
    );
  }

  if (!project) return null;

  const filterTabs = [
    { label: "All Tasks", value: "All" as const },
    { label: "Todo", value: "todo" as const },
    { label: "In Progress", value: "in_progress" as const },
    { label: "Done", value: "done" as const },
  ];

  const priorityColors = {
    high: "bg-red-50 text-red-600 border-red-100",
    medium: "bg-amber-50 text-amber-600 border-amber-100",
    low: "bg-green-50 text-green-600 border-green-100",
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/projects")}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all duration-200 shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <span className="px-2.5 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                {project.status || "Active"}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{project.description}</p>
          </div>
        </div>

        <button
          onClick={handleCreateNewClick}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-indigo-200/50"
        >
          <PlusIcon className="w-4 h-4" />
          Add New Task
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-xl w-fit shadow-sm overflow-x-auto scrollbar-hide">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                cardRefs.current = [];
                setFilter(tab.value);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                filter === tab.value
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group flex-1 md:w-64">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-xl shadow-sm h-10">
            {(["grid", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => {
                  cardRefs.current = [];
                  setView(v);
                }}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 ${
                  view === v ? "bg-indigo-50 text-indigo-600 shadow-inner" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                {v === "grid" ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      
      <div className="min-h-100">
        {tasksLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <SpinnerIcon className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-gray-500 font-medium">Updating results...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-gray-300 rounded-2xl gap-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            </div>
            <div className="text-center">
               <h3 className="text-gray-900 font-bold">No tasks found</h3>
               <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
                 {search ? `We couldn't find any tasks matching "${search}"` : "This project doesn't have any tasks in this category yet."}
               </p>
            </div>
            {search && (
              <button onClick={() => setSearch("")} className="text-indigo-600 text-sm font-bold hover:underline">
                Clear search
              </button>
            )}
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => {
              const tr = formatPreciseTimeRemaining(task.dueDate);
              return (
                <div
                  key={task._id}
                  ref={registerCard}
                  onClick={() => setSelectedTask(task)}
                  className="group bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg border ${priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium}`}>
                      {task.priority || "Medium"}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                      task.status === "done" ? "bg-green-50 text-green-600" : task.status === "in_progress" ? "bg-indigo-50 text-indigo-600" : "bg-gray-50 text-gray-500"
                    }`}>
                      {task.status?.replace('_', ' ') || "Todo"}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-3 mb-6 grow">{task.description}</p>
                  
                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                       <span className={`text-xs font-bold ${tr.status === 'overdue' && task.status !== 'done' ? 'text-red-500' : 'text-gray-500'}`}>
                         {tr.text}
                       </span>
                    </div>
                    {task.tags && task.tags.length > 0 && (
                      <span className="text-[10px] bg-gray-100 text-gray-400 font-bold px-1.5 py-0.5 rounded-md">
                        {task.tags.length} TAGS
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <div key={task._id} ref={registerCard}>
                 <TaskItem 
                    task={task} 
                    onClick={setSelectedTask} 
                    className="bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300" 
                 />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSubmit={handleTaskFormSubmit}
        initialData={editingTaskData}
      />
      
      {selectedTask && (
        <TaskDetailModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          onEdit={handleEditClick}
          onDelete={handleDeleteTask}
          onUpdate={handleUpdateTask}
        />
      )}
    </div>
  );
};

export default ProjectDetailsPage;

