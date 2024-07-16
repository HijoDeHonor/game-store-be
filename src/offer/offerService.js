export class OfferService {
  constructor ({ offerRepository }) {
    this.offerRepository = offerRepository;
  }

  getOffers = async () => {
    const offers = await this.offerRepository.getOffers();
    return offers;
  };
}
