import { asClass, asValue } from 'awilix';
import { MySQLConnection } from '../../utils/mySQLConnection.js';
import { DEFAULT_CONFIG } from '../../utils/mySQLConfig.js';

export const mySQLDependency = (container) => {
  container.register({
    mySQLConnection: asClass(MySQLConnection).scoped(),
    defaultConfig: asValue(DEFAULT_CONFIG)
  });
};
