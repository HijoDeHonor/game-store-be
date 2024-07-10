import express from 'express';
import cookieParser from 'cookie-parser';
import { errorHandler } from './errors/errorHandler/errorhandler.js';
import { tryCatch } from './utils/tryCatch.js';
import { createUserRouter } from './users/userRoutes.js';
import { createInventoryRouter } from './inventory/inventoryRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

export const app = express();
app.use(express.json());
app.use(cookieParser());
app.disable('x-powered-by');

app.use('/users', createUserRouter());
app.use('/inventory', createInventoryRouter());

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
