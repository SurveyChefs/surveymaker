// pages/api/createAdmin.ts
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import User from "../../src/app/models/User";
import connectToDatabase from "../../src/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await connectToDatabase();

    // Check if the user already exists
    const existingUser = await User.findOne({ email: "admin@example.com" });

    if (existingUser) {
      return res.status(400).json({ message: "Admin user already exists" });
    }

    // Create the admin user
    const hashedPassword = await bcrypt.hash("adminpassword", 10); // You can change this to any password

    const newAdmin = new User({
      username: "adminUser",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin", // Role set to admin
    });

    await newAdmin.save();
    return res.status(201).json({ message: "Admin user created successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}