import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  type: string;
  name: string;
  answers?: string[];
}

export interface ISurvey extends Document {
  title: string;
  description: string;
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema({
  type: { type: String, required: true },
  name: { type: String, required: true },
  answers: [{ type: String }]
});

const SurveySchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Survey || mongoose.model<ISurvey>('Survey', SurveySchema);