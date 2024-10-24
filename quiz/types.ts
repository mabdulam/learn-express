import { Request } from 'express';

// Define the User interface
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

// Extend the Express Request to include users array
export interface UserRequest extends Request {
  users?: User[];
}
