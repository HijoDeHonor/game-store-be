import { beforeEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import { InventoryService } from '../../../../src/inventory/inventoryService.js';
import { InventoryController } from '../../../../src/inventory/inventoryController.js';
import { REMOVE_SUCCESS, TEST_ITEM, TEST_USERNAME } from '../../../../src/utils/textConstants.js';
import supertest from 'supertest';

const mockInventoryRepository = {
  removeItemToUser: vi.fn()
};

const app = express();
app.use(express.json());

describe('UserControllerRemove', () => {
  let controller;

  beforeEach(() => {
    mockInventoryRepository.removeItemToUser.mockReset();
    const inventoryService = new InventoryService({ inventoryRepository: mockInventoryRepository });
    controller = new InventoryController({ inventoryService });

    app.post('/inventory/users/:userName/:item?', controller.removeItem);
  });

  it('should add an item', async () => {
    // arrange
    mockInventoryRepository.removeItemToUser.mockResolvedValue(true);
    // act
    const res = await supertest(app).post(`/inventory/users/${TEST_USERNAME}/${TEST_ITEM}`)
      .send({
        quantity: 5
      });
    // assert
    expect(res.status).toBe(200);
    expect(res.body).toBe(REMOVE_SUCCESS);
    expect(mockInventoryRepository.removeItemToUser).toHaveBeenCalledWith(TEST_USERNAME, TEST_ITEM, 5);
  });

  it('should reject with an error if quantity is missing from req.body', async () => {
    // arrange
    // act
    const res = await supertest(app).post(`/inventory/users/${TEST_USERNAME}/${TEST_ITEM}`);
    // assert
    expect(res.status).toBe(500);
  });
});
