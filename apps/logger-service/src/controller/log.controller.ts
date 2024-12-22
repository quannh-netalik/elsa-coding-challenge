import { Request, Response } from "express";
import Queue from "bull";

import { Log } from "../model/log.model";
import { constant } from "../constant";

export const logQueue = new Queue("logQueue", constant.redisUri);

// Process the log queue every 10 seconds
logQueue.process(async (job) => {
  const logs = job.data;
  try {
    await Log.insertMany(logs);
    console.log(`[LoggerService] Inserted ${logs.length} logs into MongoDB`);
  } catch (error) {
    console.error("[LoggerService] Error inserting logs:", error);
    throw error; // Let Bull retry the job
  }
});

// Batch queue for log entries
logQueue.on("waiting", () => {
  console.log("[LoggerService] Log queue is waiting for logs");
});

let batch: any[] = [];

export const postLog = async (req: Request, res: Response): Promise<void> => {
  const correlationId = req.headers["correlation-id"] as string;
  if (!correlationId) {
    res.status(400).json({ error: "Correlation ID is required" });
    return;
  }

  const { source, message, level } = req.body;

  if (!source || !message || !level) {
    res
      .status(400)
      .json({ error: "Source and Message and level are required" });
    return;
  }

  const logEntry = {
    source,
    correlationId,
    message,
    level,
    timestamp: new Date(),
  };

  batch.push(logEntry);

  if (batch.length === constant.maxWaitedItems) {
    await logQueue.add(batch);
    batch = []; // Clear batch after pushing to queue
  } else {
    setTimeout(async () => {
      if (batch.length > 0) {
        await logQueue.add(batch);
        batch = [];
      }
    }, 10000); // Wait 10 seconds for more logs before processing
  }
};
