import { FailedAddingError } from '../errors/ErrorTypes/failedAddingError.js';
import { FailedToDeleteError } from '../errors/ErrorTypes/failedToDeleteError.js';
import { InvalidDataError } from '../errors/errorTypes/invalidDataError.js';
import { INVALID_DATA, INVENTORY, FAILED_ADDING, FAILED_DELETING } from '../utils/textConstants.js';

export class InventoryService {
  constructor ({ inventoryRepository }) {
    this.inventoryRepository = inventoryRepository;
  }
  // server

  getServerItems = async () => {
    const items = await this.inventoryRepository.getServerItems();
    return items;
  };

  // users

  getAllUserItems = async (userName) => {
    if (!userName) {
      throw new InvalidDataError(INVALID_DATA, INVENTORY);
    };
    const items = await this.inventoryRepository.getByUserName(userName);
    return items;
  };

  addItemToUser = async (userName, item, quantity) => {
    if (!userName || !item || !quantity) {
      throw new InvalidDataError(INVALID_DATA, INVENTORY);
    }
    const isAdded = await this.inventoryRepository.addItemToUser(userName, item, quantity);
    if (!isAdded) {
      throw new FailedAddingError(FAILED_ADDING, INVENTORY);
    }
  };

  removeItemToUser = async (userName, item, quantity) => {
    if (!userName || !item || !quantity) {
      throw new InvalidDataError(INVALID_DATA, INVENTORY);
    }
    const isRemoved = await this.inventoryRepository.removeItemToUser(userName, item, quantity);
    if (!isRemoved) {
      throw new FailedToDeleteError(FAILED_DELETING, INVENTORY);
    }
  };
}
