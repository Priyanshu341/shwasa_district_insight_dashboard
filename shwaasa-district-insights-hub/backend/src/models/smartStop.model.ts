import { Schema, model, Document } from 'mongoose';

interface ISmartStop extends Document {
  minutesSaved: number;
  radiationAvoided: number;
  powerSaved: number;
  costSaved: number;
  co2Offset: number;
  // timestamp: Date;
}

const smartStopSchema = new Schema<ISmartStop>({
  minutesSaved: { type: Number, required: true },
  radiationAvoided: { type: Number, required: true },
  powerSaved: { type: Number, required: true },
  costSaved: { type: Number, required: true },
  co2Offset: { type: Number, required: true },
  // timestamp: { type: Date, default: Date.now }
});

export const SmartStop = model<ISmartStop>('SmartStop', smartStopSchema);