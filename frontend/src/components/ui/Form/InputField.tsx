import { type FC, type ChangeEvent, useRef } from "react";
import { gsap } from "gsap";

interface InputFieldProps {
  id:          string;
  label:       string;
  placeholder?: string;
  value:       string;
  onChange:    (e: ChangeEvent<HTMLInputElement>) => void;
  autoFocus?:  boolean;
  error?:      string;
  required?:   boolean;
  type?:       string;
}

const InputField: FC<InputFieldProps> = ({
  id, label, placeholder, value, onChange, autoFocus = false,
  error, required = false, type = "text",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = (): void => {
    gsap.to(inputRef.current, { scale: 1.015, duration: 0.18, ease: "power1.out" });
  };
  const handleBlur = (): void => {
    gsap.to(inputRef.current, { scale: 1, duration: 0.18, ease: "power1.out" });
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-700 block text-left">
        {label}{required && <span className="text-indigo-500 ml-0.5">*</span>}
      </label>
      <input
        ref={inputRef} id={id} type={type}
        placeholder={placeholder} value={value}
        onChange={onChange} onFocus={handleFocus} onBlur={handleBlur}
        autoFocus={autoFocus} aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full px-4 py-2.5 border rounded-lg shadow-sm text-sm text-gray-900 placeholder-gray-400 bg-white focus:ring-2 focus:outline-none transition duration-200 ${
          error ? "border-red-400 focus:ring-red-300" : "border-gray-200 focus:ring-indigo-500"
        }`}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-500 mt-0.5 text-left">{error}</p>
      )}
    </div>
  );
};

export default InputField;
