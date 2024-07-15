import awilix from 'awilix';
import { registerInventoryDependency } from '../inventory/inventoryDependencyInjenction/registerInventoryDependency.js';
import { registerUserDependency } from '../users/userDependencyInjection/registerUserDependency.js';
import { mySQLDependency } from '../utils/mySQL/mySQLDependency.js';
import { registerOfferDependency } from '../offer/offerDependencyInjection/registerOfferDependencyInjection.js';

export const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY
});

export function settings () {
  registerInventoryDependency(container);
  registerUserDependency(container);
  registerOfferDependency(container);
  mySQLDependency(container);
};

settings();
