import type { FC, ReactNode, InputHTMLAttributes } from "react";

interface SettingsFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon: ReactNode;
  error?: string;
  readOnly?: boolean;
  locked?: boolean; 
}

const SettingsField: FC<SettingsFieldProps> = ({
  id,
  label,
  icon,
  error,
  readOnly,
  locked,
  ...rest
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      <div
        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all duration-200 ${
          locked
            ? "bg-gray-50 border-gray-200 cursor-not-allowed"
            : readOnly
            ? "bg-gray-50 border-gray-200"
            : "bg-white border-gray-300 focus-within:border-indigo-400 focus-within:shadow-sm focus-within:shadow-indigo-100"
        }`}
      >
        <span className={`shrink-0 ${locked ? "text-gray-300" : "text-gray-400"}`}>
          {icon}
        </span>
        <input
          id={id}
          readOnly={readOnly || locked}
          disabled={locked}
          className={`flex-1 text-sm outline-none min-w-0 bg-transparent ${
            locked ? "text-gray-400 cursor-not-allowed" : "text-gray-800 placeholder-gray-400"
          }`}
          {...rest}
        />
        {locked && (
          <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">
            Cannot edit
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
};

export default SettingsField;
