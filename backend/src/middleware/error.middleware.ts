import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "@/utils/custom.error.utils";
import { ZodError } from "zod";
import { ERROR_MESSAGES } from "@/constants/messages/messages.constant";

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: false,
      message: ERROR_MESSAGES.VALIDATION_FAILED,
      errors: err.flatten(),
    });
  }

  console.error("Unhandled Error:", err);

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: ERROR_MESSAGES.SOMETHING_WENT_WRONG,
  });
};
