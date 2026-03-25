import { Server as HttpServer } from "http";

export interface ISocketService {
  initialize(server: HttpServer): void;
  emitToUser(userId: string, event: string, data: any): void;
  emitToProject(projectId: string, event: string, data: any): void;
}
