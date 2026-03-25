import { useEffect, useRef, useState, type FC } from "react";
import { gsap } from "gsap";
import { projectService, type ProjectData } from "../../services/api/project.api";
import { SpinnerIcon, FolderIcon } from "./icons";

interface ProjectSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (projectId: string) => void;
  onCreateNewProject: () => void;
}

const ProjectSelectorModal: FC<ProjectSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectProject,
  onCreateNewProject,
}) => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const projectItemsRef = useRef<HTMLElement[]>([]);

  const registerProjectItem = (el: HTMLElement | null) => {
    if (el && !projectItemsRef.current.includes(el)) projectItemsRef.current.push(el);
  };

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await projectService.getProjects();
        if (isMounted) {
          setProjects(res.data || res || []);
        }
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    isAnimating.current = true;
    projectItemsRef.current = [];

    const tl = gsap.timeline({ onComplete: () => { isAnimating.current = false; } });
    tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power2.out" });
    tl.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.28, ease: "power3.out" },
      "-=0.1"
    );
  }, [isOpen]);

  useEffect(() => {
    if (!loading && isOpen && projectItemsRef.current.length > 0) {
      gsap.fromTo(
        projectItemsRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.25, stagger: 0.04, ease: "power2.out" }
      );
    }
  }, [loading, isOpen]);

  const handleClose = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        isAnimating.current = false;
        onClose();
      },
    });
    tl.to(modalRef.current, { opacity: 0, scale: 0.95, y: 12, duration: 0.2, ease: "power2.in" });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.18, ease: "power2.in" }, "-=0.1");
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onMouseDown={(e) => { if (e.target === overlayRef.current) handleClose(); }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-60 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="select-project-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white rounded-xl shadow-lg flex flex-col max-h-[85vh] overflow-hidden"
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 shrink-0">
          <div>
            <h2 id="select-project-title" className="text-lg font-bold text-gray-900">
              Select Project
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Select a project to add your new task into.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-150 cursor-pointer shrink-0"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <path d="M1 1L12 12M12 1L1 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="h-px bg-gray-100 mx-6 shrink-0" />

        <div className="overflow-y-auto px-6 py-5 flex flex-col gap-3 custom-scrollbar flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <SpinnerIcon className="w-6 h-6 text-indigo-500 animate-spin" />
              <span className="text-sm text-gray-500">Loading projects...</span>
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-2">
                <FolderIcon className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-gray-900">No projects yet</p>
              <p className="text-xs text-gray-500 mb-2">You need a project to hold your tasks.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1">
                Your Projects
              </p>
              {projects.map((p) => {
                const pId = p.id || p._id || "";
                return (
                  <button
                    key={pId}
                    ref={registerProjectItem}
                    onClick={() => {
                      document.body.style.overflow = "";
                      onSelectProject(pId);
                    }}
                    className="flex flex-col items-start gap-1 p-3 border border-gray-100 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-left cursor-pointer group opacity-0"
                  >
                    <div className="flex items-center gap-3 relative w-full">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-white shadow-sm"
                        style={{ borderColor: `${p.color || "#6366f1"}33`, color: p.color || "#6366f1" }}
                      >
                        <FolderIcon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-semibold text-gray-900 truncate">
                          {p.name}
                        </span>
                        <span className="text-xs text-gray-500 truncate">
                          {p.taskCount || 0} tasks
                        </span>
                      </div>
                      <div className="w-6 h-6 rounded-md bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0 absolute right-2">
                         <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                            <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="pt-2">
             <button
              onClick={() => {
                 document.body.style.overflow = "";
                 onCreateNewProject();
              }}
              className="w-full flex items-center gap-3 p-3 border border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-left cursor-pointer text-gray-600 group"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-gray-200 bg-white group-hover:border-indigo-200 shadow-sm text-gray-400 group-hover:text-indigo-500 transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold transition-colors">
                  Create New Project
                </span>
                <span className="text-xs text-gray-500">
                  Setup a new workflow
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSelectorModal;
