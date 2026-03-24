import { type FC, useRef, type InputHTMLAttributes } from "react";
import { gsap } from "gsap";
import type { ReactNode } from "react";

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  type: "email" | "password" | "text";
  icon: ReactNode;
  rightSlot?: ReactNode;
}

const InputField: FC<InputFieldProps> = ({
  id,
  type,
  icon,
  rightSlot,
  autoFocus,
  ...rest
}) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleFocus = (): void => {
    const target = ref.current?.parentElement;
    if (target) {
      gsap.to(target, { scale: 1.015, duration: 0.18, ease: "power1.out" });
    }
  };

  const handleBlur = (): void => {
    const target = ref.current?.parentElement;
    if (target) {
      gsap.to(target, { scale: 1, duration: 0.18, ease: "power1.out" });
    }
  };

  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl focus-within:border-blue-400 focus-within:bg-white focus-within:shadow-sm transition-all duration-200">
      <span className="text-gray-400 flex-shrink-0">{icon}</span>
      <input
        ref={ref}
        id={id}
        type={type}
        autoFocus={autoFocus}
        onFocus={handleFocus}
        onBlur={(e) => {
          handleBlur();
          rest.onBlur?.(e);
        }}
        className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none disabled:cursor-not-allowed"
        {...rest}
      />
      {rightSlot && <span className="flex-shrink-0">{rightSlot}</span>}
    </div>
  );
};

export default InputField;
