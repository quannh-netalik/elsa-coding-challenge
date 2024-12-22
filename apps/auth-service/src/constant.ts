export const constant = {
  port: Number(process.env.PORT) || 8070,
  apiKey: process.env.API_KEY || "",
  mongoUri: process.env.MONGO_URI || "",
  loggerServiceEndpoint: process.env.LOGGER_SERVICE_ENDPOINT || "",
  redisUri: process.env.REDIS_URI || "",
  secretKey: process.env.SECRET_KEY || "",
  expirationDuration: 60 * 60 * 1000, // 1 hour
};

export enum UserType {
  GUEST = "guest",
  INTERNAL = "internal",
}

export enum TokenStatus {
  EXPIRED = "expired",
  ACTIVE = "active",
}
