import { FailedToDeleteError } from '../errors/ErrorTypes/failedToDeleteError.js';
import { InvalidDataError } from '../errors/errorTypes/invalidDataError.js';
import { FAILED_DELETING, INVALID_DATA, OFFERS } from '../utils/textConstants.js';

export class OfferService {
  constructor ({ offerRepository }) {
    this.offerRepository = offerRepository;
  }

  getOffers = async (page) => {
    if (!page) {
      throw new InvalidDataError(INVALID_DATA, OFFERS);
    }
    const offers = await this.offerRepository.getOffers(page);
    return offers;
  };

  deleteOffer = async (id) => {
    if (!id) {
      throw new InvalidDataError(INVALID_DATA, OFFERS);
    }
    const isDelete = await this.offerRepository.deleteOffer(id);
    if (isDelete !== true) {
      throw new FailedToDeleteError(FAILED_DELETING, OFFERS);
    }
  };
}
