import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const errHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(err.stack);

  // Send error response
  res.status(err.status || 500).json({
    error: {
      message: `[QuizSessionService] ${err.message || "Internal Server Error"}`,
    },
  });
};
