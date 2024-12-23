import "./utils/env";
import "./utils/mongoose";

import express from "express";
import http from "http";
import { Server } from "socket.io";
import { constant, ESocketEvent } from "./constant";
import { quizSessionSdk } from "./utils/quizSessionSdk";
import { userSdk } from "./utils/userSdk";
import { logger } from "./utils/logger";
import { errHandler, logIncomingRequest, setCorrelationId } from "./middleware";

const PORT: number = constant.port;

// Create an Express app
const app = express();

// Middleware (e.g., JSON parsing, if needed for HTTP routes)
app.use(express.json());

// Log incoming traffic and responses
app.use(logIncomingRequest);
app.use(setCorrelationId);

// Create an HTTP server and attach Express to it
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// !TODO: replaced with redis
const sessions: any = {}; // Temporary in-memory storage for session state

io.on("connection", (socket) => {
  logger.info(`[QuizSessionSocket] User connected: ${socket.id}`);

  socket.on(ESocketEvent.LOGIN, async ({ username, password }) => {
    const { token } = await userSdk.login({
      username,
      password,
      type: "internal",
    });
    socket.emit("login-success", { token });
  });

  // Create new quiz session
  socket.on(ESocketEvent.CREATE_QUIZ_SESSION, async ({ token }, callback) => {
    try {
      const user = await userSdk.getUserInfo(token);
      const session = await quizSessionSdk.startSession({
        userIds: [user.userId],
        numberOfQuestions: constant.defaultNumberOfQuestions,
      });

      sessions[session.sessionId] = {
        ...session,
        answers: {},
        currentQuestion: 0,
      };

      // Join room after created
      socket.join(session.sessionId);

      callback({ success: true, session });
    } catch (error) {
      callback({ success: false, error });
    }
  });

  // Join a quiz session
  socket.on(
    ESocketEvent.JOIN_QUIZ_SESSION,
    async ({ sessionId, token }, callback) => {
      try {
        const user = await userSdk.getUserInfo(token);
        const session = await quizSessionSdk.joinSession(
          sessionId,
          user.userId
        );

        sessions[session.sessionId] = {
          ...session,
          userIds: session.userIds,
          answers: {},
          currentQuestion: 0,
        };
        
        socket.join(session.sessionId);
        callback({ success: true, session: sessions[sessionId] });

        io.to(session.sessionId).emit(ESocketEvent.USER_JOINED, {
          session: sessions[sessionId],
        });
      } catch (error: any) {
        logger.error(`[QuizSessionSocket] ${error.message}`);
        callback({
          success: false,
          error: `[QuizSessionSocket] ${error.message}`,
        });
      }
    }
  );

  socket.on("disconnect", () => {
    logger.info(`[QuizSessionSocket] User disconnected: ${socket.id}`);
  });
});

// Example HTTP route
app.get("/", (req, res) => {
  res.send("Express and Socket.IO Server is running!");
});

// 404 handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({ error: "[QuizSessionSocket] Route not found" });
});

// Error handler
app.use(errHandler);

// Start the server
httpServer.listen(PORT, () => {
  logger.info(`[QuizSessionSocket] Server is running on http://localhost:${PORT}`);
});