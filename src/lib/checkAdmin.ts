import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export function checkAdmin(req: NextApiRequest, res: NextApiResponse, next: Function) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { role: string };
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    next(); // If the role is admin, proceed to the next middleware or handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
