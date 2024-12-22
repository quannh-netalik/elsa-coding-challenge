import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { quizContentSdk } from "../utils/quizContentSdk";

export const setCorrelationId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const correlationId = req.headers["correlation-id"] as string;
  quizContentSdk.setCorrelationId(correlationId);
  logger.setCorrelationId(correlationId);

  next();
};
