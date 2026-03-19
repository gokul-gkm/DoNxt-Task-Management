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