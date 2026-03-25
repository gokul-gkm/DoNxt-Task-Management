import { IProjectRepository } from "@/repositories/interfaces/project.repository.interface";
import { ITaskRepository } from "@/repositories/interfaces/task.repository.interface";
import { IUserRepository } from "@/repositories/interfaces/user.repository.interface";
import { IAuthService } from "@/services/interfaces/auth.service.interface";
import { IProjectService } from "@/services/interfaces/project.service.interface";
import { ITaskService } from "@/services/interfaces/task.service.interface";
import { IUserService } from "@/services/interfaces/user.service.interface";
import { ISocketService } from "@/services/interfaces/socket.service.interface";
import { Token } from "typedi";

export const TOKENS = {
    AuthService: new Token<IAuthService>("AuthService"),
    ProjectService: new Token<IProjectService>("ProjectService"),
    TaskService: new Token<ITaskService>("TaskService"),
    UserService: new Token<IUserService>("UserService"),
    SocketService: new Token<ISocketService>("SocketService"),

    UserRepository:  new Token<IUserRepository>("UserRepository"),
    ProjectRepository:  new Token<IProjectRepository>("ProjectRepository"),
    TaskRepository:  new Token<ITaskRepository>("TaskRepository"),
};