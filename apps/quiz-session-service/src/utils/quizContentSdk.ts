import QuizContentSdk from "quiz-content-sdk";
import { constant } from "../constant";
import { logger } from "./logger";

class QuizSdkSingleton {
  private static instance: QuizContentSdk;

  private constructor() {}

  public static getInstance(): QuizContentSdk {
    if (!QuizSdkSingleton.instance) {
      QuizSdkSingleton.instance = new QuizContentSdk({
        baseURL: constant.quizContentServiceEndpoint,
        apiKey: constant.apiKey,
        loggerSdk: logger,
      }); // Base URL of the quiz service
    }
    return QuizSdkSingleton.instance;
  }
}

export const quizContentSdk = QuizSdkSingleton.getInstance();
