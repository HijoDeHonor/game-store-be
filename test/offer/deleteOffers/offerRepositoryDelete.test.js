import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OfferRepository } from '../../../src/offer/offerRepository.js';
import { TEST_ID_OFFER } from '../../../src/utils/textConstants.js';

describe('offerRepositoryDelete', () => {
  let mockConnection;
  let offerRepository;
  const rowsPositive = {
    affectedRows: 1,
    success: true
  };
  const rowsNegative = {
    affectedRows: 0,
    success: false
  };
  const id = TEST_ID_OFFER;
  beforeEach(() => {
    mockConnection = {
      executeQuery: vi.fn()
    };
    offerRepository = new OfferRepository({ mySQLConnection: mockConnection });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Should be able to return true if the offer is deleted', async () => {
    // arrange
    mockConnection.executeQuery
      .mockResolvedValue(rowsPositive);
    // act
    const res = await offerRepository.deleteOffer(id);
    // assert
    expect(res).toBe(true);
  });

  it('should be able to return false if the offer is not deleted', async () => {
    // arrange
    mockConnection.executeQuery
      .mockResolvedValue(rowsNegative);
    // act
    const res = await offerRepository.deleteOffer(id);
    // assert
    expect(res).toBe(false);
  });
});
