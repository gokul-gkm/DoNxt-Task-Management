import type { SigninSchemaType, SignupSchemaType } from "../../lib/validations/auth.z.validation";
import { extractErrorMessage } from "../../utils/apiError.utils";
import { publicAxiosInstance } from "../axios";
import { AUTH_ROUTES } from "../../constants/routes.constants";


export const authService = {
  signup: async (data: SignupSchemaType) => {
    try {
      const res = await publicAxiosInstance.post(AUTH_ROUTES.SIGN_UP, data);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
  signin: async (data: SigninSchemaType) => {
    try {
      const res = await publicAxiosInstance.post(AUTH_ROUTES.SIGN_IN, data);
      return res.data
    } catch (error) {
      throw new Error(extractErrorMessage(error))
    }
  },
  verifyEmail: async (email: string, token: string) => {
    try {
      const res = await publicAxiosInstance.post(
        `${AUTH_ROUTES.VERIFY_EMAIL}?email=${email}&token=${token}`
      );
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
  resendEmailVerification: async (email: string) => {
    try {
      const res = await publicAxiosInstance.post(
        AUTH_ROUTES.RESEND_VERIFICATION, { email }
      );
      return res;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const res = await publicAxiosInstance.post(AUTH_ROUTES.FORGOT_PASSWORD, { email });
      return res.data
    } catch (error) {
      throw new Error(extractErrorMessage(error))
    }
  },

  resetPassword: async (email: string, token: string, newPassword: string, confirmPassword: string) => {
    try {
      const res = await publicAxiosInstance.post(AUTH_ROUTES.RESET_PASSWORD, {
        email,
        token,
        newPassword,
        confirmPassword
      });
      return res.data
    } catch (error) {
      throw new Error(extractErrorMessage(error))
    }
  },
   
  logOut: async () => {
    try {
      const res = await publicAxiosInstance.post(AUTH_ROUTES.LOGOUT);
      return res.data
    } catch (error) {
      throw new Error(extractErrorMessage(error))
    }
  }
  
 
};
