import express, { Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { User, UserRequest } from './types';

const router = express.Router();
const dataFile = path.resolve(__dirname, '../data/users.json');
let users: User[] = [];

// Middleware to ensure users are available in the request
const addMsgToRequest = (req: UserRequest, res: Response, next: NextFunction) => {
  if (users.length > 0) {
    req.users = users;
    next();
  } else {
    res.status(404).json({
      error: { message: 'Users not found', status: 404 }
    });
  }
};

// Endpoint to add a new user
router.post('/adduser', addMsgToRequest, (req: UserRequest, res: Response) => {
  const newUser = req.body as User;
  users.push(newUser);

  // Write updated users to file
  fs.writeFile(dataFile, JSON.stringify(users), (err) => {
    if (err) {
      console.error('Failed to write file');
      res.status(500).send('Failed to write user data');
    } else {
      console.log('User saved');
      res.send('User added successfully');
    }
  });
});

export const loadUsers = (userData: User[]) => {
  users = userData;
};

export default router;
