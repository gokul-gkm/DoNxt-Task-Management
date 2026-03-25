import { type FC } from "react";
import { TaskHeaderEditIcon, TaskHeaderCheckIcon, CloseSmallIcon } from "../icons";

interface TaskModalHeaderProps {
  isEdit:  boolean;
  onClose: () => void;
}

const TaskModalHeader: FC<TaskModalHeaderProps> = ({ isEdit, onClose }) => {
  return (
    <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-0 shrink-0">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${isEdit ? "bg-amber-50 border-amber-100" : "bg-indigo-50 border-indigo-100"} border rounded-xl flex items-center justify-center shrink-0`}>
          {isEdit ? (
            <TaskHeaderEditIcon />
          ) : (
            <TaskHeaderCheckIcon />
          )}
        </div>
        <div>
          <h2 id="create-task-title" className="text-base font-semibold text-gray-900">
            {isEdit ? "Edit Task" : "Create Task"}
          </h2>
          <p className="text-sm text-gray-500">
            {isEdit ? "Update task details" : "Add a new task to your board"}
          </p>
        </div>
      </div>
      <button type="button" onClick={onClose} aria-label="Close"
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-150 cursor-pointer shrink-0 mt-0.5">
        <CloseSmallIcon />
      </button>
    </div>
  );
};

export default TaskModalHeader;
