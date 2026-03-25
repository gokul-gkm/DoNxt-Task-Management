import type { FC } from "react";

function nameToColor(name: string): string {
  const colors = [
    ["#6366f1", "#e0e7ff"], 
    ["#8b5cf6", "#ede9fe"], 
    ["#ec4899", "#fce7f3"], 
    ["#f59e0b", "#fef3c7"], 
    ["#10b981", "#d1fae5"], 
    ["#3b82f6", "#dbeafe"],
    ["#ef4444", "#fee2e2"], 
    ["#14b8a6", "#ccfbf1"], 
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const [text, bg] = colors[Math.abs(hash) % colors.length];
  return `${bg}|${text}`;
}

interface InitialsAvatarProps {
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  xs: { outer: "w-7 h-7", text: "text-[10px]" },
  sm: { outer: "w-8 h-8", text: "text-xs" },
  md: { outer: "w-10 h-10", text: "text-sm" },
  lg: { outer: "w-16 h-16", text: "text-xl" },
};

const InitialsAvatar: FC<InitialsAvatarProps> = ({ name, size = "sm", className = "" }) => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const colorStr = nameToColor(name || "User");
  const [bg, text] = colorStr.split("|");
  const { outer, text: fontSize } = sizeMap[size];

  return (
    <div
      className={`${outer} ${fontSize} rounded-full flex items-center justify-center font-bold shrink-0 select-none ${className}`}
      style={{ backgroundColor: bg, color: text }}
      aria-label={name}
    >
      {initials || "U"}
    </div>
  );
};

export default InitialsAvatar;
