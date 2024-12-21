import { Request, Response, NextFunction } from "express";

export const errHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err.stack); // Log the error stack trace

  // Send error response
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
};
