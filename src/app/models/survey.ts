import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  answers: [{ type: String }], // Array of possible answers
});

const SurveySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    questions: [QuestionSchema], // Array of questions
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Export the Mongoose model. If the model already exists, reuse it to avoid recompiling it.
const Survey = mongoose.models.Survey || mongoose.model('Survey', SurveySchema);

export default Survey;