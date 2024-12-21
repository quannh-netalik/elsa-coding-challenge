import { Request, Response } from "express";

import { QuizContent } from "../model/quiz.model";
import { constant } from "../constant";
import { logger } from "../utils/logger";

export const quizGeneration = async (req: Request, res: Response) => {
  const correlationId = req.headers["correlation-id"] as string;
  const { numberOfQuestions } = req.body;

  const count = Math.min(
    Math.max(numberOfQuestions || constant.defaultGeneratedQuestion, 1),
    constant.maxGeneratedQuestion
  );

  try {
    const quizzes = await QuizContent.aggregate([{ $sample: { size: count } }]);
    res.status(200).json(quizzes);
  } catch (err) {
    logger.error({ message: err, correlationId });
    res.status(500).json({ error: "Failed to generate quiz questions" });
  }
};
