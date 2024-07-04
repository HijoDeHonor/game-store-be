import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import { errorHandler } from './errors/errorHandler/errorhandler.js';
import { tryCatch } from './utils/tryCatch.js';
import { createUserRouter } from './users/userRoutes.js';

dotenv.config();

export const app = express();
app.use(express.json());
app.use(cookieParser());
// app.use(corsMiddelware())
app.disable('x-powered-by');

app.use('/users', createUserRouter());

app.get(
  '/',
  tryCatch(async (req, res) => {
    res.status(200).send('<h1>GameStore</h1>');
  }));

const PORT = process.env.PORT ?? 0;

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
