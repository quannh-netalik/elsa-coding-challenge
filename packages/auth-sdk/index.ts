import axios, { AxiosInstance } from "axios";
import { RedisClientType, createClient } from "redis";
import { LoggerSdkInterface as LoggerSdk } from "logger-sdk";

import { AuthConstructor, GenerateTokenParams, Payload } from "./interface";

class AuthSdk {
  private client: AxiosInstance;
  private baseUrl: string;
  private apiKey: string;
  private loggerSdk: LoggerSdk;
  private redisClient: RedisClientType;
  private correlationId: string = "NA";
  private redisTTL: number = 3600;

  constructor({ baseURL, apiKey, loggerSdk, redisUrl }: AuthConstructor) {
    this.baseUrl = baseURL;
    this.apiKey = apiKey;
    this.client = this.setClient();
    this.loggerSdk = loggerSdk;
    this.redisClient = createClient({ url: redisUrl });

    this.redisClient
      .connect()
      .then(() => {
        this.loggerSdk.info(`[AuthSdk] Redis Connected successful`);
      })
      .catch((err) => {
        this.loggerSdk.error(
          `[AuthSdk] Failed to connect to Redis: ${err.message}`
        );
      });
  }

  private setClient(): AxiosInstance {
    return axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "correlation-id": this.correlationId,
      },
    });
  }

  setCorrelationId(correlationId: string): void {
    this.correlationId = correlationId;
    this.client = this.setClient();
    if (this.loggerSdk) {
      this.loggerSdk.setCorrelationId(this.correlationId);
    }
  }

  /**
   * Generate token for a user
   * @param params - The parameters for generating a token
   * @returns The JWT token
   */
  async generateToken(params: GenerateTokenParams): Promise<string> {
    try {
      const cachedToken = await this.redisClient.get(
        `auth-sdk:${params.username}:${params.type}`
      );
      if (cachedToken) {
        this.loggerSdk.info(
          `[AuthSdk] Retrieved token from Redis for username: ${params.username}`
        );
        return cachedToken;
      }

      const response = await this.client.post<{ token: string }>(
        "/generate-token",
        params
      );

      const token = response.data.token;
      // Set token
      await this.redisClient.setEx(
        `auth-sdk:${params.username}:${params.type}`,
        this.redisTTL, // 1 hour TTL
        token
      );

      // Set payload
      await this.redisClient.setEx(
        `auth-sdk:payload:${token}`,
        this.redisTTL, // 1 hour TTL
        JSON.stringify(params)
      );

      this.loggerSdk.info(
        `[AuthSdk] Generated and cached token for username: ${params.username}, type: ${params.type}`
      );

      return token;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  /**
   * Verify a token
   * @param token - The token to verify
   * @returns The decoded payload of the token
   */
  async verifyToken(token: string): Promise<Payload> {
    try {
      const cachedInfo = await this.redisClient.get(
        `auth-sdk:payload:${token}`
      );
      if (cachedInfo) {
        const payload = JSON.parse(cachedInfo) as Payload;
        this.loggerSdk.info(
          `[AuthSdk] Retrieved token from Redis for username: ${payload.username}`
        );
        return payload;
      }

      const response = await this.client.post<{ payload: Payload }>(
        "/verify-token",
        { token }
      );

      const payload = response.data.payload;
      this.loggerSdk.info(
        `[AuthSdk] Verified and cached payload for token: ${token}`
      );

      await this.redisClient.setEx(
        `auth-sdk:payload:${token}`,
        this.redisTTL, // 1 hour TTL
        JSON.stringify(payload)
      );

      return payload;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  /**
   * Logout and blacklist a token
   * @param token - The token to blacklist
   * @returns A success message
   */
  async logout(token: string): Promise<string> {
    try {
      const response = await this.client.post<{
        session: { username: string; type: string };
      }>("/logout", {
        token,
      });

      const session = response.data.session;
      await this.redisClient.del(
        `auth-sdk:${session.username}:${session.type}`
      );
      await this.redisClient.del(`auth-sdk:payload:${token}`);

      this.loggerSdk.info(`[AuthSdk] Logged out and removed token from Redis.`);

      return "successful";
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  /**
   * Handle errors from Axios requests
   * @param error - Axios error object
   */
  private handleError(error: any): string {
    if (this.loggerSdk) {
      this.loggerSdk.error(`[AuthSdk] Error occurred: ${error.message}`);
    }

    if (error.response) {
      // Server responded with a status other than 2xx
      return `[AuthSdk] Error: ${error.response.status} - ${
        error.response.data.error || error.response.statusText
      }`;
    } else if (error.request) {
      // Request was made but no response received
      return "[AuthSdk] Error: No response received from the server";
    } else {
      // Other errors
      return `[AuthSdk] Error: ${error.message}`;
    }
  }
}

export default AuthSdk;
