import { FailedAddingError } from '../errors/ErrorTypes/failedAddingError.js';
import { InvalidDataError } from '../errors/errorTypes/invalidDataError.js';
import { INVALID_DATA, INVENTORY, FAILED_ADDING, FAILED_DELETING } from '../utils/textConstants.js';

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

  removeItemToUser = async (userName, itemName, quantity) => {
    if (!userName || !itemName || !quantity) {
      throw new InvalidDataError(INVALID_DATA, INVENTORY);
    }
    // verify the user existence.
    await this.userRepository.getBy(userName);

    // recover the item quantity.
    const userHas = await this.inventoryRepository.getQuantity(userName, itemName, quantity);

    // if the user does not have enough throws an error.
    if (userHas < quantity) {
      throw new InvalidDataError(FAILED_DELETING, INVENTORY);
    } else if (userHas === quantity) {
      // if the user has the same quantity proceed to delete the item from his inventory.
      await this.inventoryRepository.deleteItem(userName, itemName);
      return;
    }
    // if the user has more, just remove the quantity given by params.
    const updateQuantity = userHas - quantity;
    await this.inventoryRepository.removeItemToUser(userName, itemName, updateQuantity);
  };
}
