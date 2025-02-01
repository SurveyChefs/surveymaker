import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongodb";
import Survey from "@/app/models/survey";
import SurveyAnswer from "@/app/models/surveyAnswer";

// Define the interfaces for the response types
interface Question {
  name: string;
  type: string;
  answers?: string[];
}

interface Survey {
  questions: Question[];
}

interface SurveyAnswerResponse {
  questionIndex: number;
  answer: string;
}

interface SurveyAnswer {
  answers: SurveyAnswerResponse[];
}

interface DetailedResponse {
  question: string;
  type: string;
  answerCounts?: { [key: string]: number };
  textResponses?: string[];
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { surveyId } = req.query;

  await connectToDatabase();

  try {
    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    const surveyAnswers = await SurveyAnswer.find({ surveyId });

    // Map through the survey questions and build detailedResponses
    const detailedResponses: DetailedResponse[] = survey.questions.map(
        (question: Question, index: number) => {
          if (question.type === "multipleChoice") {
            // Safely handle when question.answers might be undefined
            const answerCounts = question.answers?.reduce(
              (acc: { [key: string]: number }, answer: string) => {
                acc[answer] = 0;
                return acc;
              },
              {} // Default to an empty object
            ) || {}; // Ensure answerCounts is always empty
      
            surveyAnswers.forEach((answer: SurveyAnswer) => {
              const response = answer.answers.find(
                (a: SurveyAnswerResponse) => a.questionIndex === index
              );
              if (response) {
                answerCounts[response.answer] += 1;
              }
            });
      
            return { question: question.name, type: "multipleChoice", answerCounts };
          } else if (question.type === "textEntry") {
            const textResponses = surveyAnswers.map((answer: SurveyAnswer) => {
              const response = answer.answers.find(
                (a: SurveyAnswerResponse) => a.questionIndex === index
              );
              return response?.answer;
            });
      
            return { question: question.name, type: "textEntry", textResponses };
          }
      
          return { question: question.name, type: "unknown" };
        }
      );      

    // Send the response with the survey and detailedResponses data
    res.status(200).json({ survey, detailedResponses });
  } catch (error) {
    console.error("Error fetching survey details:", error);
    res.status(500).json({ message: "Error fetching survey details" });
  }
};

export default handler;
