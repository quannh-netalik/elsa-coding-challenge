import UserSdk from "user-sdk";
import { constant } from "../constant";
import { logger } from "./logger";

class User {
  private static instance: UserSdk;

  private constructor() {}

  public static getInstance(): UserSdk {
    if (!User.instance) {
      User.instance = new UserSdk({
        baseURL: constant.userServiceEndpoint,
        apiKey: constant.apiKey,
        loggerSdk: logger,
      }); // Base URL of the quiz service
    }
    return User.instance;
  }
}

export const userSdk = User.getInstance();
