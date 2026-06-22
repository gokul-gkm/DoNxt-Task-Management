import { StatusCodes } from "http-status-codes"
import bcrypt from "bcryptjs"
import { AppError } from "./custom.error.utils";
import { AUTH_MESSAGES } from "@/constants/messages/auth.messages";

export const passwordHash = async (password: string): Promise<string> => {
    try {
        if (!password) {
            throw new AppError(AUTH_MESSAGES.PASSWORD_NOT_PROVIDED, StatusCodes.BAD_REQUEST);
        }
        return await bcrypt.hash(password, 10);
    } catch (error) {
        throw new AppError(AUTH_MESSAGES.PASSWORD_HASH_FAILED, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}