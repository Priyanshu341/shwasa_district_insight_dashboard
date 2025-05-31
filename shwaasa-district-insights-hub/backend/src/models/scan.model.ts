import { Schema, model, Document } from 'mongoose';

interface IHistoryEntry {
  day: string;
  target: number;
  achieved: number;
  date?: Date;
}

interface IScan extends Document {
  totalScans: number;
  normalScans: number;
  abnormalScans: number;
  pendingValidation: number;
  dailyTarget: number;
  achieved: number;
  history: IHistoryEntry[];
  timestamp: Date;
}

const historyEntrySchema = new Schema<IHistoryEntry>({
  day: { type: String, required: true }, // Mon, Tue, Wed, etc.
  target: { type: Number, required: true },
  achieved: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}, { _id: false });

const scanSchema = new Schema<IScan>({
  totalScans: { type: Number, required: true },
  normalScans: { type: Number, required: true },
  abnormalScans: { type: Number, required: true },
  pendingValidation: { type: Number, required: true },
  dailyTarget: { type: Number, required: true },
  achieved: { type: Number, required: true },
  history: [historyEntrySchema], // Array of historical data
  timestamp: { type: Date, default: Date.now }
});

export const Scan = model<IScan>('Scan', scanSchema);
export type { IScan, IHistoryEntry };