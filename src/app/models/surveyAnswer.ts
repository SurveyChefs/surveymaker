import mongoose, { Schema, Document } from "mongoose";

export interface ISurveyAnswer extends Document {
  surveyId: any;
  answers: any[];
  createdAt: Date;
  updatedAt: Date;
}

const SurveyAnswerSchema = new Schema({
  surveyId: Schema.Types.Mixed,
  answers: []
}, {
  timestamps: true,
  collection: "surveyAnswers"
});

export default mongoose.models.SurveyAnswer || mongoose.model<ISurveyAnswer>("SurveyAnswer", SurveyAnswerSchema);