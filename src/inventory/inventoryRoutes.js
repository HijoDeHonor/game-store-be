import { Router } from 'express';
import { container } from '../dependencyInjection/di-settings.js';
import { authenticateJWT } from '../middlewares/authentication.js';

const inventoryController = container.resolve('inventoryController');

export const createInventoryRouter = () => {
  const inventoryRouter = Router();

  // Server

  inventoryRouter.get('/server/items', inventoryController.getServerItems);

  // Users

  inventoryRouter.get('/users/:userName?', authenticateJWT, inventoryController.getAllUserItems);
  inventoryRouter.post('/users/:userName?', authenticateJWT, inventoryController.addItem);
  inventoryRouter.post('/users/:userName/:item?', authenticateJWT, inventoryController.removeItem);

  return inventoryRouter;
};
