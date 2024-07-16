import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OfferRepository } from '../../../src/offer/offerRepository.js';
import { TEST_ID_OFFER } from '../../../src/utils/textConstants.js';
import { OfferService } from '../../../src/offer/offerService.js';
import { FailedToDeleteError } from '../../../src/errors/ErrorTypes/failedToDeleteError.js';

describe('offerServiceDelete', () => {
  let offerRepositoryMock;
  let offerService;
  const id = TEST_ID_OFFER;
  const rowsPositive = {
    affectedRows: 3,
    success: true
  };
  const rowsNegative = {
    affectedRows: 0,
    success: false
  };

  beforeEach(() => {
    offerRepositoryMock = vi.spyOn(OfferRepository.prototype, 'deleteOffer');
    offerService = new OfferService({ offerRepository: new OfferRepository({ mySQLConnection: {} }) });
  });
  afterEach(() => {
    vi.resetAllMocks();
  });
  it('should be able to return a object whit some rows afected and a success message', async () => {
    // arrange
    offerRepositoryMock.mockResolvedValue(rowsPositive);
    // act
    const res = await offerService.deleteOffer(id);
    // assert
    expect(res).toEqual(rowsPositive);
  });

  it('should be able to return an error if the success message is false', async () => {
    // arrange
    offerRepositoryMock.mockResolvedValue(rowsNegative);
    // act & assert
    await expect(offerService.deleteOffer(id)).rejects.toThrow(FailedToDeleteError);
  });
});
