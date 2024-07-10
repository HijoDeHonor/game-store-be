import { Router } from 'express';
import { container } from '../dependencyInjection/di-settings.js';

const inventoryController = container.resolve('inventoryController');

export const createInventoryRouter = () => {
  const inventoryRouter = Router();
  inventoryRouter.get('/:id?', inventoryController.get);

  return inventoryRouter;
};
