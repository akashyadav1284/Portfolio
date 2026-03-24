import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IRating extends Document {
  stars: number;
  message?: string;
  createdAt: Date;
}

const RatingSchema: Schema = new mongoose.Schema({
  stars: { type: Number, required: true, min: 1, max: 5 },
  message: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Rating: Model<IRating> = mongoose.models.UserRating || mongoose.model<IRating>('UserRating', RatingSchema);
