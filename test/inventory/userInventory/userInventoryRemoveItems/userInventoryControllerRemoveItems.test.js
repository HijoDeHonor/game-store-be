import { beforeEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import { InventoryService } from '../../../../src/inventory/inventoryService.js';
import { InventoryController } from '../../../../src/inventory/inventoryController.js';
import { REMOVE_SUCCESS, TEST_ITEM, TEST_USERNAME } from '../../../../src/utils/textConstants.js';
import supertest from 'supertest';
const mockInventoryRepository = {
  removeItemFromUser: vi.fn(),
  getQuantitys: vi.fn(),
  deleteItem: vi.fn()
};
const mockUserRepository = {
  getBy: vi.fn()
};

const app = express();
app.use(express.json());

describe('UserControllerRemove', () => {
  let controller;

  beforeEach(() => {
    mockUserRepository.getBy.mockReset();
    mockInventoryRepository.getQuantitys.mockReset();
    mockInventoryRepository.removeItemFromUser.mockReset();
    const inventoryService = new InventoryService({ inventoryRepository: mockInventoryRepository, userRepository: mockUserRepository });
    controller = new InventoryController({ inventoryService });

    app.delete('/inventory/users/:userName/', controller.removeItems);
  });

  it('should remove an item if the user has more than the quantity to remove', async () => {
    // arrange
    mockUserRepository.getBy.mockResolvedValue(true);
    mockInventoryRepository.getQuantitys.mockResolvedValue([
      { itemName: TEST_ITEM, quantity: 6 }
    ]);
    mockInventoryRepository.removeItemFromUser.mockResolvedValue(true);
    // act
    const res = await supertest(app).delete(`/inventory/users/${TEST_USERNAME}`)
      .send([{
        itemName: TEST_ITEM,
        quantity: 5
      }]);
    // assert
    expect(res.status).toBe(200);
    expect(res.body).toBe(REMOVE_SUCCESS);
    expect(mockInventoryRepository.removeItemFromUser).toHaveBeenCalledWith(TEST_USERNAME, TEST_ITEM, 1);
  });

  it('should delete an item if the user has the same amount', async () => {
    // arrange
    mockUserRepository.getBy.mockResolvedValue(true);
    mockInventoryRepository.getQuantitys.mockResolvedValue([
      { itemName: TEST_ITEM, quantity: 5 }
    ]);
    mockInventoryRepository.deleteItem.mockResolvedValue(true);
    // act
    const res = await supertest(app).delete(`/inventory/users/${TEST_USERNAME}`)
      .send([{
        itemName: TEST_ITEM,
        quantity: 5
      }]);
    // assert
    expect(res.status).toBe(200);
    expect(res.body).toBe(REMOVE_SUCCESS);
    expect(mockInventoryRepository.deleteItem).toHaveBeenCalledWith(TEST_USERNAME, TEST_ITEM);
  });
});
