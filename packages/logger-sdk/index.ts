import axios from "axios";
import { LoggerSDKConfig, LogParameters, LogPayload } from "./interface";

class LoggerSDK {
  private apiKey: string;
  private serviceUrl: string;
  private source: string;

  constructor(config: LoggerSDKConfig) {
    if (!config.apiKey) {
      throw new Error("API key is required");
    }

    if (!config.serviceUrl) {
      throw new Error("Service URL is required");
    }

    if (!config.source) {
      throw new Error("Source is required");
    }

    this.apiKey = config.apiKey;
    this.serviceUrl = config.serviceUrl;
    this.source = config.source;
  }

  private async write(
    level: "info" | "warn" | "error",
    { message, correlationId }: LogParameters
  ): Promise<void> {
    if (!message || !level) {
      throw new Error("Both message and level are required");
    }

    const payload: LogPayload = {
      source: this.source,
      message,
      level,
    };

    try {
      await axios.post(`${this.serviceUrl}/log`, payload, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "correlation-id": correlationId,
        },
      });
      console.log("Log successfully sent");
    } catch (error) {
      console.error("Failed to send log:", error);
    }
  }

  async info(opts: LogParameters) {
    return this.write("info", opts);
  }

  async warn(opts: LogParameters) {
    return this.write("warn", opts);
  }

  async error(opts: LogParameters) {
    return this.write("error", opts);
  }
}

export default LoggerSDK;

export { LoggerSDKConfig, LogParameters, LogPayload };
