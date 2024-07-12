import { InvalidDataError } from '../errors/errorTypes/invalidDataError.js';
import { INVALID_DATA, INVENTORY } from '../utils/textConstants.js';

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
}
