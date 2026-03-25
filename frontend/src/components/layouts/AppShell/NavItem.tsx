import { useRef } from "react";
import type { FC, ReactNode } from "react";
import { gsap } from "gsap";

interface NavItemProps {
  id: string;
  name: string;
  icon: ReactNode;
  active?: boolean;
  onClick: (id: string) => void;
}

const NavItem: FC<NavItemProps> = ({ id, name, icon, active, onClick }) => {
  const itemRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = (): void => {
    if (active) return;
    gsap.to(itemRef.current, { x: 4, duration: 0.18, ease: "power1.out" });
  };

  const handleMouseLeave = (): void => {
    gsap.to(itemRef.current, { x: 0, duration: 0.18, ease: "power1.out" });
  };

  return (
    <button
      ref={itemRef}
      type="button"
      onClick={() => onClick(id)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer ${
        active
          ? "bg-indigo-50 text-indigo-600"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <span className={`shrink-0 ${active ? "text-indigo-600" : "text-gray-400"}`}>
        {icon}
      </span>
      <span>{name}</span>
      {active && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
      )}
    </button>
  );
};

export default NavItem;
