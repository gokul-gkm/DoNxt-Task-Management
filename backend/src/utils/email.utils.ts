import nodemailer from "nodemailer";
import { verifyEmailTemplate } from "@/templates/verfiyEmail.template";
import { env } from "@/config/env";
import { resetPasswordTemplate } from "@/templates/resetPassword.template";
import { EMAIL_MESSAGES } from "@/constants/messages/email.messages";

const { EMAIL_USER, EMAIL_PASS, CLIENT_URL } = env;
if (!EMAIL_USER || !EMAIL_PASS) {
  throw new Error(EMAIL_MESSAGES.MISSING_EMAIL_CONFIG);
}

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

interface EmailOptions {
  email: string;
  name: string;
  token: string;
}


export const sendVerificationEmail = async ({
  email,
  name,
  token,
}: EmailOptions): Promise<void> => {
  const link = `${CLIENT_URL}/auth/verify-email?email=${email}&token=${token}`;

  const html = verifyEmailTemplate(name, link);

  try {
    await transporter.sendMail({
      from: `"DoNxt" <${EMAIL_USER}>`,
      to: email,
      subject: EMAIL_MESSAGES.VERIFY_EMAIL_SUBJECT,
      html,
    });

    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error(EMAIL_MESSAGES.VERIFICATION_EMAIL_SEND_FAILED);
  }
};

export const sendPasswordResetEmail = async ({
  email,
  name,
  token,
}: EmailOptions): Promise<void> => {
  const link = `${CLIENT_URL}/auth/reset-password?email=${email}&token=${token}`;

  const html = resetPasswordTemplate(name, link);

  try {
    await transporter.sendMail({
      from: `"DoNxt" <${EMAIL_USER}>`,
      to: email,
      subject: EMAIL_MESSAGES.RESET_PASSWORD_SUBJECT,
      html,
    });

    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error("Password reset email sending error:", error);
    throw new Error(EMAIL_MESSAGES.PASSWORD_RESET_EMAIL_SEND_FAILED);
  }
};