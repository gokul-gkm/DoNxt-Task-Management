
export interface AuthResponse{
  status: boolean;
  message: string
}

export interface SignUpResponse extends AuthResponse {
  email?: string;
}

export interface SignInResponse extends SignUpResponse {
  userName?: string;
  accessToken?: string;
  refreshToken?: string;
}
