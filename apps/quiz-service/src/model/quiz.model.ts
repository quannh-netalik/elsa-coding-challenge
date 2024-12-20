import mongoose from "mongoose";

export interface IQuiz {
  question: string;
  answers: string[];
  correctAnswer: string;
}

export const quizSchema = new mongoose.Schema<IQuiz>({
  question: { type: String, required: true },
  answers: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
});

export const Quiz = mongoose.model<IQuiz>("Quiz", quizSchema);
