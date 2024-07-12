import { tryCatch } from '../utils/tryCatch.js';

export class InventoryController {
  constructor ({ inventoryService }) {
    this.inventoryService = inventoryService;
    this.getAllUserItems = this.getAllUserItems.bind(this);
  }

  getAllUserItems = tryCatch(async (req, res) => {
    const { id } = req.params;
    const items = await this.inventoryService.getAllUserItems(id);
    res.status(200).json(items);
  });
}
