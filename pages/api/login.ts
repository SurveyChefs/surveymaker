import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../src/lib/mongodb";  // Same connect function
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../src/app/models/User";  // Import the User model

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Ensure you set this in your .env file

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    // Connect to the database
    await connectToDatabase();

    // Find the user by username (case-insensitive)
    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the password with the hashed password stored in the database
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token with role information
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role }, // Include the role in the payload
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Return a success message with the user's name and the JWT token
    res.status(200).json({ 
      message: `Hello, ${user.username}`,
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
