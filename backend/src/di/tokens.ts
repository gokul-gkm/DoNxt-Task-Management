import { IProjectRepository } from "@/repositories/interfaces/project.repository.interface";
import { IUserRepository } from "@/repositories/interfaces/user.repository.interface";
import { IAuthService } from "@/services/interfaces/auth.service.interface";
import { IProjectService } from "@/services/interfaces/project.service.interface";
import { Token } from "typedi";

export const TOKENS = {
    AuthService: new Token<IAuthService>("AuthService"),
    ProjectService: new Token<IProjectService>("ProjectService"),

    UserRepository:  new Token<IUserRepository>("UserRepository"),
    ProjectRepository:  new Token<IProjectRepository>("ProjectRepository"),
  
};