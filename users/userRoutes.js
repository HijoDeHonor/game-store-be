import { Router } from 'express';
import { UserController } from './registerUser/userControler.js';

export const createUserRouter = ({ UserRepository }) => {
  const userRouter = Router();
  const userControler = new UserController({ UserRepository });
  userRouter.post('/', userControler.create);
  userRouter.get('/', userControler.getByUserName);
  return userRouter;
};
