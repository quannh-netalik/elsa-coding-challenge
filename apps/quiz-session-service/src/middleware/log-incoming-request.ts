import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const logIncomingRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const originalSend = res.send;
  res.send = function (body: any) {
    logger.info({ type: "res", data: body });
    return originalSend.call(this, body);
  };

  next();
};
