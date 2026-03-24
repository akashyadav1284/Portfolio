import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  level: number;
  category: string;
  icon?: string;
}

const SkillSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, required: true },
  category: { type: String, required: true },
  icon: { type: String },
});

export const Skill: Model<ISkill> = mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema);
