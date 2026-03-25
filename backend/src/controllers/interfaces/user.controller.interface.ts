import { AuthRequest } from "@/interfaces/api.interface";
import { Response } from "express";

export interface IUserController {
    getProfile(req: AuthRequest, res: Response): Promise<Response>
    updateProfile(req: AuthRequest, res: Response): Promise<Response>
    changePassword(req: AuthRequest, res: Response): Promise<Response>
}