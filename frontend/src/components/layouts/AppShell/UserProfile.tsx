import { useState, useRef } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useAuthStore } from "../../../store/auth.store";
import InitialsAvatar from "../../ui/InitialsAvatar";
import { LogOutIcon } from "../../ui/icons";

interface UserProfileProps {
  user: { name: string; email: string };
}

const UserProfile: FC<UserProfileProps> = ({ user }) => {
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [hovered, setHovered] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showConfirm) {
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        onComplete: () => {
          setShowConfirm(true);
          gsap.fromTo(contentRef.current, 
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.2 }
          );
        }
      });
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    gsap.to(contentRef.current, {
      opacity: 0,
      y: 10,
      duration: 0.2,
      onComplete: () => {
        setShowConfirm(false);
        gsap.fromTo(contentRef.current, 
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.2 }
        );
      }
    });
  };

  const handleConfirmLogout = () => {
    logout();
    navigate("/auth/sign-in");
  };

  return (
    <div 
      ref={containerRef}
      className="w-full min-h-13.5"
    >
      <div
        ref={contentRef}
        onMouseEnter={() => !showConfirm && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-200 transition-all duration-200 ${
          showConfirm 
            ? "bg-gray-50 border-indigo-200 shadow-inner" 
            : (hovered ? "bg-red-50 border-red-200 shadow-sm cursor-pointer" : "bg-white")
        }`}
        onClick={!showConfirm ? handleLogoutClick : undefined}
      >
        {!showConfirm ? (
          <>
            <InitialsAvatar name={user.name} size="sm" />
            <div className="flex flex-col items-start min-w-0 flex-1">
              <span className="text-sm font-medium text-gray-900 truncate w-full text-left">
                {user.name}
              </span>
              <span className="text-xs text-gray-400 truncate w-full text-left">{user.email}</span>
            </div>
            <LogOutIcon 
              className={`shrink-0 transition-colors duration-200 ${hovered ? "text-red-500" : "text-gray-400"}`}
            />
          </>
        ) : (
          <div className="flex flex-col w-full gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
              Logout?
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-2 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex-1 px-2 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
