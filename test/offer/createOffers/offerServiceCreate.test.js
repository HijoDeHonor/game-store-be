import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OfferRepository } from '../../../src/offer/offerRepository.js';
import { OfferService } from '../../../src/offer/offerService.js';
import { TEST_ITEM, TEST_ITEM2, TEST_USERNAME } from '../../../src/utils/textConstants.js';
import { InvalidDataError } from '../../../src/errors/errorTypes/invalidDataError.js';
import { FailedCreatingError } from '../../../src/errors/errorTypes/failedCreatingError.js';

const offer = [{
  name: TEST_ITEM,
  Quantity: 5
}];

const request = [{
  name: TEST_ITEM2,
  Quantity: 2
}];

describe('OfferServiceCreate', () => {
  let offerRepositoryMock;
  let offerService;

  beforeEach(() => {
    offerRepositoryMock = vi.spyOn(OfferRepository.prototype, 'create');
    offerService = new OfferService({ offerRepository: new OfferRepository({ mySQLConnection: {} }) });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should be able to throw when one of the parameter is missing', async () => {
    // act & assert
    await expect(offerService.create(TEST_USERNAME, offer, '')).rejects.toThrow(InvalidDataError);
    await expect(offerService.create('', offer, request)).rejects.toThrow(InvalidDataError);
    await expect(offerService.create(TEST_USERNAME, '', request)).rejects.toThrow(InvalidDataError);
  });

  it('should be able to rejects whit error when the sql fails', async () => {
    // arrange
    offerRepositoryMock.mockImplementationOnce(() => Promise.resolve(false));

    // act
    await expect(offerService.create(TEST_USERNAME, offer, request)).rejects.toThrow(FailedCreatingError);
  });

  it('should be able to complete the offer creation on a sql success', async () => {
    // arrange
    offerRepositoryMock.mockImplementationOnce(() => Promise.resolve(true));
    // act
    await expect(offerService.create(TEST_USERNAME, offer, request)).resolves.not.Throw();
  });
});
