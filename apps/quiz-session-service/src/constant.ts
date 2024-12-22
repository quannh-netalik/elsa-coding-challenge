export const constant = {
  port: Number(process.env.PORT) || 8050,
  apiKey: process.env.API_KEY || "",
  mongoUri: process.env.MONGO_URI || "",
  quizContentServiceEndpoint: process.env.QUIZ_CONTENT_SERVICE_ENDPOINT || "",
  authServiceEndpoint: process.env.AUTH_SERVICE_ENDPOINT || "",
  loggerServiceEndpoint: process.env.LOGGER_SERVICE_ENDPOINT || "",
  redisUri: process.env.REDIS_URI || "",
};

export enum QuizSessionStatus {
  Draft = "Draft",
  Active = "Active",
}
