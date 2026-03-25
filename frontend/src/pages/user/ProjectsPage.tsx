import { useEffect, useRef, useState, useMemo } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { toast } from "sonner";
import { projectService, type ProjectData } from "../../services/api/project.api";
import ProjectModal, { type ProjectForm } from "../../components/ui/ProjectModal";
import ProjectMenu from "../../components/ui/ProjectMenu";
import ProjectCard from "../../components/ui/ProjectCard";
import { progressColor } from "../../components/ui/ProgressBar";
import { SpinnerIcon } from "../../components/ui/icons";
import { useSocket } from "../../context/SocketContext";

const ProjectsPage: FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  const { socket } = useSocket();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<"Active" | "Completed" | "All">("All");
  const [view, setView] = useState<"grid" | "list">("grid");

  const cardRefs = useRef<HTMLElement[]>([]);

  const registerCard = (el: HTMLElement | null): void => {
    if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el);
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await projectService.getProjects();
      const fetchedProjects = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setProjects(fetchedProjects);
    } catch (error: any) {
      toast.error(error.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleEvent = (data: any) => {
      console.log("[ProjectsPage] Received socket event:", data);
      fetchProjects();
    };
    socket.on("task:created", handleEvent);
    socket.on("task:updated", handleEvent);
    socket.on("task:deleted", handleEvent);

    const handleProjectEvent = (data: any) => {
      console.log("[ProjectsPage] Received project socket event:", data);
      fetchProjects();
    };

    socket.on("project:created", handleProjectEvent);
    socket.on("project:updated", handleProjectEvent);
    socket.on("project:deleted", handleProjectEvent);

    return () => {
      socket.off("task:created", handleEvent);
      socket.off("task:updated", handleEvent);
      socket.off("task:deleted", handleEvent);
      socket.off("project:created", handleProjectEvent);
      socket.off("project:updated", handleProjectEvent);
      socket.off("project:deleted", handleProjectEvent);
    };
  }, [socket]);

  useEffect(() => {
    cardRefs.current = [];
  }, []);

  useEffect(() => {
    if (loading || cardRefs.current.length === 0) return;
    gsap.fromTo(
      cardRefs.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, ease: "power3.out", delay: 0.1 }
    );
  }, [filter, search, loading, view, projects]);

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project: ProjectData) => {
    setModalMode("edit");
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (project: ProjectData) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  const handleProjectSubmit = async (data: ProjectForm) => {
    try {
      if (modalMode === "create") {
        await projectService.createProject(data);
        toast.success("Project created successfully");
      } else if (selectedProject?._id) {
        await projectService.updateProject(selectedProject._id, data);
        toast.success("Project updated successfully");
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${modalMode} project`);
    }
  };

  const confirmDeleteProject = async () => {
    if (!selectedProject?._id) return;
    try {
      await projectService.deleteProject(selectedProject._id);
      toast.success("Project deleted successfully");
      setIsDeleteModalOpen(false);
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete project");
    }
  };

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "All" || p.status === filter;
      return matchSearch && matchFilter;
    });
  }, [projects, search, filter]);

  const activeCount = projects.filter((p) => p.status === "Active").length;
  const completedCount = projects.filter((p) => p.status === "Completed").length;

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and organize your work</p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-150 shadow-sm w-full sm:w-auto"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1.5V12.5M1.5 7H12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          New Project
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { label: "All projects", value: projects.length, active: filter === "All", onClick: () => setFilter("All") },
          { label: "Active", value: activeCount, active: filter === "Active", onClick: () => setFilter("Active") },
          { label: "Completed", value: completedCount, active: filter === "Completed", onClick: () => setFilter("Completed") },
        ].map(({ label, value, active, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              cardRefs.current = [];
              onClick();
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors duration-150 whitespace-nowrap ${
              active ? "bg-indigo-50 border-indigo-100 text-indigo-600" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {label}
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold ${
                active ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-500"
              }`}
            >
              {value}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg flex-1 sm:max-w-xs shadow-sm">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-400 shrink-0">
            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.4" />
            <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              cardRefs.current = [];
              setSearch(e.target.value);
            }}
            placeholder="Search projects…"
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none flex-1 min-w-0"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                cardRefs.current = [];
                setSearch("");
              }}
              className="text-gray-300 hover:text-gray-500 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1.5 1.5L10.5 10.5M10.5 1.5L1.5 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        <div className="hidden sm:block flex-1" />

        <div className="self-end sm:self-auto flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-lg shadow-sm">
          {(["grid", "list"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => {
                cardRefs.current = [];
                setView(v);
              }}
              aria-label={`${v} view`}
              className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors duration-150 ${
                view === v ? "bg-indigo-50 text-indigo-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              {v === "grid" ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
                  <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
                  <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
                  <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1.5 3.5H12.5M1.5 7H12.5M1.5 10.5H12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <SpinnerIcon className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-sm text-gray-500">Loading projects...</p>
        </div>
      ) : filtered.length > 0 ? (
        view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filtered.map((project, i) => (
              <ProjectCard 
                key={project._id || project.id || i} 
                project={project} 
                cardRef={registerCard} 
                onClick={() => navigate(`/projects/${project._id}`)} 
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((project, i) => (
              <div
                key={project._id || project.id || i}
                ref={registerCard}
                onClick={() => navigate(`/projects/${project._id}`)}
                className="bg-white border border-gray-200 rounded-xl px-4 sm:px-5 py-4 flex items-center gap-3 sm:gap-5 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer w-full"
              >
                <div
                  className="w-9 h-9 flex items-center justify-center shrink-0 rounded-lg border"
                  style={{
                    backgroundColor: `${project.color || "#4f46e5"}1A`,
                    borderColor: `${project.color || "#4f46e5"}33`,
                    color: project.color || "#4f46e5",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2 5.5C2 4.4 2.9 3.5 4 3.5H7L8.5 5.5H12C13.1 5.5 14 6.4 14 7.5V12C14 13.1 13.1 14 12 14H4C2.9 14 2 13.1 2 12V5.5Z"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-gray-900 truncate">{project.name}</span>
                    <span
                      className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                        project.status === "Completed"
                          ? "bg-indigo-50 text-indigo-600"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {project.status || "Active"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{project.description}</p>
                </div>
                <div className="hidden lg:flex flex-col gap-1 w-48 shrink-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs text-gray-400">Overall Progress</span>
                    <span className="text-xs font-semibold text-gray-700">{project.progress || 0}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${progressColor(project.progress || 0)}`}
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>
                </div>
                <ProjectMenu 
                  onEdit={() => handleOpenEditModal(project)} 
                  onDelete={() => handleOpenDeleteModal(project)}
                  className="shrink-0"
                />
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 gap-4 bg-white border border-gray-200 rounded-xl shadow-sm px-4">
          <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-indigo-500">
              <path
                d="M3 7C3 5.9 3.9 5 5 5H9.5L11 7H17C18.1 7 19 7.9 19 9V17C19 18.1 18.1 19 17 19H5C3.9 19 3 18.1 3 17V7Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path d="M11 10.5V15M8.5 12.5H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">No projects found</p>
            <p className="text-xs text-gray-500 mt-1 max-w-62.5 mx-auto">
              {search || filter !== "All"
                ? "Try adjusting your search or filter criteria."
                : "Get started by creating your first project."}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            {(search || filter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  cardRefs.current = [];
                  setSearch("");
                  setFilter("All");
                }}
                className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                Clear filters
              </button>
            )}
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              New Project
            </button>
          </div>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <p className="text-xs text-gray-400 text-center pb-4">
          Showing <span className="font-medium text-gray-600">{filtered.length}</span> of{" "}
          <span className="font-medium text-gray-600">{projects.length}</span> projects
        </p>
      )}

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleProjectSubmit}
        initialData={selectedProject ? {
          name: selectedProject.name,
          description: selectedProject.description || "",
          color: selectedProject.color || "#6366f1"
        } : undefined}
        mode={modalMode}
      />

      {isDeleteModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm flex flex-col gap-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Delete Project?</h3>
              <p className="text-sm text-gray-500 mt-1">
                Are you sure you want to delete <span className="font-semibold">"{selectedProject.name}"</span>? 
                This will also delete all tasks associated with this project. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProject}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;