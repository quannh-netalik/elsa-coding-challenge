import { LoggerSdkInterface as LoggerSdk } from "logger-sdk";

export interface IQuizContent {
  question: string;
  answers: string[];
  correctAnswer: string;
  point: number;
  timeout: number;
}

export interface IQuizContentConstructor {
  baseURL?: string;
  apiKey: string;
  loggerSdk: LoggerSdk;
}
