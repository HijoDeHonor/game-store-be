import { Router } from 'express';
import { UserController } from '../users/userControler.js';

export const createUserRouter = ({ UserRepository }) => {
  const userRouter = Router();
  const userControler = new UserController({ UserRepository });

  userRouter.post('/', userControler.create);
  userRouter.get('/', userControler.login);

  return userRouter;
};
