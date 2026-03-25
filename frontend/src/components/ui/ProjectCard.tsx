import { useEffect, useRef } from "react";
import type { FC } from "react";
import { gsap } from "gsap";
import { FolderIcon } from "./icons";
import ProgressBar from "./ProgressBar";
import type { ProjectData } from "../../services/api/project.api";
import ProjectMenu from "./ProjectMenu";

export interface ProjectCardProps {
  project: ProjectData;
  cardRef?: (el: HTMLElement | null) => void;
  onClick?: (project: ProjectData) => void;
  onEdit?: (project: ProjectData) => void;
  onDelete?: (project: ProjectData) => void;
}

const statusConfig: Record<string, { label: string; classes: string }> = {
  Active:    { label: "Active",    classes: "bg-green-50 text-green-700 border border-green-100" },
  Completed: { label: "Completed", classes: "bg-indigo-50 text-indigo-600 border border-indigo-100" },
};

const ProjectCard: FC<ProjectCardProps> = ({ project, cardRef, onClick, onEdit, onDelete }) => {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const barRef    = useRef<HTMLDivElement | null>(null);
  const animated  = useRef<boolean>(false);

  // Fallbacks for project coloring
  const pColor = project.color || "#4f46e5"; // default indigo
  const sConf = statusConfig[project.status] || statusConfig["Active"];

  useEffect(() => {
    const el = barRef.current;
    if (!el || animated.current) return;
    animated.current = true;
    gsap.to(el, {
      width: `${project.progress || 0}%`,
      duration: 0.9,
      ease: "power3.out",
      delay: 0.3,
    });
  }, [project.progress]);

  const handleMouseEnter = (): void => {
    gsap.to(wrapRef.current, { scale: 1.02, duration: 0.2, ease: "power2.out" });
  };

  const handleMouseLeave = (): void => {
    gsap.to(wrapRef.current, { scale: 1, duration: 0.2, ease: "power2.out" });
  };

  const setBarRef = (el: HTMLDivElement | null): void => {
    barRef.current = el;
  };

  return (
    <div
      ref={(el) => {
        (wrapRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        if (cardRef) cardRef(el);
      }}
      onClick={() => onClick && onClick(project)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer w-full"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${pColor}1A`, color: pColor, border: `1px solid ${pColor}33` }}
          >
            <FolderIcon />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 truncate">{project.name}</h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sConf.classes}`}>
            {sConf.label}
          </span>
          <ProjectMenu 
            onEdit={() => onEdit && onEdit(project)} 
            onDelete={() => onDelete && onDelete(project)} 
          />
        </div>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">{project.description}</p>

      <div className="flex items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-medium">{project.taskCount || 0} tasks created</span>
        </div>
      </div>

      <div className="pt-2">
        <ProgressBar progress={project.progress || 0} barRef={setBarRef} />
      </div>
    </div>
  );
};

export default ProjectCard;
