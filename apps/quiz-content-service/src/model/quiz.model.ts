import mongoose from "mongoose";

export interface IQuizContent {
  question: string;
  answers: string[];
  correctAnswer: string;
  point: number;
  timeout: number;
}

export const quizContentSchema = new mongoose.Schema<IQuizContent>({
  question: { type: String, required: true },
  answers: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  point: { type: Number, required: true },
  timeout: { type: Number, required: true },
});

export const QuizContent = mongoose.model<IQuizContent>("QuizContent", quizContentSchema);
