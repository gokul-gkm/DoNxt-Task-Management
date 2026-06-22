import { Inject, Service } from "typedi";
import bcrypt from "bcryptjs"
import { IAuthService } from "../interfaces/auth.service.interface";
import { ForgotPasswordDTO, ResetPaswordDTO, SignInDTO, SignUpDTO } from "@/dtos/auth.dto";
import {
  AuthResponse,
  SignInResponse,
  SignUpResponse,
} from "@/interfaces/auth.interface";
import { StatusCodes } from "http-status-codes";
import { TOKENS } from "@/di/tokens";
import { IUserRepository } from "@/repositories/interfaces/user.repository.interface";
import { AppError } from "@/utils/custom.error.utils";
import { passwordHash } from "@/utils/password.utils";
import { IUser } from "@/models/user.model";
import { responseMessage } from "@/enums/responseMessage";
import {
  emailVerificationToken,
  generateAccessToken,
  generateRefreashToken,
  verifyEmailToken,
} from "@/utils/jwt.utils";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/utils/email.utils";
import { AUTH_MESSAGES } from "@/constants/messages/auth.messages";

@Service()
export class AuthService implements IAuthService {
  constructor(
    @Inject(TOKENS.UserRepository)
    private _userRepository: IUserRepository,
  ) {}
  async signUp(data: SignUpDTO): Promise<SignUpResponse> {
    try {
      const { firstName, lastName, email, password, confirmPassword } =
        data;
      if (password !== confirmPassword) {
        throw new AppError(
          responseMessage.PASSWORD_UNMATCH,
          StatusCodes.BAD_REQUEST,
        );
      }
      const existingUser = await this._userRepository.findByEmail(email);

      if (existingUser) {
        if (existingUser.is_verified) {
          throw new AppError(
            responseMessage.USER_ALREADY_EXISTS,
            StatusCodes.BAD_REQUEST,
          );
        } else {
          throw new AppError(
            AUTH_MESSAGES.USER_REGISTERED_NOT_VERIFIED,
            StatusCodes.BAD_REQUEST,
          );
        }
      }

      const hashedPassword = await passwordHash(password);

      const newUser = await this._userRepository.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      } as IUser);

      const verificationEmailToken = emailVerificationToken(email);

      await sendVerificationEmail({
        email,
        name: firstName + lastName,
        token: verificationEmailToken,
      });

      return {
        status: true,
        message: AUTH_MESSAGES.SIGNUP_SUCCESS,
        email: newUser.email,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyEmail(email: string, token: string): Promise<SignInResponse> {
    try {
      const existingUser = await this._userRepository.findByEmail(email);
      if (!existingUser) {
        throw new AppError(
          AUTH_MESSAGES.USER_NOT_FOUND_REGISTER,
          StatusCodes.NOT_FOUND,
        );
      }
      if (existingUser && existingUser.is_verified) {
        throw new AppError(
          AUTH_MESSAGES.ALREADY_VERIFIED,
          StatusCodes.BAD_REQUEST,
        );
      }

      const decodedEmail = verifyEmailToken(token);

      if (decodedEmail !== email) {
        throw new AppError(
          AUTH_MESSAGES.INVALID_VERIFICATION_LINK,
          StatusCodes.UNAUTHORIZED,
        );
      }

      await this._userRepository.verifyUser(email, true);

      const accessToken = generateAccessToken({ id: existingUser._id });
      const refreshToken = generateRefreashToken({ id: existingUser._id });

      return {
        status: true,
        message: AUTH_MESSAGES.EMAIL_VERIFIED,
        email: existingUser.email,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      console.error("Verify Email Error:", error);

      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resendVerification(email: string): Promise<AuthResponse> {
    try {
      const existingUser = await this._userRepository.findByEmail(email);
      if (!existingUser) {
        throw new AppError(
          AUTH_MESSAGES.NO_ACCOUNT_FOUND,
          StatusCodes.NOT_FOUND,
        );
      }
      if (existingUser.is_verified) {
        throw new AppError(
          AUTH_MESSAGES.EMAIL_ALREADY_VERIFIED,
          StatusCodes.BAD_REQUEST,
        );
      }

      const token = emailVerificationToken(email);
      await sendVerificationEmail({
        email,
        name: existingUser.firstName + existingUser.lastName,
        token,
      });

      return {
        status: true,
        message: AUTH_MESSAGES.VERIFICATION_RESENT,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("Resend Verification Error:", error);
      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
    }
    
    async signIn(data: SignInDTO): Promise<SignInResponse> {
    try {
      const { email, password } = data;
      const existingUser = await this._userRepository.findByEmail(email);
      if (!existingUser) {
        throw new AppError(AUTH_MESSAGES.INVALID_CREDENTIALS, StatusCodes.BAD_REQUEST);
      }
      if (!existingUser.is_verified) {
        throw new AppError(
          AUTH_MESSAGES.USER_NOT_VERIFIED,
          StatusCodes.UNAUTHORIZED,
        );
      }

      const comparePassword = await bcrypt.compare(
        password,
        existingUser.password,
      );
      if (!comparePassword) {
        throw new AppError(AUTH_MESSAGES.INCORRECT_PASSWORD, StatusCodes.BAD_REQUEST);
      }
      const accessToken = generateAccessToken({ id: existingUser._id });
      const refreshToken = generateRefreashToken({ id: existingUser._id });

      return {
        status: true,
        message: AUTH_MESSAGES.SIGNIN_SUCCESS,
        userId: existingUser._id.toString(),
        userName: existingUser.firstName + " "+ existingUser.lastName,
        email: existingUser.email,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      console.error("SignIn Error:", error);

      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
    }
    
    async forgotPassword(data: ForgotPasswordDTO): Promise<AuthResponse>{
    try {
      const { email } = data;
      const existingUser = await this._userRepository.findByEmail(email);
      if (!existingUser) {
        throw new AppError(AUTH_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND)
      }
      const resetToken = emailVerificationToken(email);

      await sendPasswordResetEmail({
        email,
        name: existingUser.firstName + existingUser.lastName,
        token: resetToken
      })

      return {
        status: true,
        message: AUTH_MESSAGES.PASSWORD_RESET_LINK_SENT
      }

    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      console.error("Forgot Password Error:", error);
      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
    }
    
    async resetPassword(data: ResetPaswordDTO): Promise<AuthResponse>{
    try {
      const { email, token, newPassword, confirmPassword } = data;
      if (newPassword !== confirmPassword) {
        throw new AppError(AUTH_MESSAGES.PASSWORD_UNMATCH, StatusCodes.BAD_REQUEST)
      }
      const existingUser = this._userRepository.findByEmail(email);
      if (!existingUser) {
        throw new AppError(AUTH_MESSAGES.USER_NOT_FOUND_REGISTER, StatusCodes.NOT_FOUND)
      }
      const decodedEmail = verifyEmailToken(token);

      if (decodedEmail !== email) {
        throw new AppError(AUTH_MESSAGES.INVALID_RESET_LINK, StatusCodes.UNAUTHORIZED)
      }

      const hashedPassword = await passwordHash(newPassword);
      await this._userRepository.updatePassword(email, hashedPassword)
      return {
        status: true,
        message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESS
      }
    } catch (error) {
        if (error instanceof AppError) {
        throw error;
      }

      console.error("Reset Password Error:", error);
      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    
    }
  }
}
