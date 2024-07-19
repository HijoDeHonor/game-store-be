import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InventoryRepository } from '../../../../src/inventory/inventoryRepository.js';
import { TEST_ITEM, TEST_USERNAME } from '../../../../src/utils/textConstants.js';

describe('InventoryRepositoryRemove', () => {
  let mockConnection;
  let inventoryRepository;

  const Quantity = { quantity: 10 };

  beforeEach(() => {
    mockConnection = {
      executeQuery: vi.fn()
    };
    inventoryRepository = new InventoryRepository({ mySQLConnection: mockConnection });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should remove an item and return true when quantity matches', async () => {
    // arrange
    const quantity = { Quantity: 5 };
    mockConnection.executeQuery
      .mockResolvedValueOnce([quantity])
      .mockResolvedValueOnce({ affectedRows: 1 });

    // act
    const res = await inventoryRepository.removeItemToUser(TEST_USERNAME, TEST_ITEM, Quantity);

    // assert
    expect(res).toBe(true);
  });

  it('should update item quantity and return true when quantity is less', async () => {
    // arrange
    const quantity = { Quantity: 5 };
    mockConnection.executeQuery
      .mockResolvedValueOnce([quantity])
      .mockResolvedValueOnce({ affectedRows: 1 });

    // act
    const res = await inventoryRepository.removeItemToUser(TEST_USERNAME, TEST_ITEM, 2);

    // assert
    expect(res).toBe(true);
  });

  it('should return false if item quantity is insufficient', async () => {
    // arrange
    const quantity = { Quantity: 1 };
    mockConnection.executeQuery.mockResolvedValueOnce(quantity);

    // act
    const res = await inventoryRepository.removeItemToUser(TEST_USERNAME, TEST_ITEM, 2);

    // assert
    expect(res).toBe(false);
  });

  it('should return false if item does not exist', async () => {
    // arrange
    mockConnection.executeQuery.mockResolvedValueOnce([]);

    // act
    const res = await inventoryRepository.removeItemToUser(TEST_USERNAME, TEST_ITEM, 1);

    // assert
    expect(res).toBe(false);
  });
});
