// /pages/api/yourApiRoute.ts
import { NextApiRequest, NextApiResponse } from "next";
import { checkAdmin } from "../../../surveymaker/src/lib/checkAdmin"; // Adjust the path if needed

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  checkAdmin(req, res, () => {
    // Your logic for the admin-protected route here
    res.status(200).json({ message: "Welcome, admin!" });
  });
}
