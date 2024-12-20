import mongoose from "mongoose";

export interface IQuiz {
  question: string;
  answers: string[];
  correctAnswer: string;
  point: number;
  timeout: number;
}

export const quizSchema = new mongoose.Schema<IQuiz>({
  question: { type: String, required: true },
  answers: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  point: { type: Number, required: true },
  timeout: { type: Number, required: true },
});

export const Quiz = mongoose.model<IQuiz>("Quiz", quizSchema);
