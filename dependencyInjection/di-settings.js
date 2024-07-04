import awilix from 'awilix';
import { UserController } from '../users/userController.js';
import { UserRepository } from '../users/userRepository.js';
import { MySQLConnection } from '../utils/mySQLConnection.js';
import { DEFAULT_CONFIG } from '../utils/mySQLConfig.js';

export const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY
});

export function settings () {
  container.register({
    userController: awilix.asClass(UserController).singleton(),
    userRepository: awilix.asClass(UserRepository).singleton(),
    mySQLConnection: awilix.asClass(MySQLConnection).singleton(),
    defaultConfig: awilix.asValue(DEFAULT_CONFIG)
  });
}

settings();
