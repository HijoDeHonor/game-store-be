import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OfferRepository } from '../../../src/offer/offerRepository.js';
import { TEST_ID_OFFER, TEST_ITEM, TEST_USERNAME } from '../../../src/utils/textConstants.js';
import { OfferService } from '../../../src/offer/offerService.js';
import { FailedToDeleteError } from '../../../src/errors/errorTypes/failedToDeleteError.js';
import { InvalidDataError } from '../../../src/errors/errorTypes/invalidDataError.js';

describe('offerServiceDelete', () => {
  let getOfferRepositoryMock;
  let offerService;
  let addandDeleteMock;

  const id = TEST_ID_OFFER;
  const userNamePoster = TEST_USERNAME;
  const offerItems = { itemName: TEST_ITEM, quantity: 1 };

  beforeEach(() => {
    getOfferRepositoryMock = vi.spyOn(OfferRepository.prototype, 'getOffer');
    addandDeleteMock = vi.spyOn(OfferRepository.prototype, 'addItemsAndDeleteOffer');
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
    getOfferRepositoryMock.mockResolvedValue([{ userNamePoster, offerItems }]);
    addandDeleteMock.mockResolvedValue(true);
    // act & assert
    await expect(offerService.deleteOffer(id, offerItems, userNamePoster)).resolves.not.toThrow();
  });

  it('should return an error if the success message is false', async () => {
  // arrange
    getOfferRepositoryMock.mockResolvedValue([{ userNamePoster, offerItems }]);
    addandDeleteMock.mockResolvedValue(false);
    // act & assert
    await expect(offerService.deleteOffer(id, offerItems, userNamePoster)).rejects.toThrow(FailedToDeleteError);
  });
});
