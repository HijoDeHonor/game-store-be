export class OfferService {
  constructor ({ offerRepository }) {
    this.offerRepository = offerRepository;
  }

  getOffers = async () => {
    const offer = await this.offerRepository.getOffers();
    return offer;
  };
}
