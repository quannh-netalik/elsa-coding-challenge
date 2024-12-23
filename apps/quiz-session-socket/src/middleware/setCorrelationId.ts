import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { quizSessionSdk } from "../utils/quizSessionSdk";
import { userSdk } from "../utils/userSdk";

export const setCorrelationId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Self correlationId or received from client
  // Ex: correlationId = uuidV4();
  const correlationId = req.headers["correlation-id"] as string;
  userSdk.setCorrelationId(correlationId);
  quizSessionSdk.setCorrelationId(correlationId);
  logger.setCorrelationId(correlationId);

  next();
};
