import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InventoryService } from '../../../../src/inventory/inventoryService.js';
import { InventoryRepository } from '../../../../src/inventory/inventoryRepository.js';
import { TEST_ITEM, TEST_USERNAME } from '../../../../src/utils/textConstants.js';
import { InvalidDataError } from '../../../../src/errors/errorTypes/invalidDataError.js';
import { FailedToDeleteError } from '../../../../src/errors/ErrorTypes/failedToDeleteError.js';

describe('UserInventoryServiceRemove', () => {
  let inventoryRepositoryMock;
  let inventoryService;
  beforeEach(() => {
    inventoryRepositoryMock = vi.spyOn(InventoryRepository.prototype, 'removeItemToUser');
    inventoryService = new InventoryService({ inventoryRepository: new InventoryRepository({ mySQLConnection: {} }) });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should remove an item based on the parameters given', async () => {
    // arrange
    inventoryRepositoryMock.mockResolvedValue(true);
    // act & assert
    await expect(inventoryService.removeItemToUser(TEST_USERNAME, TEST_ITEM, 5)).resolves.not.toThrow();
  });

  it('should rejects with a invalidDataError if any of the parameters are misssing', async () => {
    // arrange
    // act
    await expect(inventoryService.removeItemToUser('', TEST_ITEM, 1)).rejects.toThrow(InvalidDataError);
    await expect(inventoryService.removeItemToUser(TEST_USERNAME, '', 1)).rejects.toThrow(InvalidDataError);
    await expect(inventoryService.removeItemToUser(TEST_USERNAME, TEST_ITEM, '')).rejects.toThrow(InvalidDataError);
  });

  it('should reject with a failedDelettingError if the return is false', async () => {
    // arrange
    inventoryRepositoryMock.mockResolvedValue(false);
    // act
    await expect(inventoryService.removeItemToUser(TEST_USERNAME, TEST_ITEM, 1)).rejects.toThrow(FailedToDeleteError);
  });
});
