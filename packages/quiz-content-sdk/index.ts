import axios, { AxiosInstance } from "axios";
import { IQuizContent, IQuizContentConstructor } from "./interface";
import { LoggerSdkInterface as LoggerSdk } from "logger-sdk";

class QuizContentSdk {
  private client: AxiosInstance;
  private correlationId: string = "NA";
  private baseUrl: string = "http://localhost:8080";
  private apiKey: string;
  private loggerSdk: LoggerSdk;

  constructor({ baseURL, apiKey, loggerSdk }: IQuizContentConstructor) {
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
   * Create a new quiz
   * @param {IQuizContent} quizData - Quiz details
   * @returns {Promise<IQuizContent[]>} Response containing the created quiz
   */
  async getListQuizzes(numberOfQuestions: number): Promise<IQuizContent[]> {
    try {
      const response = await this.client.post<IQuizContent[]>(
        "/quiz-generation",
        {
          numberOfQuestions,
        }
      );

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
    if (error.response) {
      // Server responded with a status other than 2xx
      return `[QuizContentSdk] Error: ${error.response.status} - ${
        error.response.data.error || error.response.statusText
      }`;
    } else if (error.request) {
      // Request was made but no response received
      return "[QuizContentSdk] Error: No response received from the server";
    } else {
      // Other errors
      return `[QuizContentSdk] Error: ${error.message}`;
    }
  }
}

export { IQuizContent };

export default QuizContentSdk;
