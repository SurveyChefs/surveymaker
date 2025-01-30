import surveyAnswer from "@/app/models/surveyAnswer";
import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase  from "@/lib/mongodb";

// Connects to the database
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectToDatabase();

  try {
    if (req.method === 'POST') {

      // Takes ID and answers from the request body
      const { surveyId, answers } = req.body;
      
      // New survey answer object
      const SurveyAnswer = new surveyAnswer({
        surveyId,
        answers
      });

      await SurveyAnswer.save();

      return res.status(201).json({ 
        success: true,
        message: "Answers saved successfully",
        data: SurveyAnswer 
      });
    }
    return res.status(405).json({ message: "Method Not Allowed" });
    
  } catch (error) {
    console.error("Error saving answers:", error);
    return res.status(500).json({ 
      success: false,
      message: "Error saving answers" 
    });
  }
};

export default handler;