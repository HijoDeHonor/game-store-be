import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FAILED_ADDING_ERROR, INVENTORY, TEST_ITEM, TEST_USERNAME } from '../../../../src/utils/textConstants.js';
import { InventoryRepository } from '../../../../src/inventory/inventoryRepository.js';
import { SQLError } from '../../../../src/errors/errorTypes/SQLError.js';

describe('InventoryRepositoryAddItem', () => {
  let mockConnection;
  let inventoryRepository;

  beforeEach(() => {
    mockConnection = {
      executeQuery: vi.fn()
    };
    inventoryRepository = new InventoryRepository({ mySQLConnection: mockConnection });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be able to return a boolean true if can add the item', async () => {
    // arrange
    mockConnection.executeQuery
      .mockImplementationOnce(() => Promise.resolve([1]));
    // act
    const res = await inventoryRepository.addItemToUser(TEST_USERNAME, TEST_ITEM, 5);
    // assert
    expect(res).toBe(true);
  });

  it('should be able to return a boolean false if cant add the item', async () => {
    // arrange
    mockConnection.executeQuery
      .mockImplementationOnce(() => Promise.resolve([]));
    // act
    const res = await inventoryRepository.addItemToUser(TEST_USERNAME, TEST_ITEM, 5);
    // assert
    expect(res).toBe(false);
  });

  it('should be able to reject with a sqlError if the executeQuery fail', async () => {
    // arrange
    mockConnection.executeQuery
      .mockImplementationOnce(() => {
        throw new SQLError(FAILED_ADDING_ERROR, INVENTORY);
      });
    // act & assert
    await expect(inventoryRepository.addItemToUser(TEST_USERNAME, TEST_ITEM, 7)).rejects.toThrow();
  });
});
