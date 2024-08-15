import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OfferRepository } from '../../../src/offer/offerRepository.js';
import { OfferService } from '../../../src/offer/offerService.js';
import { FAILED_GETTING, INVENTORY, TEST_ID_OFFER, TEST_ITEM, TEST_ITEM2, TEST_USERNAME } from '../../../src/utils/textConstants.js';
import { InvalidDataError } from '../../../src/errors/errorTypes/invalidDataError.js';
import { FailedCreatingError } from '../../../src/errors/errorTypes/failedCreatingError.js';
import { InventoryRepository } from '../../../src/inventory/inventoryRepository.js';
import { InventoryService } from '../../../src/inventory/inventoryService.js';

const offer = [{
  name: TEST_ITEM,
  Quantity: 5
}];

const request = [{
  name: TEST_ITEM2,
  Quantity: 2
}];

const id = TEST_ID_OFFER;

describe('OfferServiceCreate', () => {
  let offerRepositoryMock;
  let inventoryRepositoryMock;
  let offerService;
  let inventoryServiceMock;

  beforeEach(() => {
    inventoryRepositoryMock = vi.spyOn(InventoryRepository.prototype, 'getQuantities');
    offerRepositoryMock = vi.spyOn(OfferRepository.prototype, 'create');

    const inventoryServiceInstance = new InventoryService({ inventoryRepository: new InventoryRepository({ mySQLConnection: {} }) });

    // Crea un mock manualmente en la instancia
    inventoryServiceMock = vi.spyOn(inventoryServiceInstance, 'removeItemsFromUser').mockResolvedValue(true);

    offerService = new OfferService({
      offerRepository: new OfferRepository({ mySQLConnection: {} }),
      inventoryRepository: new InventoryRepository({ mySQLConnection: {} }),
      inventoryService: inventoryServiceInstance
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should throw InvalidDataError when one of the parameters is missing', async () => {
    // act & assert
    await expect(offerService.create(id, TEST_USERNAME, offer, '')).rejects.toThrow(InvalidDataError);
    await expect(offerService.create(id, '', offer, request)).rejects.toThrow(InvalidDataError);
    await expect(offerService.create(id, TEST_USERNAME, '', request)).rejects.toThrow(InvalidDataError);
    await expect(offerService.create('', TEST_USERNAME, offer, request)).rejects.toThrow(InvalidDataError);
  });

  it('should reject with FailedCreatingError when the call to inventoryRepository fails', async () => {
    // arrange
    inventoryRepositoryMock.mockImplementationOnce(() => {
      throw new FailedCreatingError(FAILED_GETTING, INVENTORY);
    });
    // act & assert
    await expect(offerService.create(TEST_USERNAME, offer, request, id)).rejects.toThrow(FailedCreatingError);
  });

  it('should throw InvalidDataError if Quantity isn’t enough to cover the offer', async () => {
    // arrange
    inventoryRepositoryMock.mockResolvedValueOnce([{ name: TEST_ITEM, Quantity: 4 }]);
    // act & assert
    await expect(offerService.create(id, TEST_USERNAME, offer, request)).rejects.toThrow(InvalidDataError);
  });

  it('should create offer successfully when all conditions are met', async () => {
    // arrange
    inventoryRepositoryMock.mockResolvedValueOnce([{ name: TEST_ITEM, Quantity: 10 }]);
    offerRepositoryMock.mockResolvedValueOnce(true);
    inventoryServiceMock.mockResolvedValueOnce();

    // act & assert
    await expect(offerService.create(id, TEST_USERNAME, offer, request)).resolves.not.throw();

    expect(inventoryRepositoryMock).toHaveBeenCalledWith(TEST_USERNAME, offer);
    expect(offerRepositoryMock).toHaveBeenCalledWith(id, TEST_USERNAME, offer, request);
  });

  it('should throw FailedCreatingError if offer creation fails', async () => {
    // arrange
    inventoryRepositoryMock.mockResolvedValueOnce([{ name: TEST_ITEM, Quantity: 10 }]);
    offerRepositoryMock.mockResolvedValueOnce(false);
    // act & assert
    await expect(offerService.create(id, TEST_USERNAME, offer, request)).rejects.toThrow(FailedCreatingError);
  });
});
