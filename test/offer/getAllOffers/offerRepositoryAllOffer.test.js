import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FAILED_GETTING, OFFERS } from '../../../src/utils/textConstants.js';
import { OfferRepository } from '../../../src/offer/offerRepository.js';
import { SQLError } from '../../../src/errors/errorTypes/SQLError.js';
import { executeQueryExampleFirstCall, executeQueryExampleParse, executeQueryExampleSecondCall, executeQueryExampleThirdCall } from './executeQueryExample.js';

describe('OfferRepositoryGetOffers', () => {
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

  it('should return the full array of offers', async () => {
    // Arrange
    mockConnection.executeQuery
      .mockImplementationOnce(() => Promise.resolve(executeQueryExampleFirstCall))
      .mockImplementationOnce(() => Promise.resolve(executeQueryExampleSecondCall))
      .mockImplementationOnce(() => Promise.resolve(executeQueryExampleThirdCall))
      .mockImplementationOnce(() => Promise.resolve([{ Counts: 11 }]));
    // Act
    const res = await offerRepository.getOffers('1');

    // Assert
    expect(res).toEqual(executeQueryExampleParse);
    expect(mockConnection.executeQuery).toBeCalledTimes(4);
  });

  it('should reject with an error if the connection returns an error', async () => {
    // Arrange
    mockConnection.executeQuery.mockImplementationOnce(() => {
      throw new SQLError(FAILED_GETTING);
    });

    // Act & Assert
    await expect(offerRepository.getOffers('1')).rejects.toMatchObject({
      message: `${FAILED_GETTING}: ${OFFERS}`
    });
  });
});
