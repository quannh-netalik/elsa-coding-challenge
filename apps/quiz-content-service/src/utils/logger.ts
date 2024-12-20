import LoggerSDK, { LoggerSDKConfig } from "logger-sdk";
import { name } from "../../package.json";
import { constant } from "../constant";

class Logger {
  private static instance: LoggerSDK;

  private constructor() {}

  public static getInstance(): LoggerSDK {
    if (!Logger.instance) {
      const loggerConfig: LoggerSDKConfig = {
        source: name,
        apiKey: constant.apiKey,
        serviceUrl: constant.loggerServiceEndpoint,
      };

      Logger.instance = new LoggerSDK(loggerConfig);
    }

    return Logger.instance;
  }
}

export const logger = Logger.getInstance();
