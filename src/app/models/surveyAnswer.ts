import mongoose, { Schema, Document } from "mongoose";

export interface ISurveyAnswer extends Document {
  surveyId: any;
  answers: any[];
  createdAt: Date;
  updatedAt: Date;
}

const SurveyAnswerSchema = new Schema({
  surveyId: { type: Schema.Types.ObjectId, ref: 'Survey', required: true },
  answers: { type: Array, required: true },
}, {
  timestamps: true,
  collection: "surveyAnswers"
});

export default mongoose.models.SurveyAnswer || mongoose.model<ISurveyAnswer>("SurveyAnswer", SurveyAnswerSchema);