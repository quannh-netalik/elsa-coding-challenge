import { IQuizSessionSchema } from "../model/quiz-session.model";
import { logger } from "./logger";
import { redisClient } from "./redis";

// Utility function to cache session data in Redis
export const cacheSession = async (
  sessionId: string,
  sessionData: IQuizSessionSchema
) => {
  await redisClient.setEx(
    `quiz-session-service:${sessionId}`,
    3600,
    JSON.stringify(sessionData)
  );
  logger.info({
    msg: `[QuizSessionService] Set cache for: quiz-session-service:${sessionId}`,
    sessionData,
  });
};

// Utility function to get session data from Redis
export const getCachedSession = async (sessionId: string) => {
  const cachedSession = await redisClient.get(
    `quiz-session-service:${sessionId}`
  );
  logger.info(`[QuizSessionService] Remove cache for: quiz-session-service:${sessionId}`);
  return cachedSession ? JSON.parse(cachedSession) : null;
};
