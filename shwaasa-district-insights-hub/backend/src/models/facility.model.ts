import { Schema, model, Document } from 'mongoose';

interface IFacility extends Document {
  id: string;
  name: string;
  district: string;
  scans: number;
  accuracy: number;
  status: 'Green' | 'Yellow' | 'Red';
  lastUpdated: Date;
}

const facilitySchema = new Schema<IFacility>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  district: { type: String, required: true },
  scans: { type: Number, required: true },
  // state: { type: String, default: 'Telangana' },
  accuracy: { type: Number, required: true, min: 0, max: 100 },
  status: { type: String, enum: ['Green', 'Yellow', 'Red'], required: true },
  lastUpdated: { type: Date, default: Date.now }
});

export const Facility = model<IFacility>('Facility', facilitySchema);