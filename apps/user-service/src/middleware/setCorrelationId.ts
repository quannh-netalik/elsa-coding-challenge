import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { authSdk } from "../utils/authSdk";

export const setCorrelationId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const correlationId = req.headers["correlation-id"] as string;
  authSdk.setCorrelationId(correlationId);
  logger.setCorrelationId(correlationId);

  next();
};
