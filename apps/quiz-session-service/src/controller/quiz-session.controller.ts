import { Request, Response } from "express";
import mongoose from "mongoose";

import { quizContentSdk } from "../utils/quizContentSdk";
import { IQuizSessionSchema, QuizSession } from "../model/quiz-session.model";
import { logger } from "../utils/logger";
import { QuizSessionStatus } from "../constant";
import { cacheSession, getCachedSession } from "../utils/session-cache";

export const startSession = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userIds, numberOfQuestions } = req.body;

  if (!Array.isArray(userIds) || typeof numberOfQuestions !== "number") {
    return res.status(400).send({
      error:
        "[QuizSessionService] Invalid input. userIds must be an array and numberOfQuestions must be a number.",
    });
  }

  try {
    const questions = await quizContentSdk.getListQuizzes(numberOfQuestions);
    const session = new QuizSession({
      sessionId: new mongoose.Types.ObjectId().toString(),
      userIds,
      numberOfQuestions,
      questions,
      status: QuizSessionStatus.Draft,
    });

    await session.save();
    await cacheSession(session.sessionId, session as IQuizSessionSchema);

    logger.info({
      message: "[QuizSessionService] Quiz session started successfully",
      session,
    });

    return res.status(201).send(session);
  } catch (error) {
    logger.error({
      message: "[QuizSessionService] Error starting quiz session.",
      error,
    });
    return res.status(500).send({
      message: "[QuizSessionService] Error starting quiz session.",
      error,
    });
  }
};

export const joinSession = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userId, sessionId  } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ error: "[QuizSessionService] userId is required." });
  }

  try {
    let session = await getCachedSession(sessionId);

    if (!session) {
      console.log({sessionId})
      session = await QuizSession.findOne({ sessionId });

      if (!session) {
        return res
          .status(404)
          .json({ error: "[QuizSessionService] Session not found." });
      }

      await cacheSession(sessionId, session);
    }

    logger.info({
      msg: "[QuizSessionService] Current session",
      session,
    });

    if (session.status === QuizSessionStatus.Active) {
      return res.status(200).send({
        message: "[QuizSessionService] Session is active. User cannot join.",
      });
    }

    if (!session.userIds.includes(userId)) {
      session.userIds.push(userId);
      await QuizSession.updateOne({ sessionId }, { userIds: session.userIds });
      await cacheSession(sessionId, session);
    }

    logger.info({
      message: "[QuizSessionService] User joined the session successfully.",
      session,
    })

    return res.status(200).send(session);
  } catch (error) {
    logger.error({
      message: "[QuizSessionService] Error joining quiz session.",
      error,
    });
    return res.status(500).send({
      error: "[QuizSessionService] Error joining quiz session.",
      details: error,
    });
  }
};

export const activateSession = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { sessionId } = req.params;

  try {
    let session = await getCachedSession(sessionId);

    if (!session) {
      session = await QuizSession.findOne({ sessionId });

      if (!session) {
        return res.status(404).json({ error: "Session not found." });
      }
    }

    logger.info({
      msg: "[QuizSessionService] Current session",
      session,
    });

    session.status = QuizSessionStatus.Active;
    await QuizSession.updateOne({ sessionId }, { status: "Active" });
    await cacheSession(sessionId, session);

    return res.status(200).json({
      message: "[QuizSessionService] Session activated successfully.",
      session,
    });
  } catch (error) {
    logger.error({
      message: "[QuizSessionService] Error activating quiz session.",
      error,
    });
    return res.status(500).send({
      message: "[QuizSessionService] Error activating quiz session.",
      error,
    });
  }
};

export const sessionDetails = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { sessionId } = req.params;

  try {
    let session = await getCachedSession(sessionId);

    if (!session) {
      session = await QuizSession.findOne({ sessionId });

      if (!session) {
        return res.status(404).json({ error: "Session not found." });
      }

      await cacheSession(sessionId, session);
    }
    
    logger.info({
      msg: "[QuizSessionService] Current session",
      session,
    });

    return res.status(200).send({ session });
  } catch (error) {
    logger.error({
      message: "[QuizSessionService] Error retrieving session status.",
      error,
    });
    return res.status(500).send({
      message: "[QuizSessionService] Error retrieving session status.",
      error,
    });
  }
};
