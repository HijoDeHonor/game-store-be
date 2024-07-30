import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InventoryRepository } from '../../../../src/inventory/inventoryRepository.js';
import { UserRepository } from '../../../../src/users/userRepository.js';
import { InventoryService } from '../../../../src/inventory/inventoryService.js';
import { DOES_NOT_EXIST, TEST_ITEM, TEST_USERNAME, USERS } from '../../../../src/utils/textConstants.js';
import { InvalidDataError } from '../../../../src/errors/errorTypes/invalidDataError.js';
import { DoesNotExistError } from '../../../../src/errors/errorTypes/doesNotExistError.js';

describe('inventoryServiceRemoveItem', () =>
{
  const userName = TEST_USERNAME;
  const itemName = TEST_ITEM;
  const quantity = 5;

  const list = [{ itemName, quantity }];
  const list1 = { itemName, quantity };
  const list2 = [];

  let inventoryRepositoryRemoveItemMock;
  let inventoryRepositoryDeleteItem;
  let inventoryRepositoryGetQuantity;
  let userRepositoryGetBy;
  let inventoryService;
  beforeEach(() =>
  {
    userRepositoryGetBy = vi.spyOn(UserRepository.prototype, 'getBy');
    inventoryRepositoryGetQuantity = vi.spyOn(InventoryRepository.prototype, 'getQuantities');
    inventoryRepositoryRemoveItemMock = vi.spyOn(InventoryRepository.prototype, 'removeItemFromUser');
    inventoryRepositoryDeleteItem = vi.spyOn(InventoryRepository.prototype, 'deleteItem');
    inventoryService = new InventoryService({ inventoryRepository: new InventoryRepository({ mySQLConnection: {} }), userRepository: new UserRepository({ mySQLConnection: {} }) });
  });

  afterEach(() =>
  {
    vi.resetAllMocks();
  });

  it('should throw an error if any of the two parameters is missing', async () =>
  {
    // arrange

    // act & assert
    await expect(inventoryService.removeItemsFromUser(userName, list1)).rejects.toThrow(InvalidDataError);
    await expect(inventoryService.removeItemsFromUser(userName, list2)).rejects.toThrow(InvalidDataError);
    await expect(inventoryService.removeItemsFromUser('', list)).rejects.toThrow(InvalidDataError);
  });

  it('should throw an error if the user dont exist', async () =>
  {
    // arrange
    userRepositoryGetBy.mockImplementationOnce(() =>
    {
      throw new DoesNotExistError(DOES_NOT_EXIST, USERS);
    });

    // act & assert
    await expect(inventoryService.removeItemsFromUser(userName, list)).rejects.toThrow();
  });

  it('should throw an error if the user has less items', async () =>
  {
    // arrange
    userRepositoryGetBy.mockImplementationOnce(() => Promise.resolve(true));
    inventoryRepositoryGetQuantity.mockImplementationOnce(() => Promise.resolve([
      { itemName: TEST_ITEM, quantity: 4 }
    ]));

    // act
    await expect(inventoryService.removeItemsFromUser(userName, list)).rejects.toThrow(InvalidDataError);
  });

  it('should be able to remove the quantity if the user has more', async () =>
  {
    // arrange
    userRepositoryGetBy.mockImplementationOnce(() => Promise.resolve(true));
    inventoryRepositoryGetQuantity.mockImplementationOnce(() => Promise.resolve([
      { itemName: TEST_ITEM, quantity: 6 }
    ]));
    inventoryRepositoryRemoveItemMock.mockImplementationOnce(() => Promise.resolve());
    const updateQuantity = 1;
    // act & assert

    await expect(inventoryService.removeItemsFromUser(userName, list)).resolves.not.Throw();
    expect(inventoryRepositoryDeleteItem).toHaveBeenCalledTimes(0);
    expect(inventoryRepositoryRemoveItemMock).toHaveBeenCalledWith(userName, itemName, updateQuantity);
  });

  it('should be able to remove the item if has the same amount', async () =>
  {
    // arrange
    userRepositoryGetBy.mockImplementationOnce(() => Promise.resolve(true));
    inventoryRepositoryGetQuantity.mockImplementationOnce(() => Promise.resolve([
      { itemName: TEST_ITEM, quantity: 5 }
    ]));
    inventoryRepositoryDeleteItem.mockImplementationOnce(() => Promise.resolve());
    // act & assert

    await expect(inventoryService.removeItemsFromUser(userName, list)).resolves.not.Throw();
    expect(inventoryRepositoryDeleteItem).toHaveBeenCalledWith(userName, itemName);
    expect(inventoryRepositoryRemoveItemMock).toHaveBeenCalledTimes(0);
  });
});
