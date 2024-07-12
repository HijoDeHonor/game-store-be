import { Router } from 'express';
import { container } from '../dependencyInjection/di-settings.js';
import { authenticateJWT } from '../middlewares/authentication.js';

const inventoryController = container.resolve('inventoryController');

export const createInventoryRouter = () => {
  const inventoryRouter = Router();

  inventoryRouter.get('/:id?', authenticateJWT, inventoryController.getAllUserItems);

  return inventoryRouter;
};
