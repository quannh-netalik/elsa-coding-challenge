export const constant = {
  port: Number(process.env.LOGGER_SERVICE_PORT) || 8089,
  apiKey: process.env.API_KEY || "",
  mongoUri: process.env.MONGO_URI || "",
  throttleInterval: 10000,
  redisUri: process.env.REDIS_URI || "",
  maxWaitedItems: 10,
};
