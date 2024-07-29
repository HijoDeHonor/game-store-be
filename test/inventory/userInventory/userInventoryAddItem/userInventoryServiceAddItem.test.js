import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InventoryRepository } from '../../../../src/inventory/inventoryRepository.js';
import { InventoryService } from '../../../../src/inventory/inventoryService.js';
import { TEST_ITEM, TEST_USERNAME } from '../../../../src/utils/textConstants.js';
import { InvalidDataError } from '../../../../src/errors/errorTypes/invalidDataError.js';
import { FailedAddingError } from '../../../../src/errors/ErrorTypes/failedAddingError.js';

describe('inventoryServiceAddItem', () => {
  let inventoryRepositoryMock;
  let inventoryService;

  beforeEach(() => {
    inventoryRepositoryMock = vi.spyOn(InventoryRepository.prototype, 'addItemToUser');
    inventoryService = new InventoryService({ inventoryRepository: new InventoryRepository({ mySQLConnection: {} }) });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should ', async () => {
    // arrange
    inventoryRepositoryMock.mockResolvedValue(true);
    // act
    await expect(inventoryService.addItemToUser(TEST_USERNAME, TEST_ITEM, 1)).resolves.not.Throw();
    // assert
  });
  it('should throw InvalidDataError when data is invalid', async () => {
    // Act & Assert
    await expect(inventoryService.addItemToUser('', TEST_ITEM, 1)).rejects.toThrow(InvalidDataError);
    await expect(inventoryService.addItemToUser(TEST_USERNAME, '', 1)).rejects.toThrow(InvalidDataError);
    await expect(inventoryService.addItemToUser(TEST_USERNAME, TEST_ITEM, 0)).rejects.toThrow(InvalidDataError);
  });

  it('should throw FailedAddingError when adding fails', async () => {
    // Arrange
    inventoryRepositoryMock.mockResolvedValue(false);

    // Act & Assert
    await expect(inventoryService.addItemToUser(TEST_USERNAME, TEST_ITEM, 1)).rejects.toThrow(FailedAddingError);
  });
});
