import { Request, Response, NextFunction } from "express";
import { constant } from "../constant";

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers["x-api-key"] as string;
  if (apiKey !== constant.apiKey) {
    res.status(403).json({ error: "[LoggerService] Forbidden" });
    return;
  }
  
  next();
};
