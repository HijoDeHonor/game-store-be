import { FailedAddingError } from '../errors/ErrorTypes/failedAddingError.js';
import { InvalidDataError } from '../errors/errorTypes/invalidDataError.js';
import { INVALID_DATA, INVENTORY, FAILED_ADDING } from '../utils/textConstants.js';

export class InventoryService {
  constructor ({ inventoryRepository }) {
    this.inventoryRepository = inventoryRepository;
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

  addItemToUser = async (userName, item, quantity) => {
    if (!userName || !item || !quantity) {
      throw new InvalidDataError(INVALID_DATA, INVENTORY);
    }
    const isAdded = await this.inventoryRepository.addItemToUser(userName, item, quantity);
    if (!isAdded) {
      throw new FailedAddingError(FAILED_ADDING, INVENTORY);
    }
  };
}
