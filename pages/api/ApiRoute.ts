// pages/api/adminRoute.ts
import { NextApiRequest, NextApiResponse } from "next";
import { checkAdmin } from "../../src/lib/checkAdmin";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  checkAdmin(req, res, () => {
    // Only admin users will reach here
    res.status(200).json({ message: "Welcome, admin!" });
  });
}