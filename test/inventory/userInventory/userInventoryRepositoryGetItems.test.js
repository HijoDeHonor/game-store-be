import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FAILED_GETTING_ERROR, INVENTORY, TEST_USERNAME } from '../../../src/utils/textConstants.js';
import { InventoryRepository } from '../../../src/inventory/inventoryRepository.js';
import { SQLError } from '../../../src/errors/errorTypes/SQLError.js';

describe('InventoryRepositoryGetUserItems', () => {
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

  it('should return an sqlerror if the consult to the db throw an error', async () => {
    // ARRANGE
    const userName = TEST_USERNAME;
    mockConnection.executeQuery
      .mockImplementationOnce(() => {
        throw SQLError;
      });
    // ACT & ASSERT
    await expect(inventoryRepository.getByUserName(userName)).rejects.toMatchObject({
      name: FAILED_GETTING_ERROR,
      entity: INVENTORY
    });
    expect(mockConnection.executeQuery).toBeCalled();
  });

  it('should be able to return an empty array if the user does not have any items', async () => {
    // ARRANGE
    const userName = TEST_USERNAME;
    const rows = [];
    mockConnection.executeQuery
      .mockResolvedValueOnce(rows);
    // ACT
    const res = await inventoryRepository.getByUserName(userName);

    // ASSERT
    expect(res).toEqual(rows);
    expect(mockConnection.executeQuery).toBeCalledTimes(1);
  });

  it('should be able to return the complete array of items that the user have', async () => {
    // ARRANGE
    const userName = TEST_USERNAME;
    const rows = [
      { Id: 1, Name: 'Espada', Quantity: 4, Img: 'https://cdn-icons-png.freepik.com/256/11858/11858642.png?uid=R125020544&ga=GA1.1.297410512.1711637426&' },
      { Id: 2, Name: 'Arco', Quantity: 7, Img: 'https://cdn-icons-png.freepik.com/256/9728/9728024.png?uid=R125020544&ga=GA1.1.297410512.1711637426&' }];
    mockConnection.executeQuery
      .mockResolvedValueOnce(rows);
    // ACT
    const res = await inventoryRepository.getByUserName(userName);

    // ASSERT
    expect(res).toEqual([
      { Id: 1, Name: 'Espada', Quantity: 4, Img: 'https://cdn-icons-png.freepik.com/256/11858/11858642.png?uid=R125020544&ga=GA1.1.297410512.1711637426&' },
      { Id: 2, Name: 'Arco', Quantity: 7, Img: 'https://cdn-icons-png.freepik.com/256/9728/9728024.png?uid=R125020544&ga=GA1.1.297410512.1711637426&' }]);
  });
});
