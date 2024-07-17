import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InventoryRepository } from '../../../src/inventory/inventoryRepository.js';
import { FailedGettingError } from '../../../src/errors/errorTypes/failedGettingError.js';
import { FAILED_GETTING_ERROR, INVENTORY } from '../../../src/utils/textConstants.js';

describe('ServerRespository', () => {
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
  it('should be able to return a full array with all the items on the server', async () => {
    // ARRANGE
    const rows = [
      { Id: 1, Name: 'Espada', Quantity: 0, Img: 'https://cdn-icons-png.freepik.com/256/11858/11858642.png?uid=R125020544&ga=GA1.1.297410512.1711637426&' },
      { Id: 2, Name: 'Arco', Quantity: 0, Img: 'https://cdn-icons-png.freepik.com/256/9728/9728024.png?uid=R125020544&ga=GA1.1.297410512.1711637426&' }];
    mockConnection.executeQuery
      .mockImplementationOnce(() => Promise.resolve(rows));

    // ACT
    const res = await inventoryRepository.getServerItems();

    // ASSERT
    expect(res).toEqual(rows);
  });
  it('should reject with an error if the return is an empty array', async () => {
    // ARRANGE
    const rows = [];
    mockConnection.executeQuery
      .mockResolvedValue(rows);

    // ACT
    await expect(inventoryRepository.getServerItems()).rejects.toThrow(FailedGettingError);

    // ASSERT
    await expect(inventoryRepository.getServerItems()).rejects.toMatchObject({
      name: FAILED_GETTING_ERROR,
      entity: INVENTORY
    });
  });
  it('should reject with an error if the return is undefined', async () => {
    const rows = undefined;
    mockConnection.executeQuery
      .mockResolvedValue(rows);

    // ACT
    await expect(inventoryRepository.getServerItems()).rejects.toThrow(FailedGettingError);

    // ASSERT
    await expect(inventoryRepository.getServerItems()).rejects.toMatchObject({
      name: FAILED_GETTING_ERROR,
      entity: INVENTORY
    });
  });
});
