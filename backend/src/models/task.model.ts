import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  userId: Schema.Types.ObjectId;
  projectId: Schema.Types.ObjectId;

  title: string;
  description?: string;

  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";

  dueDate?: Date;

  tags?: string[];

  is_archived: boolean;
}

const taskSchema = new Schema<ITask>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },

    title: { type: String, required: true },
    description: { type: String },

    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    dueDate: { type: Date },

    tags: [{ type: String }],

    is_archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", taskSchema);