import { Schema, model, Document } from 'mongoose';

interface IAlert extends Document {
  id: string;
  title: string;
  facility: string;
  type: 'critical' | 'warning' | 'info';
  icon: 'Database' | 'AlertTriangle' | 'Bell';
  time: string;
  description: string;
  resolved: boolean; 
}

const alertSchema = new Schema<IAlert>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  facility: { type: String, required: true },
  type: { type: String, enum: ['critical', 'warning', 'info'], required: true },
  icon: { type: String, enum: ['Database', 'AlertTriangle', 'Bell'], required: true },
  time: { type: String, required: true },
  description: { type: String, required: true },
  resolved: { type: Boolean, default: false }
});

export const Alert = model<IAlert>('Alert', alertSchema);