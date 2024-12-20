import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: __dirname + "../.env" });

import { auth, logIncomingRequest } from "./middleware";
import { bootstrapData } from "./utils/bootstrapData";
import { quizGeneration } from "./controller/quiz.controller";
import { constant } from "./constant";

// Express app setup
const app = express();
const PORT: number = constant.port;

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(constant.mongoUri)
  .then(() => {
    console.log("[QuizContentService] Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// Middleware to authenticate API requests

// Log incoming traffic and responses
app.use(logIncomingRequest);

app.get("/health", (_: Request, res: Response) => {
  res.status(200).send("Successful");
});

// POST /quiz-generation endpoint
app.post("/quiz-generation", auth, quizGeneration);

// Start the server
app.listen(PORT, async () => {
  console.log(`[QuizContentService] is running on port ${PORT}`);
  await bootstrapData();
});
