import { SignInDTO, SignUpDTO } from "@/dtos/auth.dto";
import { AuthResponse, SignInResponse, SignUpResponse } from "@/interfaces/auth.interface";

export interface IAuthService{
    signUp(data: SignUpDTO): Promise<SignUpResponse>;
    verifyEmail(email: string, token: string): Promise<SignInResponse>
    resendVerification(email: string): Promise<AuthResponse>;
    signIn(data: SignInDTO): Promise<SignInResponse>
}