import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../.././src/lib/mongodb'; 
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
      const db = await connectToDatabase(); // Get the database instance
      const usersCollection = db.collection('users'); // Access the 'users' collection

      // Find the user by username
      const user = await usersCollection.findOne({ username });

      if (user && (await bcrypt.compare(password, user.password))) {
        // Passwords match
        res.status(200).json({ message: 'Login successful' });
      } else {
        // Invalid credentials
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Database connection or query error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}