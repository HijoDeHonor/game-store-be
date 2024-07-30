import { beforeEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import supertest from 'supertest';
import { InventoryController } from '../../../../src/inventory/inventoryController.js';
import { TEST_USERNAME, TEST_ITEM, ADD_SUCCESS } from '../../../../src/utils/textConstants.js';
import { InventoryService } from '../../../../src/inventory/inventoryService.js';

const mockInventoryRepository = {
  addItemToUser: vi.fn()
};

const app = express();
app.use(express.json());

describe('InventoryControllerAddItem', () => {
  let controller;

  beforeEach(() => {
    mockInventoryRepository.addItemToUser.mockReset();
    const inventoryService = new InventoryService({ inventoryRepository: mockInventoryRepository });
    controller = new InventoryController({ inventoryService });

    app.post('/inventory/users/:userName?', controller.addItem);
  });

  it('should add the items', async () => {
    mockInventoryRepository.addItemToUser.mockResolvedValue(true);
    // ACT
    const res = await supertest(app).post(`/inventory/users/${TEST_USERNAME}`)
      .send({
        itemName: TEST_ITEM,
        quantity: 5
      });
    // ASSERT
    expect(res.status).toBe(200);
    expect(res.body).toEqual(ADD_SUCCESS);
    expect(mockInventoryRepository.addItemToUser).toHaveBeenCalledWith(TEST_USERNAME, TEST_ITEM, 5);
  });

  it('should throw whit an error if something goes wrong', async () => {
    // ACT
    const res = await supertest(app).post(`/inventory/users/${TEST_USERNAME}`)
      .send({
        itemName: TEST_ITEM
      });
    // ASSERT
    expect(res.status).toBe(500);
  });
});
