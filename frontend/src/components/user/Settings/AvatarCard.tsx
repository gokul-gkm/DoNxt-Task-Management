import { type FC } from "react";
import { type UserProfile } from "../../../services/api/user.api";
import InitialsAvatar from "../../ui/InitialsAvatar";

interface AvatarCardProps {
  profile: UserProfile | null;
}

const AvatarCard: FC<AvatarCardProps> = ({ profile }) => {
  const fullName = profile
    ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim()
    : "User";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 sm:px-6 py-5 flex flex-col sm:flex-row items-center gap-4">
      <div className="relative shrink-0">
        <InitialsAvatar name={fullName} size="lg" className="ring-4 ring-indigo-50" />
        <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
      </div>

      <div className="flex flex-col items-center sm:items-start gap-0.5 min-w-0">
        <h3 className="text-base font-semibold text-gray-900 truncate">{fullName || "—"}</h3>
        <p className="text-sm text-gray-500 truncate">{profile?.email ?? ""}</p>
        <span className="mt-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
          Active
        </span>
      </div>
    </div>
  );
};

export default AvatarCard;
