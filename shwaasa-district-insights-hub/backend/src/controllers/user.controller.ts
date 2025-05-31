
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY;
export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      res.status(400).json({ message: 'Username and password required' });
      return;
    }

    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Include isAdmin in the JWT payload
    const token = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.SECRET_KEY!,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, isAdmin: user.isAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: 'error.message '});
  }
};