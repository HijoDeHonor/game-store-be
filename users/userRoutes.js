import { Router } from 'express'
import { UserControler } from './registerUser/userControler.js'

export const createUserRouter = ({ userModel }) => {
  const userRouter = Router()
  const userControler = new UserControler({ userModel })

  userRouter.post('/', userControler.create)


  return userRouter
}
