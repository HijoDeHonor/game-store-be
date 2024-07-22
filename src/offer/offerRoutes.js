import { Router } from 'express';
import { container } from '../dependencyInjection/di-settings.js';
import { authenticateJWT } from '../middlewares/authentication.js';

const offerController = container.resolve('offerController');

export const createOfferRouter = () => {
  const offerRouter = Router();

  offerRouter.post('/', authenticateJWT, offerController.create);
  offerRouter.get('/', offerController.getOffers);
  offerRouter.delete('/:id?', offerController.deleteOffer);
  return offerRouter;
};
