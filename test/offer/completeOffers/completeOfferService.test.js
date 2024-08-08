import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OfferRepository } from '../../../src/offer/offerRepository.js';
import { OfferService } from '../../../src/offer/offerService.js';
import { TEST_ID_OFFER, TEST_ITEM, TEST_ITEM2, TEST_USERNAME } from '../../../src/utils/textConstants.js';
import { InvalidDataError } from '../../../src/errors/errorTypes/invalidDataError.js';
import { DoesNotExistError } from '../../../src/errors/errorTypes/doesNotExistError.js';
import { InventoryRepository } from '../../../src/inventory/inventoryRepository.js';
import { UserRepository } from '../../../src/users/userRepository.js';

const id = TEST_ID_OFFER;
const userName = TEST_USERNAME;
const offerItems = [{ name: TEST_ITEM, Quantity: 5 }];
const requestItems = [{ name: TEST_ITEM2, Quantity: 2 }];
const validOffer = { offerItems, requestItems };

describe('OfferServiceComplete', () => {
  let offerRepositoryMock;
  let inventoryRepositoryMock;
  let userRepositoryMock;
  let offerService;
  let offerRepositoryGOMock;
  let transactionmock;

  beforeEach(() => {
    userRepositoryMock = vi.spyOn(UserRepository.prototype, 'exist');
    inventoryRepositoryMock = vi.spyOn(InventoryRepository.prototype, 'getQuantities');
    offerRepositoryGOMock = vi.spyOn(OfferRepository.prototype, 'getOffer');
    offerRepositoryMock = vi.spyOn(OfferRepository.prototype, 'complete');
    transactionmock = vi.spyOn(OfferRepository.prototype, 'trasnferItemsAndcompleteOffer');
    offerService = new OfferService({
      offerRepository: new OfferRepository({ mySQLConnection: {} }),
      inventoryRepository: new InventoryRepository({ mySQLConnection: {} }),
      userRepository: new UserRepository({ mySQLConnection: {} })
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should throw an error if no id or userNameTrader is given as parameter', async () => {
    await expect(offerService.complete(id)).rejects.toThrow(InvalidDataError);
    await expect(offerService.complete(userName)).rejects.toThrow(InvalidDataError);
    await expect(offerService.complete()).rejects.toThrow(InvalidDataError);
    await expect(offerService.complete(id, '')).rejects.toThrow(InvalidDataError);
    await expect(offerService.complete('', userName)).rejects.toThrow(InvalidDataError);
  });

  it('should throw an error if the userNameTrader does not exist', async () => {
    offerRepositoryGOMock.mockResolvedValueOnce(validOffer);
    userRepositoryMock.mockResolvedValueOnce(false);

    await expect(offerService.complete(id, userName)).rejects.toThrow(DoesNotExistError);
  });

  it('should throw an error if the trader does not have enough quantities of the request items', async () => {
    offerRepositoryGOMock.mockResolvedValueOnce(validOffer);
    userRepositoryMock.mockResolvedValueOnce(true);
    inventoryRepositoryMock.mockResolvedValueOnce([{ name: TEST_ITEM2, Quantity: 1 }]);

    await expect(offerService.complete(id, userName)).rejects.toThrow(InvalidDataError);
  });

  it('should complete the offer successfully', async () => {
    offerRepositoryGOMock.mockResolvedValueOnce(validOffer);
    userRepositoryMock.mockResolvedValueOnce(true);
    inventoryRepositoryMock.mockResolvedValueOnce([{ name: TEST_ITEM2, Quantity: 3 }]);
    transactionmock.mockResolvedValueOnce();

    await expect(offerService.complete(id, userName)).resolves.not.toThrow();
    expect(transactionmock).toHaveBeenCalled();
  });
});
