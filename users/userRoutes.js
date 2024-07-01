import { Router } from 'express'
import { UserController } from './registerUser/userControler.js'

export const createUserRouter = ({ userModel }) => {
  const userRouter = Router()
  const userControler = new UserController({ userModel })
  userRouter.post('/', userControler.create)
  return userRouter
}
