import mongoose, { Schema, Document } from 'mongoose';

export interface ISkipLogic {
  answer: string;
  skipToIndex: number;
}

export interface IQuestion extends Document {
  type: string;
  name: string;
  answers?: string[];
  skipLogic?: ISkipLogic[];
  index: number;
  description: string;
}

export interface ISurvey extends Document {
  title: string;
  description: string;
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const SkipLogicSchema = new Schema({
  answer: { type: String, required: true },
  skipToIndex: { type: Number, required: true }
});

const QuestionSchema = new Schema({
  type: { type: String, required: true },
  name: { type: String, required: true },
  answers: [{ type: String }],
  skipLogic: [SkipLogicSchema],
  index: { type: Number, required: true },
  description: { type: String, default: "" }
});

const SurveySchema = new Schema({
  title: { type: String},
  description: { type: String},
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Survey || mongoose.model<ISurvey>('Survey', SurveySchema);