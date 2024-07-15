import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FAILED_GETTING, OFFERS } from '../../src/utils/textConstants.js';
import { OfferRepository } from '../../src/offer/offerRepository.js';
import { SQLError } from '../../src/errors/errorTypes/SQLError.js';

describe('InventoryRepositoryGetUserItems', () => {
  let mockConnection;
  let offerRepository;

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

  beforeEach(() => {
    mockConnection = {
      executeQuery: vi.fn()
    };
    offerRepository = new OfferRepository({ mySQLConnection: mockConnection });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should be able to return the full array of the offers', async () => {
    // arrange
    mockConnection.executeQuery
      .mockImplementationOnce(() => Promise.resolve(offers));

    // act
    const res = await offerRepository.getOffers();

    // assert
    expect(res).toEqual(offers);
    expect(mockConnection.executeQuery).toBeCalledTimes(1);
  });

  it('should reject with an error if the connection return a error', async () => {
    // arrange
    mockConnection.executeQuery
      .mockImplementationOnce(() => {
        throw new SQLError(FAILED_GETTING);
      });

    // act & assert

    await expect(offerRepository.getOffers()).rejects.toMatchObject({
      message: `${FAILED_GETTING}: ${OFFERS}`
    });
  });
});
