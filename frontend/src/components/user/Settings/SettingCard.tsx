import { type FC, type ReactNode } from "react";

interface SettingCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  iconBg: string;
  children: ReactNode;
}

const SettingCard: FC<SettingCardProps> = ({ title, description, icon, iconBg, children }) => (
  <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="flex items-start gap-3 sm:gap-4 px-5 sm:px-6 py-5 border-b border-gray-100">
      <div className={`w-10 h-10 flex items-center justify-center rounded-xl shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
    </div>
    <div className="px-5 sm:px-6 py-5">{children}</div>
  </section>
);

export default SettingCard;
