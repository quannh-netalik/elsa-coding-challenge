import QuizContentSdk from "quiz-content-sdk";
import { constant } from "../constant";
import { logger } from "./logger";

class QuizContent {
  private static instance: QuizContentSdk;

  private constructor() {}

  public static getInstance(): QuizContentSdk {
    if (!QuizContent.instance) {
      QuizContent.instance = new QuizContentSdk({
        baseURL: constant.quizContentServiceEndpoint,
        apiKey: constant.apiKey,
        loggerSdk: logger,
      }); // Base URL of the quiz service
    }
    return QuizContent.instance;
  }
}

export const quizContentSdk = QuizContent.getInstance();
