import { tryCatch } from '../utils/tryCatch.js';
import { CREATE_SUCCESS, HAS_BEEN_COMPLETE, HAS_BEEN_DELETE } from '../../src/utils/textConstants.js';

export class OfferController {
  constructor ({ offerService }) {
    this.offerService = offerService;
    this.getOffers = this.getOffers.bind(this);
    this.deleteOffer = this.deleteOffer.bind(this);
    this.create = this.create.bind(this);
    this.complete = this.complete.bind(this);
  }

  complete = tryCatch(async (req, res) => {
    const id = req.params.id;
    const userNameTrader = req.body.userName;
    await this.offerService.complete(id, userNameTrader);
    return res.status(200).json(HAS_BEEN_COMPLETE);
  });

  create = tryCatch(async (req, res) => {
    const { id, userName, offer, request } = req.body;
    await this.offerService.create(id, userName, offer, request);
    return res.status(201).json(CREATE_SUCCESS);
  });

  getOffers = tryCatch(async (req, res) => {
    const page = req.params.page || 1;
    const offers = await this.offerService.getOffers(page);
    return res.status(200).json(offers);
  });

  deleteOffer = tryCatch(async (req, res) => {
    const id = req.params.id;
    await this.offerService.deleteOffer(id);
    return res.status(200).json(HAS_BEEN_DELETE);
  });
}
