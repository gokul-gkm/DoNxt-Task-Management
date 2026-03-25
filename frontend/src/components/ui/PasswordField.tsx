import { useState, type FC, type InputHTMLAttributes } from "react";
import { EyeIcon, EyeOffIcon } from "./icons";

interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon: React.ReactNode;
  error?: string;
}

const PasswordField: FC<PasswordFieldProps> = ({ id, label, icon, error, ...rest }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl focus-within:border-indigo-400 focus-within:shadow-sm focus-within:shadow-indigo-100 transition-all duration-200">
        <span className="text-gray-400 shrink-0">{icon}</span>
        <input
          id={id}
          type={visible ? "text" : "password"}
          className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent min-w-0"
          {...rest}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="shrink-0 text-gray-400 hover:text-indigo-500 transition-colors"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOffIcon width={15} height={15} /> : <EyeIcon width={15} height={15} />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
};

export default PasswordField;
