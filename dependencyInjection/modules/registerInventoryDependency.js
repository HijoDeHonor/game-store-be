import { asClass } from 'awilix';
import { InventoryController } from '../../inventory/inventoryController.js';
import { InventoryService } from '../../inventory/inventoryService.js';
import { InventoryRepository } from '../../inventory/inventoryRepository.js';

export const registerInventoryDependency = (container) => {
  container.register({
    inventoryController: asClass(InventoryController).scoped(),
    inventoryService: asClass(InventoryService).scoped(),
    inventoryRepository: asClass(InventoryRepository).scoped()
  });
};
