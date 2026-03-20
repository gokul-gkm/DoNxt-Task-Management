import Container, { Inject, Service } from "typedi";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { TOKENS } from "@/di/tokens";
import { IAuthController } from "../interfaces/auth.controller.interface";
import { IAuthService } from "@/services/interfaces/auth.service.interface";
import { setCookie } from "@/utils/cookie.utils";
import { ForgotPasswordDTO, ResetPaswordDTO } from "@/dtos/auth.dto";

@Service()
export class AuthController implements IAuthController{
    constructor(
        @Inject(TOKENS.AuthService)
        private _authService: IAuthService
    ) { }

    signUp = async (req: Request, res: Response): Promise<Response> => {
        const user = await this._authService.signUp(req.body);

        return res
        .status(StatusCodes.CREATED)
        .json({ status: true, message: "Signup successful", data: user});
    }

    verifyEmail = async (req: Request, res: Response): Promise<Response> => {
        const email = req.query.email as string;
        const token = req.query.token as string;

        if (!email || !token) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Email and token required for verification"
            })
        }
        const result = await this._authService.verifyEmail(email, token);
        return res.status(StatusCodes.OK).json({
            status: true,
            message: result.message,
            email: result.email,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
        })
    }

    resendVerification = async (req: Request, res: Response): Promise<Response> => {
        const { email } = req.body;
        if (!email) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            status: false,
            message: "Email is required",
        });
        }
        const result = await this._authService.resendVerification(email);
        return res.status(StatusCodes.OK).json(result);
    };

     signIn = async (req: Request, res: Response): Promise<Response> => {
    const result = await this._authService.signIn(req.body);
    setCookie(res, "refresh_token", String(result.refreshToken));

    return res.status(StatusCodes.OK).json({
      status: true,
      message: result.message,
      email: result.email,
      userName: result.userName,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
    };
    
    forgotPassword = async (req: Request, res: Response): Promise<Response> => {
        const data = req.body as ForgotPasswordDTO;
        if (!data.email) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            status: false,
            message: "Email is required"
        })
        }

        const result = await this._authService.forgotPassword(data)

        return res.status(StatusCodes.OK).json(result)
    }

    resetPassword = async (req: Request, res: Response): Promise<Response> => {
        const data = req.body as ResetPaswordDTO;
        if (!data.email || !data.token || !data.newPassword || !data.confirmPassword) {
        return res.status(StatusCodes.BAD_REQUEST).json({status: false, message: "Email, token and password fields are required"})
        }
        const result = await this._authService.resetPassword(data);

        return res.status(StatusCodes.OK).json(result)
    }
}

export const authController = Container.get(AuthController);
