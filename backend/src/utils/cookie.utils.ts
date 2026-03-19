import { Response } from "express";
import { env } from "@/config/env";


export const setCookie = (res: Response, type: string, token: string) => {
  const isProduction = env.NODE_ENV === "production";

  res.cookie(type, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
};
