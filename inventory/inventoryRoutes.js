import { Router } from 'express';
import { container } from '../dependencyInjection/di-settings.js';
import { authenticateJWT } from '../middlewares/authentication.js';

const inventoryController = container.resolve('inventoryController');

export const createInventoryRouter = () => {
  const inventoryRouter = Router();

  inventoryRouter.get('/server/items', inventoryController.getServerItems);
  inventoryRouter.get('/users/:userName?', authenticateJWT, inventoryController.getAllUserItems);

  return inventoryRouter;
};
