import { type FC, type ChangeEvent, useRef } from "react";
import { gsap } from "gsap";

interface TextAreaFieldProps {
  id:          string;
  label:       string;
  placeholder?: string;
  value:       string;
  onChange:    (e: ChangeEvent<HTMLTextAreaElement>) => void;
  rows?:       number;
  error?:      string;
  maxLength?:  number;
}

const TextAreaField: FC<TextAreaFieldProps> = ({
  id, label, placeholder, value, onChange, rows = 3, error, maxLength = 800
}) => {
  const areaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleFocus = (): void => {
    gsap.to(areaRef.current, { scale: 1.015, duration: 0.18, ease: "power1.out" });
  };
  const handleBlur = (): void => {
    gsap.to(areaRef.current, { scale: 1, duration: 0.18, ease: "power1.out" });
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-xs text-gray-400">Optional</span>
      </div>
      <textarea
        ref={areaRef} id={id} placeholder={placeholder} value={value}
        onChange={onChange} onFocus={handleFocus} onBlur={handleBlur}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full px-4 py-2.5 border rounded-lg shadow-sm text-sm text-gray-900 placeholder-gray-400 bg-white focus:ring-2 focus:outline-none resize-none transition duration-200 ${
          error ? "border-red-400 focus:ring-red-300" : "border-gray-200 focus:ring-indigo-500"
        }`}
      />
      <div className="flex justify-between items-start mt-0.5">
        {error ? (
          <p id={`${id}-error`} role="alert" className="text-xs text-red-500">
            {error}
          </p>
        ) : <span />}
        <span className="text-xs text-gray-400 text-right">{value.length}/{maxLength}</span>
      </div>
    </div>
  );
};

export default TextAreaField;
