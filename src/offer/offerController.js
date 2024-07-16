import { tryCatch } from '../utils/tryCatch.js';

export class OfferController {
  constructor ({ offerService }) {
    this.offerService = offerService;
    this.getOffers = this.getOffers.bind(this);
  }

  getOffers = tryCatch(async (req, res) => {
    const offers = await this.offerService.getOffers();

    return res.status(200).json(offers);
  });
}
