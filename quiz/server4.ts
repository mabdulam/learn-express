import fs from 'fs';
import path from 'path';
import express, { Express } from 'express';
import cors from 'cors';
import { User } from './types';
import readUsersRouter, { loadUsers as loadReadUsers } from './readUsers';
import writeUsersRouter, { loadUsers as loadWriteUsers } from './writeUsers';

const app: Express = express();
const port = 8000;
const dataFile = path.resolve(__dirname, '../data/users.json');

let users: User[] = [];

// Read the users data from file
fs.readFile(dataFile, (err, data) => {
  if (err) {
    throw new Error('Failed to read users file');
  } else {
    users = JSON.parse(data.toString());
    // Load users into the routers
    loadReadUsers(users);
    loadWriteUsers(users);
    console.log('Users loaded');
  }
});

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use modularized routers
app.use('/read', readUsersRouter);
app.use('/write', writeUsersRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

