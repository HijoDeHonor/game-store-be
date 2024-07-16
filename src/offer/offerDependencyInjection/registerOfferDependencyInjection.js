import { asClass } from 'awilix';
import { OfferController } from '../offerController.js';
import { OfferService } from '../offerService.js';
import { OfferRepository } from '../offerRepository.js';

export const registerOfferDependency = (container) => {
  container.register({
    offerController: asClass(OfferController).scoped(),
    offerService: asClass(OfferService).scoped(),
    offerRepository: asClass(OfferRepository).scoped()
  });
};
