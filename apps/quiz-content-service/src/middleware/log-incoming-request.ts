import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const logIncomingRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const correlationId = req.headers["correlation-id"] as string;
  logger.info({ message: { type: "req" }, correlationId });

  const originalSend = res.send;

  res.send = function (body: any) {
    logger.info({
      message: {
        type: "res",
        data: body,
      },
      correlationId,
    });
    return originalSend.call(this, body);
  };

  next();
};
