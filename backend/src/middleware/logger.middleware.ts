

import pinoHttp from "pino-http";
import { randomUUID } from "crypto";

export const requestLogger = pinoHttp({
  genReqId: () => randomUUID(),

  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  }
});