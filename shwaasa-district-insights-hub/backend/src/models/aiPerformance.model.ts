import { Schema, model, Document } from 'mongoose';

interface AIPerformance extends Document {
  diseaseType: 'tb' | 'copd' | 'pneumonia' | 'all';
  precision: number;
  confidenceDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  responseTime: {
    average: number;
    peak: number;
    lowest: number;
    targetMet: boolean;
  };
  change: number;
  // timestamp: Date;
}

const aiPerformanceSchema = new Schema<AIPerformance>({
  diseaseType: { type: String, enum: ['tb', 'copd', 'pneumonia', 'all'], default: 'all' },
  precision: { type: Number, required: true, min: 0, max: 100 },
  confidenceDistribution: {
    high: { type: Number, required: true, min: 0, max: 100 },
    medium: { type: Number, required: true, min: 0, max: 100 },
    low: { type: Number, required: true, min: 0, max: 100 }
  },
  responseTime: {
    average: { type: Number, required: true },
    peak: { type: Number, required: true },
    lowest: { type: Number, required: true },
    targetMet: { type: Boolean, required: true }
  },
  change: { type: Number, required: true },
  // timestamp: { type: Date, default: Date.now }
});

export const AIPerformance = model<AIPerformance>('AIPerformance', aiPerformanceSchema);