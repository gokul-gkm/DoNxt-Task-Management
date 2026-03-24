import type { SigninSchemaType, SignupSchemaType } from "../../lib/validations/auth.z.validation";
import { extractErrorMessage } from "../../utils/apiError.utils";
import { publicAxiosInstance } from "../axios";


export const authService = {
  signup: async (data: SignupSchemaType) => {
    try {
      const res = await publicAxiosInstance.post("/auth/sign-up", data);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
  signin: async (data: SigninSchemaType) => {
    try {
      const res = await publicAxiosInstance.post("/auth/sign-in", data);
      return res.data
    } catch (error) {
      throw new Error(extractErrorMessage(error))
    }
  },
  verifyEmail: async (email: string, token: string) => {
    try {
      const res = await publicAxiosInstance.post(
        `/auth/verify-email?email=${email}&token=${token}`
      );
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
  resendEmailVerification: async (email: string) => {
    try {
      const res = await publicAxiosInstance.post(
        `/auth/resend-verification`, { email }
      );
      return res;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const res = await publicAxiosInstance.post("/auth/forgot-password", { email });
      return res.data
    } catch (error) {
      throw new Error(extractErrorMessage(error))
    }
  },

  resetPassword: async (email: string, token: string, newPassword: string, confirmPassword: string) => {
    try {
      const res = await publicAxiosInstance.post("/auth/reset-password", {
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
      const res = await publicAxiosInstance.post("/auth/logout");
      return res.data
    } catch (error) {
      throw new Error(extractErrorMessage(error))
    }
  }
  
 
};
