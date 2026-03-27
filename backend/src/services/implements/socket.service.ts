import { Service } from "typedi";
import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { ISocketService } from "../interfaces/socket.service.interface";
import { env } from "@/config/env";
import jwt from "jsonwebtoken";

@Service()
export class SocketService implements ISocketService {
  private io: Server | null = null;

  initialize(server: HttpServer): void {
    this.io = new Server(server, {
      cors: {
        origin: env.CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true,
      },
      // transports: ["websocket", "polling"],
      pingTimeout: 20000,
      pingInterval: 25000,
    });

    this.io.use((socket, next) => {
      try {
        const token = socket.handshake.auth.token;

        if (!token) return next(new Error("Unauthorized"));

        const decoded: any = jwt.verify(token, env.ACCESS_TOKEN_SECRET);

        socket.data.userId = decoded.id;

        next();
      } catch (err) {
        next(new Error("Unauthorized"));
      }
    });

    this.io.on("connection", (socket: Socket) => {
      const userId = socket.data.userId;

      if (!userId) {
        socket.disconnect();
        return;
      }

      console.log(`[Socket] User connected: ${userId} (${socket.id})`);

      socket.join(`user:${userId}`);

      socket.on("join-project", (projectId: string) => {
        socket.join(`project:${projectId}`);
        console.log(`[Socket] ${socket.id} joined project:${projectId}`);
      });

      socket.on("leave-project", (projectId: string) => {
        socket.leave(`project:${projectId}`);
        console.log(`[Socket] ${socket.id} left project:${projectId}`);
      });

      socket.on("disconnect", (reason) => {
        console.log(`[Socket] User disconnected: ${userId} (${reason})`);
      });
    });

    console.log("✅ Socket.io initialized");
  }

  emitToUser(userId: string, event: string, data: any): void {
    this.io?.to(`user:${userId}`).emit(event, data);
  }

  emitToProject(projectId: string, event: string, data: any): void {
    this.io?.to(`project:${projectId}`).emit(event, data);
  }
}