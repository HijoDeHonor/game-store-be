import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { app } from '../../index.js';
import request from 'supertest';
import { InventoryRepository } from '../../inventory/inventoryRepository.js';
import { INVALID_DATA, INVALID_DATA_ERROR, INVENTORY, TEST_USER_ID } from '../../utils/textConstants.js';

describe('InventoryControllerGetUserItems', () => {
  let inventoryRepositoryMock;

  beforeEach(() => {
    inventoryRepositoryMock = vi.spyOn(InventoryRepository.prototype, 'getBy');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should throw an error if no id is given be req.params ', async () => {
    // ARRANGE
    // ACT
    const res = await request(app).get('/inventory/');
    // ASSERT
    expect(res.status).toBe(400);
    expect(res.body).toMatchObject(
      {
        name: INVALID_DATA_ERROR,
        entity: INVENTORY,
        message: INVALID_DATA
      });
  });

  it('should be able to return an array even if it is empty', async () => {
    // ARRANGE
    const rows = [];
    inventoryRepositoryMock
      .mockImplementationOnce(() => Promise.resolve(rows));
    // ACT
    const res = await request(app).get(`/inventory/${TEST_USER_ID}`);
    // ASSERT
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should be able to return an array with the items that the user has', async () => {
    // ARRANGE
    const rows = [
      { Id: 1, Name: 'Espada', Quantity: 4, Img: 'https://cdn-icons-png.freepik.com/256/11858/11858642.png?uid=R125020544&ga=GA1.1.297410512.1711637426&' },
      { Id: 2, Name: 'Arco', Quantity: 7, Img: 'https://cdn-icons-png.freepik.com/256/9728/9728024.png?uid=R125020544&ga=GA1.1.297410512.1711637426&' }];

    inventoryRepositoryMock
      .mockImplementationOnce(() => Promise.resolve(rows));

    // ACT
    const res = await request(app).get(`/inventory/${TEST_USER_ID}`);
    // ASSERT
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { Id: 1, Name: 'Espada', Quantity: 4, Img: 'https://cdn-icons-png.freepik.com/256/11858/11858642.png?uid=R125020544&ga=GA1.1.297410512.1711637426&' },
      { Id: 2, Name: 'Arco', Quantity: 7, Img: 'https://cdn-icons-png.freepik.com/256/9728/9728024.png?uid=R125020544&ga=GA1.1.297410512.1711637426&' }]);
  });
});
