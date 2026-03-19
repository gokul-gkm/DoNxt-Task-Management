import { IUserRepository } from "@/repositories/interfaces/user.repository.interface";
import { IAuthService } from "@/services/interfaces/auth.service.interface";
import { Token } from "typedi";

export const TOKENS = {
    AuthService: new Token<IAuthService>("AuthService"),

    UserRepository:  new Token<IUserRepository>("UserRepository"),
  
};