import { userValidate } from './userValidate.js';
import { tryCatch } from '../utils/tryCatch.js';
import { jwtCreator } from '../jwt/jwtCreator.js';
import { INVALID_DATA, INVALID_LOGIN, USERS } from '../utils/textConstants.js';
import { InvalidDataError } from '../errors/errorTypes/invalidDataError.js';
import { InvalidLoginError } from '../errors/errorTypes/invalidLoginError.js';

export class UserController {
  constructor ({ userService }) {
    this.userService = userService;
    this.create = this.create.bind(this);
    this.login = this.login.bind(this);
  }

  create = tryCatch(async (req, res) => {
    const { userName, password } = req.body;
    const newUser = await this.userService.create(userName, password);
    return res.status(201).json(newUser);
  });

  login = tryCatch(async (req, res) => {
    const { userName, password } = req.body;
    const validation = userValidate(userName, password);
    if (!validation.success) {
      throw new InvalidDataError(INVALID_DATA, USERS);
    }
    const logUser = await this.userRepository.getBy({ userName });

    if (logUser[0].password !== password) {
      throw new InvalidLoginError(INVALID_LOGIN, USERS);
    }
    const token = jwtCreator(logUser);
    res
      .cookie('acces_token', token,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production'
        }
      )
      .status(200)
      .json({ userName: logUser[0].userName });
  });
}
