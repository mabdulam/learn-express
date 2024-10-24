import express, { Response, NextFunction } from 'express';
import { User, UserRequest } from './types';

const router = express.Router();
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

// Endpoint to read all usernames
router.get('/usernames', addMsgToRequest, (req: UserRequest, res: Response) => {
  const usernames = req.users?.map((user) => ({
    id: user.id,
    username: user.username,
  }));
  res.send(usernames);
});

// Endpoint to read a user by username
router.get('/username/:name', addMsgToRequest, (req: UserRequest, res: Response) => {
  const username = req.params.name;
  const user = req.users?.find(u => u.username === username);

  if (user) {
    res.json({ email: user.email });
  } else {
    res.status(404).json({ error: { message: 'User not found', status: 404 } });
  }
});

export const loadUsers = (userData: User[]) => {
  users = userData;
};

export default router;
