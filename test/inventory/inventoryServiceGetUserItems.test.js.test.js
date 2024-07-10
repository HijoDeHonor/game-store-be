import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InventoryRepository } from '../../inventory/inventoryRepository.js';
import { FAILED_GETTING_ERROR, INVENTORY, TEST_USER_ID } from '../../utils/textConstants.js';
import { InventoryService } from '../../inventory/inventoryService.js';
import { FailedGettingError } from '../../errors/errorTypes/failedGettingError.js';

describe('inventoryServiceGetUserItems', () => {
  let inventoryRepositoryMock;
  let inventoryService;

  beforeEach(() => {
    inventoryRepositoryMock = vi.spyOn(InventoryRepository.prototype, 'getBy');
    inventoryService = new InventoryService({ inventoryRepository: new InventoryRepository({ mySQLConnection: {} }) });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should throw FailedGettingError if the return of the repository is undefined', async () => {
    // ARRANGE
    inventoryRepositoryMock.mockResolvedValue(undefined);
    const id = TEST_USER_ID;

    // ACT & ASSERT
    await expect(inventoryService.getAll(id)).rejects.toThrow(FailedGettingError);
    await expect(inventoryService.getAll(id)).rejects.toMatchObject({
      name: FAILED_GETTING_ERROR,
      entity: INVENTORY
    });
  });

  it('should be able to return an empty array if it is the return of the repository', async () => {
    // ARRANGE
    inventoryRepositoryMock.mockResolvedValue([]);
    const id = TEST_USER_ID;

    // ACT
    const res = await inventoryService.getAll(id);

    // ASSERT
    expect(res).toEqual([]);
  });

  it('should be able to return the list of items that the user has', async () => {
    // ARRANGE
    inventoryRepositoryMock.mockResolvedValue([
      { Id: 1, Name: 'Espada', Quantity: 4, Img: 'https://cdn-icons-png.freepik.com/256/11858/11858642.png?uid=R125020544&ga=GA1.1.297410512.1711637426&' },
      { Id: 2, Name: 'Arco', Quantity: 7, Img: 'https://cdn-icons-png.freepik.com/256/9728/9728024.png?uid=R125020544&ga=GA1.1.297410512.1711637426&' }]);
    const id = TEST_USER_ID;

    // ACT
    const res = await inventoryService.getAll(id);

    // ASSERT
    expect(res).toEqual([
      { Id: 1, Name: 'Espada', Quantity: 4, Img: 'https://cdn-icons-png.freepik.com/256/11858/11858642.png?uid=R125020544&ga=GA1.1.297410512.1711637426&' },
      { Id: 2, Name: 'Arco', Quantity: 7, Img: 'https://cdn-icons-png.freepik.com/256/9728/9728024.png?uid=R125020544&ga=GA1.1.297410512.1711637426&' }]);
  });
});
