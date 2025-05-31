
import { Schema, model, Document } from 'mongoose';

interface DistrictHistory {
  period: string;
  tb: number;
  copd: number;
  fibrosis: number;
  pneumonia: number;
}

interface District extends Document {
  id: string;
  name: string;
  total: number;
  tb: number;
  copd: number;
  fibrosis: number;
  pneumonia: number;
  riskLevel: 'high' | 'medium' | 'low';
  coordinates: {
    x: number;
    y: number;
  };
  history: DistrictHistory[];
}

const districtSchema = new Schema<District>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  total: { type: Number, default: 0 },
  tb: { type: Number, default: 0 },
  copd: { type: Number, default: 0 },
  fibrosis: { type: Number, default: 0 },
  pneumonia: { type: Number, default: 0 },
  riskLevel: { type: String, enum: ['high', 'medium', 'low'], default: 'low' },
  coordinates: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  history: [{
    period: { type: String, required: true },
    tb: { type: Number, default: 0 },
    copd: { type: Number, default: 0 },
    fibrosis: { type: Number, default: 0 },
    pneumonia: { type: Number, default: 0 }
  }]
});

districtSchema.pre('save', function(next) {
  this.total = (this.tb || 0) + (this.copd || 0) + (this.fibrosis || 0) + (this.pneumonia || 0);
  next();
});

export const District = model<District>('District', districtSchema);