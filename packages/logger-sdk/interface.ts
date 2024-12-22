export interface LoggerSDKConfig {
  apiKey: string;
  serviceUrl: string;
  source: string;
}

export interface LogPayload {
  source: string;
  message: any;
  level: string;
}

export interface LoggerSdkInterface {
  setCorrelationId(correlationId: string): void;
  info(message: any): void;
  warn(message: any): void;
  error(message: any): void;
}
