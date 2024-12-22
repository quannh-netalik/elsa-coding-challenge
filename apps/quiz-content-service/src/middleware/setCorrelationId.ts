import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const setCorrelationId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const correlationId = req.headers["correlation-id"] as string;
  logger.setCorrelationId(correlationId);

  next();
};
