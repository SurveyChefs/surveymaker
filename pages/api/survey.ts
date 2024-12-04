import { NextApiRequest, NextApiResponse } from "next";
import Survey from "@/app/models/survey";
import connectToDatabase from "@/lib/mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
   
      await connectToDatabase();

   
      const { title, description, questions } = req.body;
      const survey = new Survey({
        title,
        description,
        questions,
      });


      await survey.save();


      return res.status(201).json({ message: "Survey created successfully", survey });
    } catch (error) {
      console.error("Error saving survey:", error);
      return res.status(500).json({ message: "Error saving survey", error });
    }
  } else {

    return res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default handler;
