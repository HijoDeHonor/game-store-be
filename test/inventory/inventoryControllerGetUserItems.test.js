import { describe, it, expect, beforeEach, vi } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import { InventoryController } from '../../inventory/inventoryController.js';

const mockInventoryService = {
  getAllUserItems: vi.fn()
};

const app = express();
app.use(express.json());

describe('InventoryController', () => {
  let controller;

  beforeEach(() => {
    mockInventoryService.getAllUserItems.mockReset();

    controller = new InventoryController({ inventoryService: mockInventoryService });

    app.get('/inventory/:id?', controller.getAllUserItems);
  });

  it('should be able to return an array with all the items that the user has', async () => {
    // ARRANGE
    const mockItems = [{ id: 1, name: 'item1' }, { id: 2, name: 'item2' }];
    mockInventoryService.getAllUserItems.mockResolvedValue(mockItems);

    // ACT
    const res = await supertest(app).get('/inventory/123').expect(200);

    // ASSERT
    expect(res.body).toEqual(mockItems);
    expect(mockInventoryService.getAllUserItems).toHaveBeenCalledWith('123');
  });

  it('should be able to return an empty array if the user has no items', async () => {
    // ARRANGE
    const mockItems = [];
    mockInventoryService.getAllUserItems.mockResolvedValue(mockItems);

    // ACT
    const res = await supertest(app).get('/inventory/123');

    // ASSERT
    expect(res.body).toEqual(mockItems);
    expect(mockInventoryService.getAllUserItems).toHaveBeenCalledWith('123');
  });

  it('');
});
