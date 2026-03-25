import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface SelectFieldProps<T extends string> {
  id:       string;
  label:    string;
  value:    T;
  options:  { value: T; label: string }[];
  onChange: (v: T) => void;
}

function SelectField<T extends string>({
  id, label, value, options, onChange,
}: SelectFieldProps<T>) {
  const [open, setOpen]  = useState(false);
  const wrapRef          = useRef<HTMLDivElement>(null);
  const dropRef          = useRef<HTMLDivElement>(null);
  const isAnim           = useRef(false);

  const openDrop = (): void => {
    if (isAnim.current) return; isAnim.current = true; setOpen(true);
  };
  const closeDrop = (): void => {
    if (!dropRef.current || isAnim.current) return; isAnim.current = true;
    gsap.to(dropRef.current, {
      opacity: 0, y: -6, duration: 0.15, ease: "power2.in",
      onComplete: () => { setOpen(false); isAnim.current = false; },
    });
  };

  useEffect(() => {
    if (!open || !dropRef.current) return;
    gsap.fromTo(dropRef.current, { opacity: 0, y: -6 },
      { opacity: 1, y: 0, duration: 0.18, ease: "power3.out",
        onComplete: () => { isAnim.current = false; } });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent): void => {
      if (!wrapRef.current?.contains(e.target as Node)) closeDrop();
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? value;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
      <div ref={wrapRef} className="relative">
        <button
          type="button" id={id}
          onClick={() => open ? closeDrop() : openDrop()}
          className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-sm text-gray-900 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200 cursor-pointer"
        >
          <span>{selectedLabel}</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"
            className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
            <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {open && (
          <div ref={dropRef}
            className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-md p-1.5 z-20"
            style={{ opacity: 0 }}>
            {options.map((opt) => (
              <button key={opt.value} type="button"
                onClick={() => { onChange(opt.value); closeDrop(); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-100 cursor-pointer ${
                  opt.value === value ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>{opt.label}</span>
                {opt.value === value && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 6L5 9L10 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SelectField;
