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

export interface LogParameters {
  message: any;
  correlationId: string;
}
