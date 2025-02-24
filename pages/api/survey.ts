import { NextApiRequest, NextApiResponse } from "next";
import Survey from "@/app/models/survey";
import connectToDatabase from "@/lib/mongodb";

// Connect to the database
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectToDatabase();

  try {
    switch (req.method) {
      case 'GET':
        const { id } = req.query;
        
        // Fetches survey by ID
        if (id) {
          const survey = await Survey.findById(id);
          if (!survey) return res.status(404).json({ message: "Survey not found" });
          // Converts the data to JSON format
          return res.status(200).json({
            ...survey.toObject(),
            _id: survey._id.toString(),
            createdAt: survey.createdAt.toISOString(),
            updatedAt: survey.updatedAt.toISOString()
          });
        } else {
          const surveys = await Survey.find({}).select('title description createdAt');
          return res.status(200).json(
            surveys.map(survey => ({
              ...survey.toObject(),
              _id: survey._id.toString(),
              createdAt: survey.createdAt.toISOString()
            }))
          );
        }

      case 'POST':
        if (req.method === "POST") {
          try {
      
            // Connect to the database
            await connectToDatabase();
      
            // Survey data getting from the request body
            const { title, description, questions } = req.body;
            const survey = new Survey({
              title,
              description,
              questions,
            });

            // Save the survey to the database
            await survey.save();
      
            return res.status(201).json({ message: "Survey created successfully", survey });
          } catch (error) {
            console.error("Error saving survey:", error);
            return res.status(500).json({ message: "Error saving survey", error });
          }
        } else {
      
          return res.status(405).json({ message: "Method Not Allowed" });
        }  
      default:
        return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default handler;