import Container, { Inject, Service } from "typedi";
import { IUserController } from "../interfaces/user.controller.interface";
import { TOKENS } from "@/di/tokens";
import { IUserService } from "@/services/interfaces/user.service.interface";
import { AuthRequest } from "@/interfaces/api.interface";
import { AppError } from "@/utils/custom.error.utils";
import { StatusCodes } from "http-status-codes";
import { Response } from "express";

@Service()
export class UserController implements IUserController {
  constructor(
    @Inject(TOKENS.UserService)
    private userService: IUserService,
  ) {}

  getProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
    }
    const response = await this.userService.getProfile(userId);
    return res.status(StatusCodes.OK).json(response);
  };

  updateProfile = async (
    req: AuthRequest,
    res: Response,
  ): Promise<Response> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
    }
    const response = await this.userService.updateProfile(userId, req.body);
    return res.status(StatusCodes.OK).json(response);
  };

  changePassword = async (
    req: AuthRequest,
    res: Response,
  ): Promise<Response> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
    }
    const response = await this.userService.changePassword(userId, req.body);
    return res.status(StatusCodes.OK).json(response);
  };
}

export const userController = Container.get(UserController);
