import { DoesNotExistError } from '../errors/errorTypes/doesNotExistError.js';
import { FailedAddingError } from '../errors/errorTypes/failedAddingError.js';
import { InvalidDataError } from '../errors/errorTypes/invalidDataError.js';
import { INVALID_DATA, INVENTORY, FAILED_ADDING, FAILED_DELETING, DOES_NOT_EXIST, USERS } from '../utils/textConstants.js';

export class InventoryService {
  constructor ({ inventoryRepository, userRepository }) {
    this.inventoryRepository = inventoryRepository;
    this.userRepository = userRepository;
  }

  getAllUserItems = async (userName) => {
    if (!userName) {
      throw new InvalidDataError(INVALID_DATA, INVENTORY);
    };
    const items = await this.inventoryRepository.getByUserName(userName);
    return items;
  };

  getServerItems = async () => {
    const items = await this.inventoryRepository.getServerItems();
    return items;
  };

  addItemToUser = async (userName, itemName, quantity) => {
    if (!userName || !itemName || !quantity) {
      throw new InvalidDataError(INVALID_DATA, INVENTORY);
    }
    const isAdded = await this.inventoryRepository.addItemToUser(userName, itemName, quantity);
    if (!isAdded) {
      throw new FailedAddingError(FAILED_ADDING, INVENTORY);
    }
  };

  removeItemsFromUser = async (userName, list) => {
    if (!userName || !Array.isArray(list) || list.length === 0) {
      throw new InvalidDataError(INVALID_DATA, INVENTORY);
    }

    // Verify the user's existence.
    const exist = await this.userRepository.exist(userName);
    if (!exist) {
      throw new DoesNotExistError(DOES_NOT_EXIST, USERS);
    }
    // Retrieve the quantities of the items.
    const quantities = await this.inventoryRepository.getQuantities(userName, list);

    const pendingActions = [];
    // Process each item in the list.
    for (const item of list) {
      const { itemName, quantity } = item;
      if (!itemName || !quantity) {
        throw new InvalidDataError(INVALID_DATA, INVENTORY);
      }

      // Find the quantity of the item that the user has.
      const userHasItem = quantities.find(q => q.itemName === itemName);

      if (!userHasItem || userHasItem.quantity < quantity) {
        throw new InvalidDataError(FAILED_DELETING, INVENTORY);
      }
      if (userHasItem.quantity === quantity) {
        // If the user has the same quantity, delete the item from their inventory.
        pendingActions.push(() =>
          this.inventoryRepository.deleteItem(userName, itemName)
        );
      } else {
        // If the user has more, just remove the quantity given by the parameters.
        const updateQuantity = userHasItem.quantity - quantity;
        pendingActions.push(() =>
          this.inventoryRepository.removeItemFromUser(userName, itemName, updateQuantity)
        );
      }
    }
    for (const action of pendingActions) {
      await action();
    }
  };
}
