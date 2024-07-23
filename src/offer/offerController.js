import { tryCatch } from '../utils/tryCatch.js';
import { HAS_BEEN_DELETE } from '../../src/utils/textConstants.js';

export class OfferController {
  constructor ({ offerService }) {
    this.offerService = offerService;
    this.getOffers = this.getOffers.bind(this);
    this.deleteOffer = this.deleteOffer.bind(this);
  }

  getOffers = tryCatch(async (req, res) => {
    const limit = req.params.limit;
    const offset = req.params.offset;
    const offers = await this.offerService.getOffers(limit, offset);
    return res.status(200).json(offers);
  });

  deleteOffer = tryCatch(async (req, res) => {
    const id = req.params.id;
    await this.offerService.deleteOffer(id);
    return res.status(200).json(HAS_BEEN_DELETE);
  });
}
