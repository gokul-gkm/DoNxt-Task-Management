import * as z from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name is too long"),
  description: z
    .string()
    .trim()
    .max(2000, "Description is too long")
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex code")
    .default("#6366f1"),
});

export type ProjectSchema = z.infer<typeof projectSchema>;
