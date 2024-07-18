import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import { errorHandler } from './src/errors/errorHandler/errorhandler.js';
import { createUserRouter } from './src/users/userRoutes.js';
import { createOfferRouter } from './src/offer/offerRoutes.js';
import { createInventoryRouter } from './src/inventory/inventoryRoutes.js';
dotenv.config();

export const app = express();
app.use(express.json());
app.use(cookieParser());
app.disable('x-powered-by');

app.use('/users', createUserRouter());
app.use('/offers', createOfferRouter());
app.use('/inventory', createInventoryRouter());

const PORT = process.env.PORT ?? 0;

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
