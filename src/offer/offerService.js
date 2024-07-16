import { FailedToDeleteError } from '../errors/ErrorTypes/failedToDeleteError.js';
import { FAILED_DELETING, OFFERS } from '../utils/textConstants.js';

export class OfferService {
  constructor ({ offerRepository }) {
    this.offerRepository = offerRepository;
  }

  getOffers = async () => {
    const offers = await this.offerRepository.getOffers();
    return offers;
  };

  deleteOffer = async (id) => {
    const isDelete = await this.offerRepository.deleteOffer(id);
    if (isDelete.success !== true) {
      throw new FailedToDeleteError(FAILED_DELETING, OFFERS);
    }
    return isDelete;
  };
}
