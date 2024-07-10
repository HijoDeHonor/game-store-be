import { InvalidDataError } from '../errors/errorTypes/invalidDataError.js';
import { INVALID_DATA, INVENTORY } from '../utils/textConstants.js';
import { tryCatch } from '../utils/tryCatch.js';

export class InventoryController {
  constructor ({ inventoryService }) {
    this.inventoryService = inventoryService;
    this.get = this.get.bind(this);
  }

  get = tryCatch(async (req, res) => {
    const { id } = req.params;
    if (!id) {
      throw new InvalidDataError(INVALID_DATA, INVENTORY);
    };
    const items = await this.inventoryService.getAll(id);
    res.status(200).json(items);
  });
}
