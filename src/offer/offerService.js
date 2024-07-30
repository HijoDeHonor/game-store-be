import { FailedCreatingError } from '../errors/errorTypes/failedCreatingError.js';
import { FailedToDeleteError } from '../errors/ErrorTypes/failedToDeleteError.js';
import { InvalidDataError } from '../errors/errorTypes/invalidDataError.js';
import { FAILED_CREATE, FAILED_DELETING, INSUFFICIENT_QUANTITY, INVALID_DATA, OFFERS } from '../utils/textConstants.js';

export class OfferService
{
  constructor ({ offerRepository, inventoryRepository })
  {
    this.offerRepository = offerRepository;
    this.inventoryRepository = inventoryRepository;
  }

  create = async (id, userName, offer, request) =>
  {
    if ((!id) || (!userName) || (offer.length === 0) || (request.length === 0))
    {
      throw new InvalidDataError(INVALID_DATA, OFFERS);
    }
    for (const item of offer)
    {
      const actualQuantity = await this.inventoryRepository.getQuantities(userName, item.name);
      if (item.Quantity > actualQuantity)
      {
        throw new InvalidDataError(INSUFFICIENT_QUANTITY, OFFERS);
      }
    }
    const isCreated = await this.offerRepository.create(id, userName, offer, request);
    if (isCreated !== true)
    {
      throw new FailedCreatingError(FAILED_CREATE, OFFERS);
    }
  };

  getOffers = async (page) =>
  {
    if (!page)
    {
      page = 1;
    }
    const offers = await this.offerRepository.getOffers(page);
    return offers;
  };

  deleteOffer = async (id) =>
  {
    if (!id)
    {
      throw new InvalidDataError(INVALID_DATA, OFFERS);
    }
    const isDelete = await this.offerRepository.deleteOffer(id);
    if (isDelete !== true)
    {
      throw new FailedToDeleteError(FAILED_DELETING, OFFERS);
    }
  };
}
