import fs from "fs";
import path from "path";
import { IQuizContent, QuizContent } from "../model/quiz.model";

// Bootstrap function to import quiz data
export const bootstrapData = async () => {
  const dataFilePath = path.resolve(__dirname, "../../data/quiz.json");
  const rawData = fs.readFileSync(dataFilePath, "utf-8");
  const quizData: IQuizContent[] = JSON.parse(rawData);

  try {
    await QuizContent.deleteMany({});
    await QuizContent.insertMany(quizData);
    console.log("Quiz data imported successfully");
  } catch (err) {
    console.error("Failed to import quiz data:", err);
  }
};
