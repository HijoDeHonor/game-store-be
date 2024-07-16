import { InvalidDataError } from '../errors/errorTypes/invalidDataError.js';
import { INVALID_DATA, OFFERS } from '../utils/textConstants.js';
import { tryCatch } from '../utils/tryCatch.js';

export class OfferController {
  constructor ({ offerService }) {
    this.offerService = offerService;
    this.getOffers = this.getOffers.bind(this);
    this.deleteOffer = this.deleteOffer.bind(this);
  }

  getOffers = tryCatch(async (req, res) => {
    const offers = await this.offerService.getOffers();

    return res.status(200).json(offers);
  });

  deleteOffer = tryCatch(async (req, res) => {
    const id = req.params.id;
    if (!id) {
      throw new InvalidDataError(INVALID_DATA, OFFERS);
    }
    const isDelete = await this.offerService.deleteOffer(id);
    return res.status(200).json(isDelete.message);
  });
}
