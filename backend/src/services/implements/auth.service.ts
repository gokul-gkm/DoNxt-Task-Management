import { Inject, Service } from "typedi";
import bcrypt from "bcryptjs"
import { IAuthService } from "../interfaces/auth.service.interface";
import { SignInDTO, SignUpDTO } from "@/dtos/auth.dto";
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
import { sendVerificationEmail } from "@/utils/email.utils";

@Service()
export class AuthService implements IAuthService {
  constructor(
    @Inject(TOKENS.UserRepository)
    private _userRepository: IUserRepository,
  ) {}
  async signUp(data: SignUpDTO): Promise<SignUpResponse> {
    try {
      const { firstName, lastName, email, phone, password, confirmPassword } =
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
            "User already registered but not verified. Please verify your email.",
            StatusCodes.BAD_REQUEST,
          );
        }
      }

      const hashedPassword = await passwordHash(password);

      const newUser = await this._userRepository.create({
        firstName,
        lastName,
        email,
        phone,
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
        message: "Success! A verification link was sent to your inbox.",
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
          "User not found. Please register again.",
          StatusCodes.NOT_FOUND,
        );
      }
      if (existingUser && existingUser.is_verified) {
        throw new AppError(
          "Already verified email. Please login.",
          StatusCodes.BAD_REQUEST,
        );
      }

      const decodedEmail = verifyEmailToken(token);

      if (decodedEmail !== email) {
        throw new AppError(
          "Verification link is invalid or expired. Please request a new one.",
          StatusCodes.UNAUTHORIZED,
        );
      }

      await this._userRepository.verifyUser(email, true);

      const accessToken = generateAccessToken({ id: existingUser._id });
      const refreshToken = generateRefreashToken({ id: existingUser._id });

      return {
        status: true,
        message: "Email verified successfully",
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
          "No account found with this email address.",
          StatusCodes.NOT_FOUND,
        );
      }
      if (existingUser.is_verified) {
        throw new AppError(
          "This email is already verified. Please sign in.",
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
        message: "Verification email resent. Please check your inbox.",
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
        throw new AppError("Invalid Credentials", StatusCodes.BAD_REQUEST);
      }
      if (!existingUser.is_verified) {
        throw new AppError(
          "Email not verified. Please verify your email.",
          StatusCodes.UNAUTHORIZED,
        );
      }

      const comparePassword = await bcrypt.compare(
        password,
        existingUser.password,
      );
      if (!comparePassword) {
        throw new AppError("Incorrect password", StatusCodes.BAD_REQUEST);
      }
      const accessToken = generateAccessToken({ id: existingUser._id });
      const refreshToken = generateRefreashToken({ id: existingUser._id });

      return {
        status: true,
        message: "Sign in successfully completed",
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
}
