import { type FC, useRef } from "react";
import { gsap } from "gsap";
import { SpinnerIcon } from "../icons";

interface TaskModalFooterProps {
  isEdit:     boolean;
  onCancel:   () => void;
  onSubmit:   () => void;
  isDisabled: boolean;
  isLoading:  boolean;
}

const TaskModalFooter: FC<TaskModalFooterProps> = ({ isEdit, onCancel, onSubmit, isDisabled, isLoading }) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = (): void => {
    if (isDisabled) return;
    gsap.to(btnRef.current, { scale: 1.03, boxShadow: "0 6px 20px rgba(79,70,229,0.3)", duration: 0.18, ease: "power1.out" });
  };
  const handleMouseLeave = (): void => {
    gsap.to(btnRef.current, { scale: 1, boxShadow: "0 2px 6px rgba(79,70,229,0.15)", duration: 0.18, ease: "power1.out" });
  };

  return (
    <div className="flex items-center justify-end gap-3 pt-2">
      <button type="button" onClick={onCancel}
        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150 cursor-pointer">
        Cancel
      </button>
      <button ref={btnRef} type="button" onClick={onSubmit}
        disabled={isDisabled} aria-busy={isLoading}
        onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
        {isLoading ? (
          <span className="flex items-center gap-2">
            <SpinnerIcon className="w-3.5 h-3.5" />
            Saving…
          </span>
        ) : isEdit ? "Save Changes" : "Create Task"}
      </button>
    </div>
  );
};

export default TaskModalFooter;
