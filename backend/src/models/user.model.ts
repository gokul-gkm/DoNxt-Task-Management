import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  is_verified: boolean;
}

export const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    is_verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);