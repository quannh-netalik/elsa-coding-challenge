import axios, { AxiosInstance } from "axios";
import { LoggerSdkInterface as LoggerSdk } from "logger-sdk";
import {
  QuizSessionStatus,
  IQuizSession,
  IQuizSessionConstructor,
} from "./interface";

class QuizSessionSdk {
  private client: AxiosInstance;
  private correlationId: string = "NA";
  private baseUrl: string = "http://localhost:8050";
  private apiKey: string;
  private loggerSdk: LoggerSdk;

  constructor({ baseURL, apiKey, loggerSdk }: IQuizSessionConstructor) {
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
   * Start a new quiz session
   * @param {Object} sessionData - Data for the new session
   * @param {string[]} sessionData.userIds - List of user IDs
   * @param {number} sessionData.numberOfQuestions - Number of questions
   * @returns {Promise<Object>} Response containing session details
   */
  async startSession(sessionData: {
    userIds: string[];
    numberOfQuestions: number;
  }): Promise<IQuizSession> {
    try {
      const response = await this.client.post<IQuizSession>(
        "/start-session",
        sessionData
      );
      this.loggerSdk.info({
        message: "[QuizSessionSdk] startSession successful",
        session: response.data,
      });
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  /**
   * Join an existing quiz session
   * @param {string} sessionId - The ID of the session
   * @param {string} userId - The user ID to join the session
   * @returns {Promise<IQuizSession>} Response containing updated session details
   */
  async joinSession(sessionId: string, userId: string): Promise<IQuizSession> {
    try {
      const response = await this.client.post<IQuizSession>(
        `/join-session/${sessionId}`,
        {
          userId,
        }
      );
      this.loggerSdk.info({
        message: "[QuizSessionSdk] joinSession successful",
        session: response.data,
      });
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  /**
   * Activate a quiz session
   * @param {string} sessionId - The ID of the session
   * @returns {Promise<IQuizSession>} Response containing session details
   */
  async activateSession(sessionId: string): Promise<Object> {
    try {
      const response = await this.client.post(`/activate-session/${sessionId}`);
      this.loggerSdk.info({
        message: "[QuizSessionSdk] activateSession successful",
        session: response.data,
      });
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  /**
   * Get the status of a quiz session
   * @param {string} sessionId - The ID of the session
   * @returns {Promise<Object>} Response containing the session status
   */
  async getSessionStatus(sessionId: string): Promise<IQuizSession> {
    try {
      const response = await this.client.get(`/session-status/${sessionId}`);
      this.loggerSdk.info({
        message: "[QuizSessionSdk] getSessionStatus successful",
        session: response.data,
      });
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  /**
   * Handle errors from Axios requests
   * @param {Error} error - Axios error object
   */
  private handleError(error: any): string {
    this.loggerSdk.error({ message: "[QuizSessionSdk] Error in sdk", error });

    if (error.response) {
      // Server responded with a status other than 2xx
      return `[QuizSessionSdk] Error: ${error.response.status} - ${
        error.response.data.error || error.response.statusText
      }`;
    } else if (error.request) {
      // Request was made but no response received
      return "[QuizSessionSdk] Error: No response received from the server";
    } else {
      // Other errors
      return `[QuizSessionSdk] Error: ${error.message}`;
    }
  }
}

export { QuizSessionStatus, IQuizSession, IQuizSessionConstructor };

export default QuizSessionSdk;
