import { ADD_SUCCESS, REMOVE_SUCCESS } from '../utils/textConstants.js';
import { tryCatch } from '../utils/tryCatch.js';

export class InventoryController {
  constructor ({ inventoryService }) {
    this.inventoryService = inventoryService;
    this.getAllUserItems = this.getAllUserItems.bind(this);
    this.getServerItems = this.getServerItems.bind(this);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }

  // server

  getServerItems = tryCatch(async (req, res) => {
    const items = await this.inventoryService.getServerItems();
    res.status(200).json(items);
  });

  // users

  getAllUserItems = tryCatch(async (req, res) => {
    const { userName } = req.params;
    const items = await this.inventoryService.getAllUserItems(userName);
    res.status(200).json(items);
  });

  addItem = tryCatch(async (req, res) => {
    const { userName, item, quantity } = req.body;
    await this.inventoryService.addItemToUser(userName, item, quantity);
    res.status(200).json(ADD_SUCCESS);
  });

  removeItem = tryCatch(async (req, res) => {
    const userName = req.params.userName;
    const item = req.params.item;
    const quantity = req.body.quantity;
    await this.inventoryService.removeItemToUser(userName, item, quantity);
    res.status(200).json(REMOVE_SUCCESS);
  });
}
