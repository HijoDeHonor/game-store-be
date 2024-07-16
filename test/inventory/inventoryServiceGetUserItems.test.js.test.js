import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InventoryRepository } from '../../src/inventory/inventoryRepository.js';
import { InventoryService } from '../../src/inventory/inventoryService.js';
import { TEST_USERNAME } from '../../src/utils/textConstants.js';

describe('inventoryServiceGetUserItems', () => {
  let inventoryRepositoryMock;
  let inventoryService;

  beforeEach(() => {
    inventoryRepositoryMock = vi.spyOn(InventoryRepository.prototype, 'getByUserName');
    inventoryService = new InventoryService({ inventoryRepository: new InventoryRepository({ mySQLConnection: {} }) });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should be able to return an empty array if it is the return of the repository', async () => {
    // ARRANGE
    inventoryRepositoryMock.mockResolvedValue([]);
    const userName = TEST_USERNAME;

    // ACT
    const res = await inventoryService.getAllUserItems(userName);

    // ASSERT
    expect(res).toEqual([]);
  });

  it('should be able to return the list of items that the user has', async () => {
    // ARRANGE
    inventoryRepositoryMock.mockResolvedValue([
      { Id: 1, Name: 'Espada', Quantity: 4, Img: 'https://cdn-icons-png.freepik.com/256/11858/11858642.png?uid=R125020544&ga=GA1.1.297410512.1711637426&' },
      { Id: 2, Name: 'Arco', Quantity: 7, Img: 'https://cdn-icons-png.freepik.com/256/9728/9728024.png?uid=R125020544&ga=GA1.1.297410512.1711637426&' }]);
    const userName = TEST_USERNAME;

    // ACT
    const res = await inventoryService.getAllUserItems(userName);

    // ASSERT
    expect(res).toEqual([
      { Id: 1, Name: 'Espada', Quantity: 4, Img: 'https://cdn-icons-png.freepik.com/256/11858/11858642.png?uid=R125020544&ga=GA1.1.297410512.1711637426&' },
      { Id: 2, Name: 'Arco', Quantity: 7, Img: 'https://cdn-icons-png.freepik.com/256/9728/9728024.png?uid=R125020544&ga=GA1.1.297410512.1711637426&' }]);
  });
});
