import { Inject, Service } from "typedi";
import { IUserService } from "../interfaces/user.service.interface";
import { TOKENS } from "@/di/tokens";
import { IUserRepository } from "@/repositories/interfaces/user.repository.interface";
import { IUser } from "@/models/user.model";
import { AppError } from "@/utils/custom.error.utils";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs"
import { passwordHash } from "@/utils/password.utils";

@Service({ id: TOKENS.UserService })
export class UserService implements IUserService {
 constructor(
    @Inject(TOKENS.UserRepository)
    private _userRepository: IUserRepository,
    ) { }

    private handleError(message: string, error: unknown): never {
    console.error(message, error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      "Something went wrong. Please try again later.",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
    
    async getProfile(userId: string): Promise<{ success: boolean; user: Partial<IUser>; }> {
        
        try {
            const user = await this._userRepository.findById(userId);
            if (!user) {
                throw new AppError("User not found", StatusCodes.NOT_FOUND)
            }
            const { password, ...userWithoutPassword } = user.toObject();

            return {
                success: true,
                user: userWithoutPassword
            }
        } catch (error) {
            this.handleError("Get Profile Error : ", error)
        }
    
    }

    async updateProfile(userId: string, data: {
        firstName?: string;
        lastName?: string;
    }) {
        try {
            const user = await this._userRepository.findById(userId);
            if (!user) {
               throw new AppError("User not found", StatusCodes.NOT_FOUND);
            }
            const updated = await this._userRepository.update(userId, data);
            if (!updated) {
               throw new AppError("Failed to update profile", StatusCodes.BAD_REQUEST);
            }
            const { password, ...userWithoutPassword } = updated.toObject();

            return {
                success: true,
                message: "Profile updated successfully",
                user: userWithoutPassword
            }

        } catch (error) {
            this.handleError("Update Profile Error:",error)
        }
    }

    async changePassword(userId: string, data: {
        currentPassword: string;
        newPassword: string
    }) {
        try {
            const user = await this._userRepository.findById(userId);
             if (!user) {
        throw new AppError("User not found", StatusCodes.NOT_FOUND);
            }

            const isPasswordValid = await bcrypt.compare(data.currentPassword, user.password);
             if (!isPasswordValid) {
        throw new AppError("Current password is incorrect", StatusCodes.BAD_REQUEST);
            }
            const hashedPassword = await passwordHash(data.newPassword);
            await this._userRepository.update(userId, { password: hashedPassword });
            return {
                success: true,
                message: "Password changed successfully"
            }
            
        } catch (error) {
            this.handleError("Change password error : ",error)
            
        }
    }
}