import { FailedCreatingError } from '../errors/errorTypes/failedCreatingError.js';
import { FailedToDeleteError } from '../errors/ErrorTypes/failedToDeleteError.js';
import { InvalidDataError } from '../errors/errorTypes/invalidDataError.js';
import { FAILED_CREATE, FAILED_DELETING, HAS_NOT_ENOUGH, INSUFFICIENT_QUANTITY, INVALID_DATA, OFFERS } from '../utils/textConstants.js';

export class OfferService {
  constructor ({ offerRepository, inventoryRepository, userRepository }) {
    this.offerRepository = offerRepository;
    this.inventoryRepository = inventoryRepository;
    this.userRepository = userRepository;
  }

  create = async (id, userName, offer, request) => {
    if ((!id) || (!userName) || (offer.length === 0) || (request.length === 0)) {
      throw new InvalidDataError(INVALID_DATA, OFFERS);
    }
    for (const item of offer) {
      const actualQuantity = await this.inventoryRepository.getQuantity(userName, item.name);
      if (item.Quantity > actualQuantity) {
        throw new InvalidDataError(INSUFFICIENT_QUANTITY, OFFERS);
      }
    }
    const isCreated = await this.offerRepository.create(id, userName, offer, request);
    if (isCreated !== true) {
      throw new FailedCreatingError(FAILED_CREATE, OFFERS);
    }
  };

  complete = async (id, userNameTrader) => {
    if ((!id) || (!userNameTrader)) {
      throw new InvalidDataError(INVALID_DATA, OFFERS);
    }

    const offer = this.offerRepository.getOffer(id);

    const offerItems = offer.offerItems;
    const requestItems = offer.requestItems;

    await this.userRepository.getBy(userNameTrader);

    const hasThisQuantity = await this.inventoryRepository.getQuantity(userNameTrader, [requestItems]);

    const compareItems = (requestItems, userHas) => {
      for (const reqItem of requestItems) {
        const userItem = userHas.find(item => item.item_name === reqItem.item_name);

        if (!userItem || userItem.Quantity <= reqItem.quantity) {
          return false;
        }
      }
      return true;
    };

    const hasEnoght = compareItems(requestItems, hasThisQuantity);

    if (!hasEnoght) {
      throw new InvalidDataError(HAS_NOT_ENOUGH, OFFERS);
    }

    const isComplete = this.offerRepository.trasnferItemsAndcompleteOffer(userNameTrader, offer.userNamePoster, requestItems, offerItems);

    return isComplete;
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
