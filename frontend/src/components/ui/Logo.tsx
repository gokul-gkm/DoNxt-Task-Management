import type { FC } from "react";
import { CheckIcon } from "./icons";

interface LogoProps {
  size?: "sm" | "md";
}

const Logo: FC<LogoProps> = ({ size = "md" }) => {
  const box = size === "sm" ? "w-7 h-7" : "w-8 h-8";
  const text = size === "sm" ? "text-base" : "text-lg";
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${box} bg-blue-500 rounded-xl flex items-center justify-center shadow-sm`}
      >
        <CheckIcon className={iconSize} />
      </div>
      <span className={`${text} font-bold text-gray-900 tracking-tight`}>
        DoNxt
      </span>
    </div>
  );
};

export default Logo;
