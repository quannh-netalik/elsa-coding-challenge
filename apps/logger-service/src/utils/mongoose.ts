import mongoose from "mongoose";
import { constant } from "../constant";

mongoose
  .connect(constant.mongoUri)
  .then(() => {
    console.log("[LoggerService] Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
