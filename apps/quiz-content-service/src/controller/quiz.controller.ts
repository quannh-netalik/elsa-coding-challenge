import { Request, Response } from "express";

import { QuizContent } from "../model/quiz.model";
import { constant } from "../constant";
import { logger } from "../utils/logger";

export const quizGeneration = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { numberOfQuestions } = req.body;

  const count = Math.min(
    Math.max(numberOfQuestions || constant.defaultGeneratedQuestion, 1),
    constant.maxGeneratedQuestion
  );

  try {
    const quizzes = await QuizContent.aggregate([{ $sample: { size: count } }]);
    logger.info({
      msg: "[QuizContentService] Get quizzes successfully",
      data: quizzes,
    });
    return res.status(200).json(quizzes);
  } catch (err) {
    logger.error(err);
    return res.status(500).json({
      error: "[QuizContentService] Failed to generate quiz questions",
    });
  }
};
