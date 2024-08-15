import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errorHandler } from './src/errors/errorHandler/errorhandler.js';
import { createUserRouter } from './src/users/userRoutes.js';
import { createOfferRouter } from './src/offer/offerRoutes.js';
import { createInventoryRouter } from './src/inventory/inventoryRoutes.js';
import { CORS_NOT_ALLOWED } from './src/utils/textConstants.js';
import { createServer } from '@vercel/node';

dotenv.config();

const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
    if (!origin || allowedOrigins.some((allowedOrigin) => origin.startsWith(allowedOrigin))) {
      return callback(null, true);
    }
    return callback(new Error(CORS_NOT_ALLOWED));
  },
  credentials: true
}));

app.use('/users', createUserRouter());
app.use('/offers', createOfferRouter());
app.use('/inventory', createInventoryRouter());

const PORT = process.env.PORT ?? 0;

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

export default createServer(app);
