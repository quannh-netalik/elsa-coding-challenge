import mongoose from "mongoose";

export interface ILog {
  source: string;
  correlationId: string;
  message: any;
  level: string;
  timestamp: Date;
}

export const logSchema = new mongoose.Schema<ILog>({
  source: { type: String, required: true },
  correlationId: { type: String, required: true },
  message: { type: Object, required: true },
  level: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Log = mongoose.model<ILog>("Log", logSchema);
