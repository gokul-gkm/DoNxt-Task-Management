import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import type { FC } from "react";
import { gsap } from "gsap";
import { useAuthStore } from "../../store/auth.store";

import { projectService } from "../../services/api/project.api";
import { taskService } from "../../services/api/task.api";
import { toast } from "sonner";

import ProjectSelectorModal from "../ui/ProjectSelectorModal";
import ProjectModal, { type ProjectForm } from "../ui/ProjectModal";
import CreateTaskModal, { type TaskForm } from "../ui/CreateTaskModal";


import Sidebar, { type NavItemConfig } from "./AppShell/Sidebar";
import Topbar from "./AppShell/Topbar";
import { 
  LayoutDashboardIcon, 
  FolderIcon, 
  SettingsIcon, 
  ChartLineIcon 
} from "../ui/icons";

const navItemsData: NavItemConfig[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: <LayoutDashboardIcon />,
  },
  {
    id: "projects",
    name: "Projects",
    icon: <FolderIcon width={18} height={18} />,
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: <ChartLineIcon width={18} height={18} />,
  },
  {
    id: "settings",
    name: "Settings",
    icon: <SettingsIcon />,
  },
];

const AppShell: FC = () => {
  const { userName, email } = useAuthStore();
  
  const user = {
    name: userName || "User",
    email: email || "user@donxt.com",
  };

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  const [isProjectSelectorOpen, setProjectSelectorOpen] = useState(false);
  const [isCreateProjectModalOpen, setCreateProjectModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const sidebarRef = useRef<HTMLElement>(null);
  const topbarRef = useRef<HTMLElement>(null);
  const navItemsRef = useRef<HTMLElement[]>([]);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const activeId = location.pathname.split("/").pop() || "dashboard";

  const handleNavClick = (id: string) => {
    navigate(`/${id}`);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const openNewTaskFlow = () => {
    setProjectSelectorOpen(true);
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setProjectSelectorOpen(false);
    setTimeout(() => setCreateTaskModalOpen(true), 200);
  };

  const handleCreateProjectRequest = () => {
    setProjectSelectorOpen(false);
    setTimeout(() => setCreateProjectModalOpen(true), 200);
  };

  const handleCreateProject = async (data: ProjectForm) => {
    try {
      const res = await projectService.createProject(data);
      const newProjectId = res.data?._id || res.data?.id || res._id || res.id;
      toast.success("Project created successfully");
      
      setSelectedProjectId(newProjectId);
      setTimeout(() => setCreateTaskModalOpen(true), 250);
    } catch (error: any) {
      toast.error(error.message || "Failed to create project");
    }
  };

  const handleCreateTask = async (data: TaskForm) => {
    if (!selectedProjectId) return;
    try {
      await taskService.createTask({ ...data, projectId: selectedProjectId });
      toast.success("Task created successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to create task");
    }
  };

  const pageTitleMap: Record<string, string> = {
    dashboard: "Dashboard",
    projects: "Projects",
    analytics: "Analytics",
    settings: "Settings",
  };

  useEffect(() => {
    navItemsRef.current = [];
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(sidebarRef.current, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.6 });
      tl.fromTo(topbarRef.current, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
      tl.fromTo(navItemsRef.current, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.35, stagger: 0.07 }, "-=0.3");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        sidebarRef={sidebarRef}
        navItemsRef={navItemsRef}
        activeId={activeId}
        isOpen={isSidebarOpen}
        navItems={navItemsData}
        onClose={() => setSidebarOpen(false)}
        onNavClick={handleNavClick}
        onNewTaskClick={openNewTaskFlow}
        user={user}
      />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-64 transition-all duration-300">
        <Topbar
          topbarRef={topbarRef}
          pageTitle={pageTitleMap[activeId] ?? "Dashboard"}
          user={user}
          onMenuToggle={() => setSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet context={{ openNewTaskFlow }} />
        </main>
      </div>

      <ProjectSelectorModal
        isOpen={isProjectSelectorOpen}
        onClose={() => setProjectSelectorOpen(false)}
        onSelectProject={handleSelectProject}
        onCreateNewProject={handleCreateProjectRequest}
      />
      <ProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setCreateProjectModalOpen(false)}
        onSubmit={handleCreateProject}
        mode="create"
      />
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
};

export default AppShell;