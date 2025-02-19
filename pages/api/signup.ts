import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../.././src/lib/mongodb'; 
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      const { username, email, password } = req.body;
  
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      try {
        const db = await connectToDatabase(); // Get the database instance
        const usersCollection = db.collection('users'); // Access the 'users' collection
  
        // Check if the user already exists
        const existingUser = await usersCollection.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }
  
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
  
        // Insert the new user into the database
        await usersCollection.insertOne({
          username,
          email,
          password: hashedPassword,
          createdAt: new Date(),
        });
  
        res.status(201).json({ message: 'User registered successfully' });
      } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }