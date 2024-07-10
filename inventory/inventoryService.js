import { FailedGettingError } from '../errors/errorTypes/failedGettingError.js';
import { FAILED_GETTING, INVENTORY } from '../utils/textConstants.js';

export class InventoryService {
  constructor ({ inventoryRepository }) {
    this.inventoryRepository = inventoryRepository;
  }

  getAll = async (id) => {
    const items = await this.inventoryRepository.getBy(id);
    if (!items) {
      throw new FailedGettingError(FAILED_GETTING, INVENTORY);
    }
    return items;
  };
}
