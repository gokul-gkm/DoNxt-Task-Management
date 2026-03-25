import { extractErrorMessage } from "../../utils/apiError.utils";
import { userAxiosInstance } from "../axios";

export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  is_verified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UserResponse {
  success: boolean;
  user?: UserProfile;
  message?: string;
}


export const userService = {
    getProfile: async ():  Promise<UserResponse> => {
        try {
            const res = await userAxiosInstance.get('/users/profile');
            return res.data;
        } catch (error) {
            throw new Error(extractErrorMessage(error))
        }
    },

    updateProfile: async (data: UpdateProfileData): Promise<UserResponse> => {
        try {
            const res = await userAxiosInstance.patch('/users/profile', data)
            return res.data
        } catch (error) {
            throw new Error(extractErrorMessage(error))
        }
    },

    changePassword: async (data: ChangePasswordData): Promise<UserResponse> => {
        try {
            const res = await userAxiosInstance.patch('/users/password', data);
            return res.data
        } catch (error) {
            throw new Error(extractErrorMessage(error))
        }
    }

}