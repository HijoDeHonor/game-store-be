import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DOES_NOT_EXIST, DOES_NOT_EXIST_ERROR, FAILED_GETTING_ERROR, INVENTORY, TEST_USER_ID, TEST_USERNAME } from '../../utils/textConstants.js';
import { InventoryRepository } from '../../inventory/inventoryRepository.js';
import { SQLError } from '../../errors/errorTypes/SQLError.js';

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

  it('should return an error if the id does not match whit any user', async () => {
    // ARRANGE
    const id = TEST_USER_ID;
    const userRows = [];
    mockConnection.executeQuery
      .mockResolvedValueOnce(userRows);
    // ACT & ASSERT
    await expect(inventoryRepository.getByUserId(id)).rejects.toMatchObject({
      name: DOES_NOT_EXIST_ERROR,
      entity: INVENTORY,
      message: DOES_NOT_EXIST
    });
    expect(mockConnection.executeQuery).toBeCalled();
  });

  it('should return an sqlerror if the consult to the db throw an error', async () => {
    // ARRANGE
    const id = TEST_USER_ID;
    mockConnection.executeQuery
      .mockImplementationOnce(() => {
        throw SQLError;
      });
    // ACT & ASSERT
    await expect(inventoryRepository.getByUserId(id)).rejects.toMatchObject({
      name: FAILED_GETTING_ERROR,
      entity: INVENTORY
    });
    expect(mockConnection.executeQuery).toBeCalled();
  });

  it('should be able to return an empty array if the user does not have any items', async () => {
    // ARRANGE
    const id = TEST_USER_ID;
    const userRows = [{ userName: TEST_USERNAME }];
    const rows = [];
    mockConnection.executeQuery
      .mockResolvedValueOnce(userRows)
      .mockResolvedValueOnce(rows);
    // ACT
    const res = await inventoryRepository.getByUserId(id);

    // ASSERT
    expect(res).toEqual(rows);
    expect(mockConnection.executeQuery).toBeCalledTimes(2);
  });

  it('should be able to return the complete array of items that the user have', async () => {
    // ARRANGE
    const id = TEST_USER_ID;
    const userRows = [{ TEST_USERNAME }];
    const rows = [
      { Id: 1, Name: 'Espada', Quantity: 4, Img: 'https://cdn-icons-png.freepik.com/256/11858/11858642.png?uid=R125020544&ga=GA1.1.297410512.1711637426&' },
      { Id: 2, Name: 'Arco', Quantity: 7, Img: 'https://cdn-icons-png.freepik.com/256/9728/9728024.png?uid=R125020544&ga=GA1.1.297410512.1711637426&' }];
    mockConnection.executeQuery
      .mockResolvedValueOnce(userRows)
      .mockResolvedValueOnce(rows);
    // ACT
    const res = await inventoryRepository.getByUserId(id);

    // ASSERT
    expect(res).toEqual([
      { Id: 1, Name: 'Espada', Quantity: 4, Img: 'https://cdn-icons-png.freepik.com/256/11858/11858642.png?uid=R125020544&ga=GA1.1.297410512.1711637426&' },
      { Id: 2, Name: 'Arco', Quantity: 7, Img: 'https://cdn-icons-png.freepik.com/256/9728/9728024.png?uid=R125020544&ga=GA1.1.297410512.1711637426&' }]);
  });
});
