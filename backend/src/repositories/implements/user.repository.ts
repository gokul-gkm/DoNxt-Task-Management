import { Service } from "typedi";
import { IUserRepository } from "../interfaces/user.repository.interface";
import { IUser, User } from "@/models/user.model";
import { BaseRepository } from "./base.repository";
import { REPOSITORY_MESSAGES } from "@/constants/messages/repository.messages";

@Service()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository{
    constructor() {
        super(User)
    }
    async findByEmail(email: string): Promise<IUser | null | never>{
        try {
            return await User.findOne({email})
        } catch (error) {
          return Promise.reject(new Error(`${REPOSITORY_MESSAGES.FIND_USER_BY_EMAIL_ERROR} ${error}`));
        }
    }
     async verifyUser(email: string, is_verified: boolean): Promise<IUser | null | never> {
        try {
            return await User.findOneAndUpdate(
                { email },
                { $set: { is_verified: is_verified } }
            );
        } catch (error) {
            return Promise.reject(
                new Error(`${REPOSITORY_MESSAGES.VERIFY_USER_ERROR} ${error}`)
            );
        }
    }

      async updatePassword( email: string, password: string): Promise<IUser | null | never>{
        try {
            return await User.findOneAndUpdate({email}, {$set: {password: password}})
        } catch (error) {
            return Promise.reject(
                new Error(`${REPOSITORY_MESSAGES.UPDATE_USER_PASSWORD_ERROR} ${error}`)
            )
        }
  }
}