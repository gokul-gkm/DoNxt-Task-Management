import {
  type FC,
  useEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { z } from "zod";
import { taskSchema } from "../../lib/validations/task.z.validation";
import CustomDateTimePicker from "./CustomDateTimePicker";
import InputField from "./Form/InputField";
import TextAreaField from "./Form/TextAreaField";
import SelectField from "./Form/SelectField";
import TagInput from "./Form/TagInput";
import TaskModalHeader from "./CreateTaskModal/TaskModalHeader";
import TaskModalFooter from "./CreateTaskModal/TaskModalFooter";

type TaskStatus   = "todo" | "in_progress" | "done";
type TaskPriority = "low" | "medium" | "high";

export type TaskForm = {
  title:       string;
  description: string;
  status:      TaskStatus;
  priority:    TaskPriority;
  dueDate:     string;
  tags:        string[];
};

type Props = {
  isOpen:   boolean;
  onClose:  () => void;
  onSubmit: (task: TaskForm) => void;
  initialData?: TaskForm;
};

const defaultForm: TaskForm = {
  title:       "",
  description: "",
  status:      "todo",
  priority:    "medium",
  dueDate:     "",
  tags:        [],
};

const CreateTaskModal: FC<Props> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [form, setForm]       = useState<TaskForm>(initialData || defaultForm);
  const [errors, setErrors]   = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const overlayRef  = useRef<HTMLDivElement>(null);
  const modalRef    = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const fieldRefs   = useRef<HTMLElement[]>([]);

  const isDisabled = isLoading;
  const isEdit = !!initialData;

  const set = <K extends keyof TaskForm>(key: K, val: TaskForm[K]): void =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const registerField = (el: HTMLElement | null): void => {
    if (el && !fieldRefs.current.includes(el)) fieldRefs.current.push(el);
  };

  useEffect(() => {
    if (!isOpen) return;
    setForm(initialData || defaultForm);
    setErrors({});
    fieldRefs.current = [];
    document.body.style.overflow = "hidden";
    isAnimating.current = true;

    const tl = gsap.timeline({ onComplete: () => { isAnimating.current = false; } });
    tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power2.out" });
    tl.fromTo(modalRef.current, { opacity: 0, scale: 0.95, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.28, ease: "power3.out" }, "-=0.1");
    tl.fromTo(fieldRefs.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.05 }, "-=0.15");
  }, [isOpen, initialData]);

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
    const h = (e: globalThis.KeyboardEvent): void => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [isOpen, isLoading]);

  const handleSubmit = (): void => {
    try {
      const validData = taskSchema.parse(form);
      setErrors({});
      setIsLoading(true);

      setTimeout(() => {
        onSubmit({
          title: validData.title,
          description: validData.description || "",
          status: validData.status as TaskStatus,
          priority: validData.priority as TaskPriority,
          dueDate: validData.dueDate || "",
          tags: validData.tags,
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

  const statusOptions: { value: TaskStatus; label: string }[] = [
    { value: "todo",        label: "Todo"        },
    { value: "in_progress", label: "In Progress" },
    { value: "done",        label: "Done"        },
  ];

  const priorityOptions: { value: TaskPriority; label: string }[] = [
    { value: "low",    label: "Low"    },
    { value: "medium", label: "Medium" },
    { value: "high",   label: "High"   },
  ];

  return (
    <div
      ref={overlayRef}
      onMouseDown={(e) => { if (e.target === overlayRef.current) handleClose(); }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-60 px-4 py-6"
      role="dialog" aria-modal="true" aria-labelledby="create-task-title"
    >
      <div ref={modalRef}
        className="w-full max-w-lg bg-white rounded-xl shadow-lg flex flex-col max-h-[90vh] overflow-hidden"
      >
        <TaskModalHeader isEdit={isEdit} onClose={handleClose} />

        <div className="h-px bg-gray-100 mx-6 mt-5" />

        <div className="overflow-y-auto px-6 py-5 flex flex-col gap-4">
          <div ref={registerField}>
            <InputField id="task-title" label="Title" placeholder="e.g. Design login page"
              value={form.title}
              onChange={(e) => { set("title", e.target.value); if (errors.title) setErrors(p => ({ ...p, title: "" })); }}
              autoFocus required error={errors.title} />
          </div>

          <div ref={registerField}>
            <TextAreaField id="task-desc" label="Description"
              placeholder="What needs to be done? Add context, links, or notes…"
              value={form.description}
              onChange={(e) => {
                if (e.target.value.length <= 800) {
                  set("description", e.target.value);
                  if (errors.description) setErrors(p => ({ ...p, description: "" }));
                }
              }}
              rows={3}
              error={errors.description} />
          </div>

          <div ref={registerField} className="grid grid-cols-2 gap-3">
            <SelectField<TaskStatus>
              id="task-status" label="Status"
              value={form.status} options={statusOptions}
              onChange={(v) => set("status", v)} />
            <SelectField<TaskPriority>
              id="task-priority" label="Priority"
              value={form.priority} options={priorityOptions}
              onChange={(v) => set("priority", v)} />
          </div>

          <div ref={registerField}>
            <CustomDateTimePicker 
              id="task-due" 
              label="Due Date" 
              value={form.dueDate} 
              error={errors.dueDate}
              onChange={(v: string) => {
                set("dueDate", v);
                if (errors.dueDate) setErrors(p => ({ ...p, dueDate: "" }));
              }} 
            />
          </div>

          <TagInput tags={form.tags} onAdd={(t) => set("tags", [...form.tags, t])}
            onRemove={(t) => set("tags", form.tags.filter((x) => x !== t))} />
        </div>

        <div className="h-px bg-gray-100 mx-6" />

        <div className="px-6 pb-6 pt-4 shrink-0">
          <TaskModalFooter isEdit={isEdit} onCancel={handleClose} onSubmit={handleSubmit}
            isDisabled={isDisabled} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;