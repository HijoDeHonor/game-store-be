import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InventoryRepository } from '../../../../src/inventory/inventoryRepository.js';
import { TEST_ITEM, TEST_USERNAME } from '../../../../src/utils/textConstants.js';

describe('userRepositoryRemoveItem', () => {
  const userName = TEST_USERNAME;
  const itemName = TEST_ITEM;
  const quantity = 5;
  let mySQLConnectionMock;
  let inventoryRepository;
  beforeEach(() => {
    mySQLConnectionMock = {
      executeQuery: vi.fn()
    };
    inventoryRepository = new InventoryRepository({ mySQLConnection: mySQLConnectionMock });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should be able to remove an item', async () => {
    // arrange
    mySQLConnectionMock.executeQuery.mockResolvedValueOnce({
      affectedRows: 1
    });
    // act
    const res = await inventoryRepository.removeItemToUser(userName, itemName, quantity);
    // arrange
    expect(res).toBe(true);
  });

  it('should reject whit an error if the sql fails', async () => {
    // arrange
    mySQLConnectionMock.executeQuery.mockResolvedValueOnce({
      affectedRows: 0
    });
    // act
    const res = await inventoryRepository.removeItemToUser(userName, itemName, quantity);
    // assert
    expect(res).toBe(false);
  });
});
