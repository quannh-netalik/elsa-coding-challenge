import fs from "fs";
import path from "path";
import { IQuizContent, QuizContent } from "../model/quiz.model";
import { logger } from "./logger";

// Bootstrap function to import quiz data
export const bootstrapData = async () => {
  const dataFilePath = path.resolve(__dirname, "../../data/quiz.json");
  const rawData = fs.readFileSync(dataFilePath, "utf-8");
  const quizData: IQuizContent[] = JSON.parse(rawData);

  try {
    await QuizContent.deleteMany({});
    await QuizContent.insertMany(quizData);
    logger.info({
      message: "QuizData import successfully",
      correlationId: "NA",
    });
  } catch (err) {
    logger.error({ message: err, correlationId: "NA" });
    console.error("Failed to import quiz data:", err);
  }
};
