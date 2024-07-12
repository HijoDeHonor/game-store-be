import awilix from 'awilix';
import { registerInventoryDependency } from './modules/registerInventoryDependency.js';
import { registerUserDependency } from './modules/registerUserDependency.js';
import { mySQLDependency } from './modules/mySQLDependency.js';

export const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY
});

export function settings () {
  registerInventoryDependency(container);
  registerUserDependency(container);
  mySQLDependency(container);
}

settings();
