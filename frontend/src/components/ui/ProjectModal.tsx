import { useEffect, useRef, useState, type ChangeEvent, type FC } from "react";
import { gsap } from "gsap";
import { z } from "zod";
import { PaletteIcon } from "./icons";
import { projectSchema } from "../../lib/validations/project.z.validation";

export type ProjectForm = {
  name: string;
  description: string;
  color: string;
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectForm) => void;
  initialData?: ProjectForm;
  mode?: "create" | "edit";
};

interface InputFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  error?: string;
  required?: boolean;
}

interface TextAreaFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  error?: string;
}

interface ModalFooterProps {
  onCancel: () => void;
  onSubmit: () => void;
  isDisabled: boolean;
  isLoading: boolean;
  mode: "create" | "edit";
}

const STANDARD_COLORS = [
  "#ef4444", 
  "#f97316", 
  "#f59e0b", 
  "#10b981", 
  "#06b6d4", 
  "#3b82f6",
  "#6366f1", 
  "#8b5cf6", 
  "#d946ef", 
  "#64748b",
];

const InputField: FC<InputFieldProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  autoFocus = false,
  error,
  required = false,
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
      <label htmlFor={id} className="text-sm font-medium text-gray-700 block">
        {label}
        {required && <span className="text-indigo-500 ml-0.5">*</span>}
      </label>
      <input
        ref={inputRef}
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoFocus={autoFocus}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full px-4 py-2.5 border rounded-lg shadow-sm text-sm text-gray-900 placeholder-gray-400 bg-white focus:ring-2 focus:outline-none transition duration-200 ${
          error ? "border-red-400 focus:ring-red-300" : "border-gray-200 focus:ring-indigo-500"
        }`}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-500 mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
};

const TextAreaField: FC<TextAreaFieldProps> = ({ id, label, placeholder, value, onChange, rows = 3, error }) => {
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
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <span className="text-xs text-gray-400">Optional</span>
      </div>
      <textarea
        ref={areaRef}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
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
        <p className="text-xs text-gray-400 text-right">{value.length} / 200</p>
      </div>
    </div>
  );
};

interface ColorPickerAreaProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPickerArea: FC<ColorPickerAreaProps> = ({ color, onChange }) => {
  const handleHexChange = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith("#")) val = "#" + val;
    onChange(val);
  };

  return (
    <div className="flex flex-col gap-2 relative">
      <label className="text-sm font-medium text-gray-700">Project Color</label>
      <div className="flex flex-wrap items-center gap-3">
        {STANDARD_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            style={{ backgroundColor: c }}
            className={`w-7 h-7 rounded-full cursor-pointer flex items-center justify-center transition-transform hover:scale-110 ${
              color === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110 shadow-sm" : ""
            }`}
            aria-label={`Select color ${c}`}
          />
        ))}

        <label
          className={`relative w-7 h-7 rounded-full cursor-pointer flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors border-2 border-dashed border-gray-300 ${
            !STANDARD_COLORS.includes(color) ? "ring-2 ring-offset-2 ring-indigo-400 border-solid border-transparent shadow-sm" : ""
          }`}
          style={{ backgroundColor: !STANDARD_COLORS.includes(color) ? color : undefined }}
          title="Custom color"
        >
          <PaletteIcon className={`w-3.5 h-3.5 ${!STANDARD_COLORS.includes(color) ? "text-white" : "text-gray-500"}`} />
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </label>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Hex Code</span>
        <input
          type="text"
          value={color}
          onChange={handleHexChange}
          maxLength={7}
          className="w-24 px-2 py-1 text-xs border border-gray-200 rounded text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 uppercase"
        />
        <div className="w-4 h-4 rounded-full border border-gray-200 shrink-0" style={{ backgroundColor: color }} />
      </div>
    </div>
  );
};

const ModalFooter: FC<ModalFooterProps> = ({ onCancel, onSubmit, isDisabled, isLoading, mode }) => {
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = (): void => {
    if (isDisabled) return;
    gsap.to(submitBtnRef.current, { scale: 1.03, boxShadow: "0 6px 20px rgba(79,70,229,0.3)", duration: 0.18, ease: "power1.out" });
  };
  const handleMouseLeave = (): void => {
    gsap.to(submitBtnRef.current, { scale: 1, boxShadow: "0 2px 6px rgba(79,70,229,0.15)", duration: 0.18, ease: "power1.out" });
  };

  return (
    <div className="flex items-center justify-end gap-3 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150 cursor-pointer"
      >
        Cancel
      </button>
      <button
        ref={submitBtnRef}
        type="button"
        onClick={onSubmit}
        disabled={isDisabled}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-busy={isLoading}
        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-w-30"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2 text-center w-full">
            <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            {mode === "create" ? "Creating..." : "Saving..."}
          </span>
        ) : (
          mode === "create" ? "Create Project" : "Save Changes"
        )}
      </button>
    </div>
  );
};

const ProjectModal: FC<ModalProps> = ({ isOpen, onClose, onSubmit, initialData, mode = "create" }) => {
  const [form, setForm] = useState<ProjectForm>({ name: "", description: "", color: "#6366f1" });
  const [errors, setErrors] = useState<{ name?: string; description?: string; color?: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const overlayRef  = useRef<HTMLDivElement>(null);
  const modalRef    = useRef<HTMLDivElement>(null);
  const isAnimating = useRef<boolean>(false);
  const tlRef       = useRef<gsap.core.Timeline | null>(null);

  const isDisabled = isLoading;

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        setForm(initialData);
      } else {
        setForm({ name: "", description: "", color: "#6366f1" });
      }
      setErrors({});
      document.body.style.overflow = "hidden";
      
      const tl = gsap.timeline({ onComplete: () => { isAnimating.current = false; } });
      tlRef.current = tl;
      isAnimating.current = true;
      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power2.out" });
      tl.fromTo(modalRef.current, { opacity: 0, scale: 0.95, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.28, ease: "power3.out" }, "-=0.1");
    }
    return () => { tlRef.current?.kill(); };
  }, [isOpen, initialData, mode]);

  const handleClose = (): void => {
    if (isAnimating.current || isLoading) return;
    isAnimating.current = true;
    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        document.body.style.overflow = "";
        onClose();
      },
    });
    tl.to(modalRef.current, { opacity: 0, scale: 0.95, y: 12, duration: 0.2, ease: "power2.in" });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.18, ease: "power2.in" }, "-=0.1");
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: globalThis.KeyboardEvent): void => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === overlayRef.current) handleClose();
  };

  const handleSubmit = (): void => {
    try {
      const validData = projectSchema.parse({
        name: form.name.trim(),
        description: form.description.trim(),
        color: form.color,
      });
      setErrors({});
      setIsLoading(true);

      setTimeout(() => {
        onSubmit({
          name: validData.name,
          description: validData.description || "",
          color: validData.color,
        });
        setIsLoading(false);
        handleClose();
      }, 400);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 sm:px-4 pb-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="w-full sm:max-w-lg bg-white sm:rounded-xl rounded-t-2xl shadow-lg p-5 sm:p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 border rounded-xl flex items-center justify-center shrink-0 transition-colors"
              style={{ backgroundColor: `${form.color}1A`, borderColor: `${form.color}33`, color: form.color }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <rect x="1.5" y="4.5" width="15" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M5.5 4.5V3a1 1 0 011-1h5a1 1 0 011 1v1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M6 10h6M6 13h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h2 id="modal-title" className="text-base font-semibold text-gray-900">
                {mode === "create" ? "Create Project" : "Edit Project"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                {mode === "create" ? "Organize your team and workload" : "Update project details and preferences"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-150 cursor-pointer shrink-0 mt-0.5"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1.5 1.5L12.5 12.5M12.5 1.5L1.5 12.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="h-px bg-gray-100 -mx-5 sm:-mx-6" />

        <div className="flex flex-col gap-5">
          <InputField
            id="project-name"
            label="Project Name"
            placeholder="e.g. Design Team, Product, Marketing"
            value={form.name}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, name: e.target.value }));
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            autoFocus
            required
            error={errors.name}
          />

          <ColorPickerArea
            color={form.color}
            onChange={(color) => {
              setForm((prev) => ({ ...prev, color }));
              if (errors.color) setErrors((prev) => ({ ...prev, color: undefined }));
            }}
          />
          {errors.color && <p className="text-xs text-red-500 mt-1">{errors.color}</p>}

          <TextAreaField
            id="project-desc"
            label="Description"
            placeholder="What is this project for?"
            value={form.description}
            onChange={(e) => {
              if (e.target.value.length <= 200) {
                setForm((prev) => ({ ...prev, description: e.target.value }));
                if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
              }
            }}
            rows={3}
            error={errors.description}
          />
        </div>

        <div className="h-px bg-gray-100 -mx-5 sm:-mx-6" />

        <ModalFooter
          onCancel={handleClose}
          onSubmit={handleSubmit}
          isDisabled={isDisabled}
          isLoading={isLoading}
          mode={mode}
        />
      </div>
    </div>
  );
};

export default ProjectModal;
