export interface TaskQuery {
  projectId?: string;
  status?: "todo" | "in_progress" | "done" | "All";
  priority?: "low" | "medium" | "high";
  search?: string;
}