import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OfferRepository } from '../../../src/offer/offerRepository.js';
import { OfferService } from '../../../src/offer/offerService.js';

describe('offerServiceAllOffers', () => {
  const offers = [
    {
      offer_id: 1,
      userNamePoster: 'SaturDon',
      offer_items: [
        {
          item_name: 'Martillo de Thor',
          quantity: 1,
          img: 'https://cdn-icons-png.freepik.com/256/12092/12092522.png?uid=R125020544&ga=GA1.1.297410512.1711637426&'
        }
      ],
      request_items: [
        {
          item_name: 'Arco de cristal',
          quantity: 1,
          img: 'https://cdn-icons-png.freepik.com/256/12569/12569010.png?uid=R125020544&ga=GA1.1.297410512.1711637426&'
        }
      ]
    }];

  let offerRepositoryMock;
  let offerService;

  beforeEach(() => {
    offerRepositoryMock = vi.spyOn(OfferRepository.prototype, 'getOffers');
    offerService = new OfferService({ offerRepository: new OfferRepository({ mySQLConnection: {} }) });
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should be able to return te complete array of the offers ', async () => {
    // ARRANGE
    offerRepositoryMock.mockResolvedValue(offers);

    // ACT
    const res = await offerService.getOffers();

    // ASSERT
    expect(res).toEqual(offers);
  });
});
