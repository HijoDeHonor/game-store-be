import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OfferRepository } from '../../../src/offer/offerRepository.js';
import { HAS_BEEN_DELETE, HAS_NOT_BEEN_DELETE, TEST_ID_OFFER } from '../../../src/utils/textConstants.js';

describe('offerRepositoryDelete', () => {
  let mockConnection;
  let offerRepository;
  const rowsPositive = {
    affectedRows: 3,
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

  it('Should be able to return an object with some rows afected and a success true', async () => {
    // arrange
    mockConnection.executeQuery
      .mockResolvedValue(rowsPositive);
    // act
    const res = await offerRepository.deleteOffer(id);
    // assert
    expect(res).toMatchObject({
      success: true,
      message: HAS_BEEN_DELETE,
      rows: 3
    });
  });

  it('should be able to return an object with no rows afected and a success false', async () => {
    // arrange
    mockConnection.executeQuery
      .mockResolvedValue(rowsNegative);
    // act
    const res = await offerRepository.deleteOffer(id);
    console.log(res);
    // assert
    expect(res).toMatchObject({
      success: false,
      message: HAS_NOT_BEEN_DELETE,
      rows: 0
    });
  });
});
