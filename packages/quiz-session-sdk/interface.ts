import { LoggerSdkInterface as LoggerSdk } from "logger-sdk";
import { IQuizContent } from "quiz-content-sdk";

export enum QuizSessionStatus {
  Draft = "Draft",
  Active = "Active",
}

export interface IQuizSession {
  sessionId: string;
  userIds: string[];
  numberOfQuestions: number;
  questions: IQuizContent[];
  status: QuizSessionStatus;
}

export interface IQuizSessionConstructor {
  baseURL?: string;
  apiKey: string;
  loggerSdk: LoggerSdk;
}
