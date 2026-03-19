import nodemailer from "nodemailer";
import { verifyEmailTemplate } from "@/templates/verfiyEmail.template";
import { env } from "@/config/env";

const { EMAIL_USER, EMAIL_PASS, CLIENT_URL } = env;
if (!EMAIL_USER || !EMAIL_PASS) {
  throw new Error("Missing required environment variables for email sending.");
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
      subject: "Verify your DoNxt email",
      html,
    });

    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send verification email");
  }
};