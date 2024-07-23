import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FAILED_GETTING, OFFERS } from '../../../src/utils/textConstants.js';
import { OfferRepository } from '../../../src/offer/offerRepository.js';
import { SQLError } from '../../../src/errors/errorTypes/SQLError.js';
import { executeQueryExample, executeQueryExampleParse } from './executeQueryExample.js';
describe('InventoryRepositoryGetUserItems', () => {
  let mockConnection;
  let offerRepository;

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
      .mockImplementationOnce(() => Promise.resolve(executeQueryExample));

    // act
    const res = await offerRepository.getOffers();

    // assert
    expect(res).toEqual(executeQueryExampleParse);
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
