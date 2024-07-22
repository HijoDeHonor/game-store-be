import { FailedCreatingError } from '../errors/errorTypes/failedCreatingError.js';
import { FailedToDeleteError } from '../errors/ErrorTypes/failedToDeleteError.js';
import { InvalidDataError } from '../errors/errorTypes/invalidDataError.js';
import { FAILED_CREATE, FAILED_DELETING, INSUFFICIENT_QUANTITY, INVALID_DATA, OFFERS } from '../utils/textConstants.js';

export class OfferService {
  constructor ({ offerRepository, inventoryRepository }) {
    this.offerRepository = offerRepository;
    this.inventoryRepository = inventoryRepository;
  }

  create = async (userName, offer, request, id) => {
    if ((!userName) || (offer.length === 0) || (request.length === 0) || (!id)) {
      throw new InvalidDataError(INVALID_DATA, OFFERS);
    }
    for (const item of offer) {
      const { name, Quantity } = item;
      const actualQuantity = await this.inventoryRepository.getQuantity(userName, name);
      if (Quantity > actualQuantity) {
        throw new InvalidDataError(INSUFFICIENT_QUANTITY, OFFERS);
      }
    }
    for (const item of offer) {
      const { name, Quantity } = item;
      const isDelete = await this.inventoryRepository.removeItemToUser(userName, name, Quantity);
      if (!isDelete) {
        throw new FailedCreatingError(FAILED_CREATE, OFFERS);
      }
    }
    const isCreated = await this.offerRepository.create(userName, offer, request);
    if (isCreated !== true) {
      throw new FailedCreatingError(FAILED_CREATE, OFFERS);
    }
  };

  getOffers = async () => {
    const offers = await this.offerRepository.getOffers();
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
