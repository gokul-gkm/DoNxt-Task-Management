export interface TaskQuery {
  projectId?: string;
  status?: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high";
}