import QuizSessionSdk from "quiz-session-sdk";
import { constant } from "../constant";
import { logger } from "./logger";

class QuizSession {
  private static instance: QuizSessionSdk;

  private constructor() {}

  public static getInstance(): QuizSessionSdk {
    if (!QuizSession.instance) {
      QuizSession.instance = new QuizSessionSdk({
        baseURL: constant.quizSessionServiceEndpoint,
        apiKey: constant.apiKey,
        loggerSdk: logger,
      }); // Base URL of the quiz service
    }
    return QuizSession.instance;
  }
}

export const quizSessionSdk = QuizSession.getInstance();
