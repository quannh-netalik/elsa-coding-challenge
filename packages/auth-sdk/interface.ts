import { LoggerSdkInterface } from "logger-sdk";

export type UserType = "guest" | "internal";

export type GenerateTokenParams = {
  username: string;
  firstName?: string;
  lastName?: string;
  type: UserType;
};

export type Payload = {
  username: string;
  type: UserType;
};

export interface AuthConstructor {
  baseURL: string;
  apiKey: string;
  loggerSdk: LoggerSdkInterface;
  redisUrl: string;
}
