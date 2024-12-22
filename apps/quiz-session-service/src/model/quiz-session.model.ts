import mongoose from "mongoose";
import { IQuizContent } from "quiz-content-sdk";

import { QuizSessionStatus } from "../constant";

export interface IQuizSessionSchema {
  sessionId: string;
  userIds: string[];
  numberOfQuestions: number;
  questions: IQuizContent[];
  status: QuizSessionStatus;
}

// QuizSession Schema
export const quizSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  userIds: { type: [String], default: [] },
  numberOfQuestions: { type: Number, required: true },
  questions: { type: Array, default: [] },
  status: {
    type: String,
    enum: QuizSessionStatus,
    default: QuizSessionStatus.Draft,
  },
});

export const QuizSession = mongoose.model("QuizSession", quizSessionSchema);
