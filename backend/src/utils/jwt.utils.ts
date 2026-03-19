import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { env } from "@/config/env";

dotenv.config();

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, { expiresIn: "24h" });
};

export const generateRefreashToken = (payload: object) => {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const emailVerificationToken = (email: string) => {
    return jwt.sign({email}, env.VERIFY_EMAIL_SECRET, {"expiresIn": "1d"})
}

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

export const verifyEmailToken = (token: string): string => {
  try {
    const decoded = jwt.verify(token,env.VERIFY_EMAIL_SECRET!) as {
      email: string;
    };
    return decoded.email;
  } catch (error) {
    throw new Error("Invalid or expired verification token");
  }
};
