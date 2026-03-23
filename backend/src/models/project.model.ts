import mongoose, { Document, Schema } from "mongoose";


export interface IProject extends Document {
  userId: Schema.Types.ObjectId;
  name: string;
  description: string;
  color: string;
  is_archived: boolean;
}

const projectSchema = new Schema<IProject>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },

    name: { type: String, required: true },
    description: { type: String },
    color: { type: String , default: "#6366f1" },

    is_archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>("Project", projectSchema);