import awilix from 'awilix';
import { UserController } from '../users/userController.js';
import { UserService } from '../users/userService.js';
import { UserRepository } from '../users/userRepository.js';
import { MySQLConnection } from '../utils/mySQLConnection.js';
import { DEFAULT_CONFIG } from '../utils/mySQLConfig.js';
import { InventoryController } from '../inventory/inventoryController.js';
import { InventoryService } from '../inventory/inventoryService.js';
import { InventoryRepository } from '../inventory/inventoryRepository.js';

export const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY
});

export function settings () {
  container.register({
    // User
    userController: awilix.asClass(UserController).scoped(),
    userService: awilix.asClass(UserService).scoped(),
    userRepository: awilix.asClass(UserRepository).scoped(),
    // Inventory
    inventoryController: awilix.asClass(InventoryController).scoped(),
    inventoryService: awilix.asClass(InventoryService).scoped(),
    inventoryRepository: awilix.asClass(InventoryRepository).scoped(),
    // MySQL
    mySQLConnection: awilix.asClass(MySQLConnection).scoped(),
    // Configs
    defaultConfig: awilix.asValue(DEFAULT_CONFIG)
  });
}

settings();
