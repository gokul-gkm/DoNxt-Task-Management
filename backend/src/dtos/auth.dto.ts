export interface SignUpDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface SignInDTO{
    email: string,
    password: string
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPaswordDTO{
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}