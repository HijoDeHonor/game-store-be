import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { app } from '../../../index.js';
import { InventoryRepository } from '../../../src/inventory/inventoryRepository.js';
import { FailedGettingError } from '../../../src/errors/errorTypes/failedGettingError.js';
import { FAILED_GETTING, FAILED_GETTING_ERROR, INVENTORY } from '../../../src/utils/textConstants.js';

describe('serverInvetonryControllerGetItems', () => {
  let inventoryRepositoryMock;

  beforeEach(() => {
    inventoryRepositoryMock = vi.spyOn(InventoryRepository.prototype, 'getServerItems');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be able to return a full array with all the item in the server list', async () => {
    // ARRANGE
    const items = [
      { Id: 1, Name: 'Espada', Quantity: 0, Img: 'https://cdn-icons-png.freepik.com/256/11858/11858642.png?uid=R125020544&ga=GA1.1.297410512.1711637426&' },
      { Id: 2, Name: 'Arco', Quantity: 0, Img: 'https://cdn-icons-png.freepik.com/256/9728/9728024.png?uid=R125020544&ga=GA1.1.297410512.1711637426&' }];
    inventoryRepositoryMock.mockImplementationOnce(() => Promise.resolve(items));
    // ACT
    const res = await request(app)
      .get('/inventory/server/items');
    // ASSERT
    expect(res.status).toBe(200);
    expect(res.body).toEqual(items);
  });

  it('should reject with an error if the return of the repository is undefind or empty', async () => {
    // ARRANGE
    inventoryRepositoryMock.mockImplementationOnce(() => {
      throw new FailedGettingError(FAILED_GETTING, INVENTORY);
    });
    // ACT
    const res = await request(app)
      .get('/inventory/server/items');
    // ASSERT
    expect(res.body).toMatchObject({
      name: FAILED_GETTING_ERROR,
      entity: INVENTORY
    });
  });
});
