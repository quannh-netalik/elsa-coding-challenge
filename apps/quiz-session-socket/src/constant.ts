export const constant = {
  port: Number(process.env.PORT) || 8040,
  apiKey: process.env.API_KEY || "",
  mongoUri: process.env.MONGO_URI || "",
  userServiceEndpoint: process.env.USER_SERVICE_ENDPOINT || "",
  quizSessionServiceEndpoint: process.env.QUIZ_SESSION_SERVICE_ENDPOINT || "",
  loggerServiceEndpoint: process.env.LOGGER_SERVICE_ENDPOINT || "",
  redisUri: process.env.REDIS_URI || "",
  defaultNumberOfQuestions: 5,
};

export enum ESocketEvent {
  SIGN_UP = "sign-up",
  LOGIN = "login",
  LOGIN_SUCCESS = "login-success",
  CREATE_QUIZ_SESSION = "create-quiz-session",
  JOIN_QUIZ_SESSION = "join-quiz-session",
  USER_JOINED = 'user-joined',
}
