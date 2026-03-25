import type { FC, ReactNode, RefObject, MutableRefObject } from "react";
import { Link } from "react-router-dom";
import Logo from "../../ui/Logo";
import { CloseIcon, PlusIcon } from "../../ui/icons";
import NavItem from "./NavItem";
import UserProfile from "./UserProfile";

export type NavItemConfig = {
  id: string;
  name: string;
  icon: ReactNode;
};

interface SidebarProps {
  sidebarRef: RefObject<HTMLElement | null>;
  navItemsRef: MutableRefObject<HTMLElement[]>;
  activeId: string;
  isOpen: boolean;
  navItems: NavItemConfig[];
  onClose: () => void;
  onNavClick: (id: string) => void;
  onNewTaskClick: () => void;
  user: { name: string; email: string };
}

const Sidebar: FC<SidebarProps> = ({
  sidebarRef,
  navItemsRef,
  activeId,
  isOpen,
  navItems,
  onClose,
  onNavClick,
  onNewTaskClick,
  user,
}) => {
  const registerNavItem = (el: HTMLElement | null): void => {
    if (el && !navItemsRef.current.includes(el)) {
      navItemsRef.current.push(el);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col justify-between px-4 py-5 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-6">
          <div className="px-2 pt-2 flex items-center justify-between">
            <Link to="/dashboard" onClick={onClose}>
              <Logo size="sm" />
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-gray-500 hover:text-gray-800 rounded-md"
            >
              <CloseIcon width={20} height={20} />
            </button>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={onNewTaskClick}
              className="w-full flex items-center gap-3 px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors duration-150 cursor-pointer shadow-sm shadow-indigo-200"
            >
              <PlusIcon width={16} height={16} strokeWidth={2} />
              New Task
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">
              Menu
            </p>
            {navItems.map((item) => (
              <div key={item.id} ref={registerNavItem}>
                <NavItem
                  id={item.id}
                  name={item.name}
                  icon={item.icon}
                  active={item.id === activeId}
                  onClick={onNavClick}
                />
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <div className="h-px bg-gray-100 -mx-4" />
          <UserProfile user={user} />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

