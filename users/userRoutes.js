import { Router } from 'express';
import { container } from '../dependencyInjection/di-settings.js';

const userController = container.resolve('userController');

export const createUserRouter = () => {
  const userRouter = Router();

  userRouter.post('/', userController.create);
  userRouter.get('/', userController.login);

  return userRouter;
};
