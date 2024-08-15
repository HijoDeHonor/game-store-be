import { ADD_SUCCESS, REMOVE_SUCCESS } from '../utils/textConstants.js';
import { tryCatch } from '../utils/tryCatch.js';

export class InventoryController {
  constructor ({ inventoryService }) {
    this.inventoryService = inventoryService;
    this.getAllUserItems = this.getAllUserItems.bind(this);
    this.getServerItems = this.getServerItems.bind(this);
    this.addItem = this.addItem.bind(this);
    this.removeItems = this.removeItems.bind(this);
  }

  getAllUserItems = tryCatch(async (req, res) => {
    const { userName } = req.params;
    const items = await this.inventoryService.getAllUserItems(userName);
    res.status(200).json(items);
  });

  getServerItems = tryCatch(async (req, res) => {
    const items = await this.inventoryService.getServerItems();

    res.status(200).json(items);
  });

  addItem = tryCatch(async (req, res) => {
    const userName = req.params.userName;
    const { itemName, quantity } = req.body;
    await this.inventoryService.addItemToUser(userName, itemName, quantity);
    res.status(200).json(ADD_SUCCESS);
  });

  removeItems = tryCatch(async (req, res) => {
    const username = req.params.userName;
    const list = req.body;
    await this.inventoryService.removeItemsFromUser(username, list);

    res.status(200).json(REMOVE_SUCCESS);
  });
}
