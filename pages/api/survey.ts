// pages/api/surveys.ts
import { NextApiRequest, NextApiResponse } from "next";
import Survey from "@/app/models/survey";
import connectToDatabase from "@/lib/mongodb";

// API handler for POST requests
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      // Ensure database connection
      await connectToDatabase();

      // Extract the survey data from the request body
      const { title, description, questions } = req.body;

      // Create a new survey document
      const survey = new Survey({
        title,
        description,
        questions,
      });

      // Save the survey to the database
      await survey.save();

      // Send a success response
      return res.status(201).json({ message: "Survey created successfully", survey });
    } catch (error) {
      console.error("Error saving survey:", error);
      return res.status(500).json({ message: "Error saving survey", error });
    }
  } else {
    // Handle unsupported HTTP methods
    return res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default handler;
