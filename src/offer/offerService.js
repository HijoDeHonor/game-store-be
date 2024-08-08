import { DoesNotExistError } from '../errors/errorTypes/doesNotExistError.js';
import { FailedCreatingError } from '../errors/errorTypes/failedCreatingError.js';
import { FailedToDeleteError } from '../errors/ErrorTypes/failedToDeleteError.js';
import { InvalidDataError } from '../errors/errorTypes/invalidDataError.js';
import { DOES_NOT_EXIST, FAILED_CREATE, FAILED_DELETING, HAS_NOT_ENOUGH, INSUFFICIENT_QUANTITY, INVALID_DATA, OFFERS, USER_TRADER } from '../utils/textConstants.js';

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
    const actualQuantity = await this.inventoryRepository.getQuantities(userName, offer);

    const hasEnoght = this.compareItems(actualQuantity, offer);

    if (!hasEnoght) {
      throw new InvalidDataError(INSUFFICIENT_QUANTITY, OFFERS);
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

    const offer = await this.offerRepository.getOffer(id);

    const { offerItems, requestItems } = offer;

    if (!await this.userRepository.exist(userNameTrader)) {
      throw new DoesNotExistError(DOES_NOT_EXIST, USER_TRADER);
    }

    const userTraderItems = await this.inventoryRepository.getQuantities(userNameTrader, [requestItems]);

    const hasEnoght = this.compareItems(userTraderItems, requestItems);

    if (!hasEnoght) {
      throw new InvalidDataError(HAS_NOT_ENOUGH, OFFERS);
    }

    return this.offerRepository.trasnferItemsAndcompleteOffer(userNameTrader, offer.userNamePoster, requestItems, offerItems);
  };

  compareItems (itemsHas, itemsMust) {
    if (!Array.isArray(itemsMust)) {
      throw new InvalidDataError('asdaosd', OFFERS);
    }

    for (const reqItem of itemsMust) {
      const userItem = itemsHas.find(item => item.name === reqItem.name);

      if (!userItem || userItem.Quantity < reqItem.Quantity) {
        return false;
      }
    }
    return true;
  }


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
