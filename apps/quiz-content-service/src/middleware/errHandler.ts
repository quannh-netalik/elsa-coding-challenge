import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const errHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const correlationId = req.headers["correlation-id"] as string;
  logger.error({
    message: err.stack,
    correlationId,
  });

  // Send error response
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
};
