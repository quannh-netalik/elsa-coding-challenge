import axios from "axios";
import { LoggerSDKConfig, LogPayload, LoggerSdkInterface } from "./interface";

class LoggerSDK {
  private apiKey: string;
  private serviceUrl: string;
  private source: string;
  private maxRetries = 5;
  private correlationId: string = "NA";

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

  setCorrelationId(correlationId: string): void {
    this.correlationId = correlationId;
  }

  private async write(
    level: "info" | "warn" | "error",
    message: any
  ): Promise<void> {
    if (!message || !level) {
      throw new Error("[LoggerSdk Both message and level are required");
    }

    const payload: LogPayload = {
      source: this.source,
      message,
      level,
    };

    let attempt = 0;
    while (attempt < this.maxRetries) {
      try {
        await axios.post(`${this.serviceUrl}/log`, payload, {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": this.apiKey,
            "correlation-id": this.correlationId,
          },
        });
        console.log("[LoggerSdk] Log successfully sent");
        return;
      } catch (error: unknown) {
        attempt++;
        console.error(
          `[LoggerSdk] Attempt ${attempt} failed:`,
          (error as any).message || error
        );

        if (attempt >= this.maxRetries) {
          console.error(
            `[LoggerSdk] Maximum retries reached. Log could not be sent.`
          );
          break;
        }

        // Calculate exponential backoff delay (e.g., 100ms, 200ms, 400ms, etc.)
        const delay = Math.pow(2, attempt) * 100; // Exponential backoff in milliseconds
        await this.sleep(delay);
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async info(message: any) {
    console.log(message);
    return this.write("info", message);
  }

  async warn(message: any) {
    console.log(message);
    return this.write("warn", message);
  }

  async error(message: any) {
    console.error(message);
    return this.write("error", message);
  }
}

export default LoggerSDK;

export { LoggerSDKConfig, LogPayload, LoggerSdkInterface };
