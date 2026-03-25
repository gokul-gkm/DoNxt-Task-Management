import type { FC, RefObject } from "react";
import { MenuIcon } from "../../ui/icons";
import InitialsAvatar from "../../ui/InitialsAvatar";

interface TopbarProps {
  topbarRef: RefObject<HTMLElement | null>;
  pageTitle: string;
  user: { name: string; email: string };
  onMenuToggle: () => void;
}

const Topbar: FC<TopbarProps> = ({ topbarRef, pageTitle, user, onMenuToggle }) => (
  <header
    ref={topbarRef}
    className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10"
  >
    <div className="flex items-center gap-3 sm:gap-4">
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
      >
        <MenuIcon width={20} height={20} />
      </button>
      <h1 className="text-lg font-bold text-gray-900 truncate max-w-37.5 sm:max-w-xs">{pageTitle}</h1>
    </div>

    <div className="flex items-center gap-3">
      <button
        type="button"
        className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-gray-100 hover:ring-indigo-300 transition-all duration-150 cursor-pointer shrink-0"
        aria-label="User menu"
      >
        <InitialsAvatar name={user.name} size="sm" className="w-9 h-9 text-xs" />
      </button>
    </div>
  </header>
);

export default Topbar;
