import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OfferRepository } from '../../../src/offer/offerRepository.js';
import { TEST_ID_OFFER } from '../../../src/utils/textConstants.js';
import { OfferService } from '../../../src/offer/offerService.js';
import { FailedToDeleteError } from '../../../src/errors/ErrorTypes/failedToDeleteError.js';
import { InvalidDataError } from '../../../src/errors/ErrorTypes/invalidDataError.js';

describe('offerServiceDelete', () => {
  let offerRepositoryMock;
  let offerService;
  const id = TEST_ID_OFFER;
  const rowsPositive = true;
  const rowsNegative = false;

  beforeEach(() => {
    offerRepositoryMock = vi.spyOn(OfferRepository.prototype, 'deleteOffer');
    offerService = new OfferService({ offerRepository: new OfferRepository({ mySQLConnection: {} }) });
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should trow an error if no id is pased as parameter', async () => {
    // arrange
    // act & expect
    await expect(offerService.deleteOffer()).rejects.toThrow(InvalidDataError);
  });

  it('should be able to delete an offer without throwing errors', async () => {
    // arrange
    offerRepositoryMock.mockResolvedValue(rowsPositive);
    // act & assert
    await expect(offerService.deleteOffer(id)).resolves.not.toThrow();
  });

  it('should be able to return an error if the success message is false', async () => {
    // arrange
    offerRepositoryMock.mockResolvedValue(rowsNegative);
    // act & assert
    await expect(offerService.deleteOffer(id)).rejects.toThrow(FailedToDeleteError);
  });
});
