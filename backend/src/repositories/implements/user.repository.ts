import { Service } from "typedi";
import { IUserRepository } from "../interfaces/user.repository.interface";
import { IUser, User } from "@/models/user.model";
import { BaseRepository } from "./base.repository";

@Service()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository{
    constructor() {
        super(User)
    }
    async findByEmail(email: string): Promise<IUser | null | never>{
        try {
            return await User.findOne({email})
        } catch (error) {
          return Promise.reject(new Error(`Error fetching user by email ${error}`));
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
                new Error(`Error while verifiying the user ${error}`)
            );
        }
    }
}