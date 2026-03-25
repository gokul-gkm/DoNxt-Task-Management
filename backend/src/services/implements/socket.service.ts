import { Service } from "typedi";
import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io"
import { ISocketService } from "../interfaces/socket.service.interface";

@Service()
export class SocketService implements ISocketService {
  private io: Server | null = null;
  private userSockets: Map<string, string[]> = new Map();

  initialize(server: HttpServer): void {
    this.io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.io.on("connection", (socket: Socket) => {
      const userId = socket.handshake.query.userId as string;
      
      if (userId) {
        console.log(`User connected: ${userId} (${socket.id})`);
        
        const existingSockets = this.userSockets.get(userId) || [];
        this.userSockets.set(userId, [...existingSockets, socket.id]);
        
        socket.join(`user:${userId}`);
      }

      socket.on("join-project", (projectId: string) => {
        socket.join(`project:${projectId}`);
        console.log(`Socket ${socket.id} joined project room: ${projectId}`);
      });

      socket.on("leave-project", (projectId: string) => {
        socket.leave(`project:${projectId}`);
        console.log(`Socket ${socket.id} left project room: ${projectId}`);
      });

      socket.on("disconnect", () => {
        if (userId) {
          const existingSockets = this.userSockets.get(userId) || [];
          this.userSockets.set(userId, existingSockets.filter(id => id !== socket.id));
          if (this.userSockets.get(userId)?.length === 0) {
            this.userSockets.delete(userId);
          }
          console.log(`User disconnected: ${userId} (${socket.id})`);
        }
      });
    });

    console.log("Socket.io initialized");
  }

  emitToUser(userId: string, event: string, data: any): void {
    if (this.io) {
      console.log(`[SocketService] Emitting event: ${event} to user:${userId}`);
      this.io.to(`user:${userId}`).emit(event, data);
    }
  }

  emitToProject(projectId: string, event: string, data: any): void {
    if (this.io) {
      console.log(`[SocketService] Emitting event: ${event} to project:${projectId}`);
      this.io.to(`project:${projectId}`).emit(event, data);
    }
  }
}
