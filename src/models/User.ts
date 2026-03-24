import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  linkedin?: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const JoinRequestSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  linkedin: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

// Use a fresh collection name to bypass HMR cache entirely
export const JoinRequest: Model<IUser> = mongoose.models.JoinRequest || mongoose.model<IUser>('JoinRequest', JoinRequestSchema);
