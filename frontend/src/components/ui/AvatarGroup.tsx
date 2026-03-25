import type { FC } from "react";

export interface AvatarGroupProps {
  avatars: string[];
  max?: number;
}

const AvatarGroup: FC<AvatarGroupProps> = ({ avatars, max = 3 }) => {
  const visible  = avatars.slice(0, max);
  const overflow = avatars.length - max;

  if (avatars.length === 0) {
    return <span className="text-xs text-gray-400 italic">No members</span>;
  }

  return (
    <div className="flex items-center">
      {visible.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt="Member"
          className="w-6 h-6 rounded-full object-cover ring-2 ring-white bg-gray-200"
          style={{ marginLeft: i === 0 ? 0 : "-6px" }}
        />
      ))}
      {overflow > 0 && (
        <div
          className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-gray-500 text-xs font-medium"
          style={{ marginLeft: "-6px" }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
