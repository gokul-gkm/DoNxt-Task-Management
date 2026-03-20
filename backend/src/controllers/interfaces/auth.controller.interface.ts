import { Request, Response } from "express"
export interface IAuthController{
    signUp(req: Request, res: Response): Promise<Response>
    verifyEmail(req: Request, res: Response): Promise<Response>
    resendVerification(req: Request, res: Response): Promise<Response>
    signIn(req: Request, res: Response): Promise<Response>
    forgotPassword(req: Request, res: Response): Promise<Response>
    resetPassword(req: Request, res: Response): Promise<Response>
    logOut(req: Request, res: Response): Promise<Response>
}