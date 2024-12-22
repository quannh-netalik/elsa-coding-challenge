import AuthSdk from "auth-sdk";
import { constant } from "../constant";
import { logger } from "./logger";

class Auth {
  private static instance: AuthSdk;

  private constructor() {}

  public static getInstance(): AuthSdk {
    if (!Auth.instance) {
      Auth.instance = new AuthSdk({
        baseURL: constant.authServiceEndpoint, // Auth service base URL
        apiKey: constant.apiKey,
        loggerSdk: logger,
        redisUrl: constant.redisUri, // Redis URL
      });
    }

    return Auth.instance;
  }
}

export const authSdk = Auth.getInstance();
