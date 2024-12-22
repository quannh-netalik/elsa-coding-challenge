import { LoggerSdkInterface as LoggerSdk } from "logger-sdk";

export interface IUserConstructor {
    baseURL?: string;
    apiKey: string;
    loggerSdk: LoggerSdk;
  }
  