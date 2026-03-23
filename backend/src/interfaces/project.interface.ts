export interface ProjectStats {
  total: number;
  completed: number;
}


export interface ProjectStatsData {
  total: number;
  completed: number;
  pending: number;
  progress: number;
  isCompleted: boolean;
}

export interface ProjectStatsResponse {
  status: boolean;
  message: string;
  data: ProjectStatsData;
}