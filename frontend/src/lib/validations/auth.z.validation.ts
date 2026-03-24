import { z } from "zod";

export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(40, "Name must not exceed 40 characters")
      .regex(
        /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/,
        "Name can contain letters, numbers, and single spaces only",
      )
      .refine((value) => (value.match(/[a-zA-Z]/g)?.length ?? 0) >= 3, {
        message: "Name must contain at least 3 letters",
      }),
    lastName: z.string()
      .trim()
      .min(1, "Last name is required")
      .max(40, "Last name must not exceed 40 characters")
      .regex(
        /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/,
        "Last name can contain letters, numbers, and single spaces only",
      ),
    email: z
      .string()
      .trim()
      .min(5, "Email is too short")
      .email("Invalid email format")
      .regex(
        /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email must have at least 3 characters before @",
      ),

    password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&#^]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password must match the password"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match",
        code: "custom",
      });
    }
  });

export type SignupSchemaType = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
   email: z
      .string()
      .trim()
      .min(5, "Email is too short")
      .email("Invalid email format")
      .regex(
        /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email must have at least 3 characters before @",
      ),
  password: z.string().trim().min(8, "Password must be at least 8 characters"),
});

export type SigninSchemaType = z.infer<typeof signInSchema>;



export const forgotSchema = z.object({
  email: z .string()
      .trim()
      .min(5, "Email is too short")
      .email("Invalid email format")
      .regex(
        /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email must have at least 3 characters before @",
      ),
});

export type ForgotSchemaType = z.infer<typeof forgotSchema>;

export const resetSchema = z
  .object({
    newPassword: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&#^]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z
      .string()
      .trim()
      .min(8, "Confirm Password must match the password"),
  })
 .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match",
        code: "custom",
      });
    }
  });

export type ResetSchemaType = z.infer<typeof resetSchema>;

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(40, "Name must not exceed 40 characters")
    .regex(
      /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/,
      "Name can contain letters, numbers, and single spaces only",
    )
    .refine((value) => (value.match(/[a-zA-Z]/g)?.length ?? 0) >= 3, {
      message: "Name must contain at least 3 letters",
    })
    .optional(),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(40, "Last name must not exceed 40 characters")
    .regex(
      /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/,
      "Last name can contain letters, numbers, and single spaces only",
    )
    .optional(),
  email: z
    .string()
    .trim()
    .min(5, "Email is too short")
    .email("Invalid email format")
    .regex(
      /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email must have at least 3 characters before @",
    )
    .optional(),
    
});

export type UpdateProfileSchemaType = z.infer<typeof updateProfileSchema>;


export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .trim()
      .min(1, "Current password is required"),
    newPassword: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&#^]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z
      .string()
      .trim()
      .min(1, "Please confirm your new password"),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match",
        code: "custom",
      });
    }
    if (data.currentPassword === data.newPassword) {
      ctx.addIssue({
        path: ["newPassword"],
        message: "New password must be different from the current password",
        code: "custom",
      });
    }
  });

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;
