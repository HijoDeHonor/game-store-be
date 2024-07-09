import { InvalidLoginError } from '../errors/errorTypes/InvalidLoginError.js';
import { jwtCreator } from '../jwt/jwtCreator.js';
import { INVALID_LOGIN, USERS } from '../utils/textConstants.js';
import { tryCatch } from '../utils/tryCatch.js';

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
    const logUser = await this.userService.login(userName, password);
    if (logUser[0].password !== password) {
      throw new InvalidLoginError(INVALID_LOGIN, USERS);
    }
    const token = jwtCreator(logUser[0]);
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
