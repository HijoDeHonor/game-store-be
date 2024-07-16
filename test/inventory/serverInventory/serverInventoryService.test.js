import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InventoryRepository } from '../../../inventory/inventoryRepository.js';
import { InventoryService } from '../../../inventory/inventoryService.js';

describe('serverInvetonryServiceGetItems', () => {
  let inventoryRepositoryMock;
  let inventoryService;

  beforeEach(() => {
    inventoryRepositoryMock = vi.spyOn(InventoryRepository.prototype, 'getServerItems');
    inventoryService = new InventoryService({ inventoryRepository: new InventoryRepository({ mySQLConnection: {} }) });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should be able to return a full array with the list of items of the server', async () => {
    // ARRANGE
    const items = [
      { Id: 1, Name: 'Espada', Quantity: 0, Img: 'https://cdn-icons-png.freepik.com/256/11858/11858642.png?uid=R125020544&ga=GA1.1.297410512.1711637426&' },
      { Id: 2, Name: 'Arco', Quantity: 0, Img: 'https://cdn-icons-png.freepik.com/256/9728/9728024.png?uid=R125020544&ga=GA1.1.297410512.1711637426&' }];
    inventoryRepositoryMock.mockResolvedValue(items);

    // ACT
    const res = await inventoryService.getServerItems();
    // ASSERT
    expect(res).toEqual(items);
  });
});
