import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  answers: [{ type: String }], 
});

const SurveySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    questions: [QuestionSchema], 
  },
  { timestamps: true } 
);


const Survey = mongoose.models.Survey || mongoose.model('Survey', SurveySchema);

export default Survey;