import axios, { AxiosInstance } from "axios";
import { LoggerSdkInterface as LoggerSdk } from "logger-sdk";

import { IUserConstructor } from "./interface";

class UserServiceSdk {
  private client: AxiosInstance;
  private correlationId: string = "NA";
  private baseUrl: string = "http://localhost:8060";
  private apiKey: string;
  private loggerSdk: LoggerSdk;

  constructor({ baseURL, apiKey, loggerSdk }: IUserConstructor) {
    if (baseURL) {
      this.baseUrl = baseURL;
    }
    this.loggerSdk = loggerSdk;
    this.apiKey = apiKey;
    this.client = this.setClient();
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
    this.loggerSdk.setCorrelationId(this.correlationId);
  }

  /**
   * Sign up a new user
   * @param {Object} userData - Data for the new user
   * @param {string} userData.firstName - First name of the user
   * @param {string} userData.lastName - Last name of the user
   * @param {string} userData.username - Username of the user
   * @param {string} userData.password - Password for the user
   * @param {string} userData.type - Type of the user ('internal' or 'guest')
   * @returns {Promise<Object>} Response containing user details and token
   */
  async signup(userData: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    type: "internal" | "guest";
  }): Promise<Object> {
    try {
      const response = await this.client.post("/signup", userData);
      this.loggerSdk.info(`User signed up successfully: ${userData.username}`);
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  /**
   * Login a user
   * @param {Object} loginData - Data for login
   * @param {string} loginData.username - Username of the user
   * @param {string} loginData.password - Password for the user
   * @param {string} loginData.type - Type of the user ('internal' or 'guest')
   * @returns {Promise<Object>} Response containing user details and token
   */
  async login(loginData: {
    username: string;
    password: string;
    type: "internal" | "guest";
  }): Promise<Object> {
    try {
      const response = await this.client.post("/login", loginData);
      this.loggerSdk.info(`User logged in successfully: ${loginData.username}`);
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  /**
   * Get user information
   * @param {string} token - Authorization token
   * @returns {Promise<Object>} Response containing user information
   */
  async getUserInfo(token: string): Promise<Object> {
    try {
      const response = await this.client.get("/user-info", {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.loggerSdk.info(`User info retrieved successfully for token.`);
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  /**
   * Logout a user
   * @param {string} token - Authorization token
   * @returns {Promise<Object>} Response containing logout confirmation
   */
  async logout(token: string): Promise<Object> {
    try {
      const response = await this.client.post("/logout", { token });
      this.loggerSdk.info(`User logged out successfully.`);
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  private handleError(error: any): string {
    this.loggerSdk.error(`[UserSdk] Error occurred: ${error.message}`);

    if (error.response) {
      // Server responded with a status other than 2xx
      return `[UserSdk] Error: ${error.response.status} - ${
        error.response.data.error || error.response.statusText
      }`;
    } else if (error.request) {
      // Request was made but no response received
      return "[UserSdk] Error: No response received from the server";
    } else {
      // Other errors
      return `[UserSdk] Error: ${error.message}`;
    }
  }
}

export default UserServiceSdk;
