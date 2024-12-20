import { Request, Response } from "express";

import { Quiz } from "../model/quiz.model";
import { constant } from "../constant";

export const quizGeneration = async (req: Request, res: Response) => {
  const { numberOfQuestions } = req.body;

  const count = Math.min(
    Math.max(numberOfQuestions || constant.defaultGeneratedQuestion, 1),
    constant.maxGeneratedQuestion
  );

  try {
    const quizzes = await Quiz.aggregate([{ $sample: { size: count } }]);
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate quiz questions" });
  }
};
