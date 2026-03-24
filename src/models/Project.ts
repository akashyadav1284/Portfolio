import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  techStack: string[];
  githubLink: string;
  liveLink: string;
  image?: string;
}

const ProjectSchema: Schema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  techStack: [{ type: String }],
  githubLink: { type: String },
  liveLink: { type: String },
  image: { type: String },
});

export const Project: Model<IProject> = mongoose.models.PortfolioProject || mongoose.model<IProject>('PortfolioProject', ProjectSchema);
