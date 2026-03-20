import { IUser } from "@/models/user.model";
import { IBaseRepository } from "./base.repository.interface";

export interface IUserRepository extends IBaseRepository<IUser>{
    findByEmail(email: string): Promise<IUser | null | never>
    verifyUser(email: string, is_verified: boolean): Promise<IUser | null | never>
    updatePassword( email: string, password: string): Promise<IUser | null | never>;
}