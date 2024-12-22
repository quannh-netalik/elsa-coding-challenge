export const constant = {
  port: Number(process.env.PORT) || 8060,
  apiKey: process.env.API_KEY || "",
  mongoUri: process.env.MONGO_URI || "",
  authServiceEndpoint: process.env.AUTH_SERVICE_ENDPOINT || "",
  loggerServiceEndpoint: process.env.LOGGER_SERVICE_ENDPOINT || "",
  redisUri: process.env.REDIS_URI || "",
};

export enum UserType {
  GUEST = "guest",
  INTERNAL = "internal",
}
