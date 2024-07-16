import { Router } from 'express';
import { container } from '../dependencyInjection/di-settings.js';

const offerController = container.resolve('offerController');

export const createOfferRouter = () => {
  const offerRouter = Router();

  offerRouter.get('/', offerController.getOffers);
  offerRouter.delete('/:id?', offerController.deleteOffer);
  return offerRouter;
};
