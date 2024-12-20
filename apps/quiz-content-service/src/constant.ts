export const constant = {
  port: Number(process.env.PORT) || 8080,
  apiKey: process.env.API_KEY || "",
  mongoUri: process.env.MONGO_URI || "",
  loggerServiceEndpoint: process.env.LOGGER_SERVICE_ENDPOINT || "",
  defaultGeneratedQuestion: 5,
  maxGeneratedQuestion: 10,
};
