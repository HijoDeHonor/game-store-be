import { validateUser } from '../../users/userSchema.js';
import { INVALID_DATA, INVALID_LOGIN, INVALID_LOGIN_ERROR, USERS } from '../../utils/textConstants.js';
import { InvalidDataError } from '../../errors/ErrorTypes/invalidData.js';
import { tryCatch } from '../../utils/tryCatch.js';
import { jwtCreator } from '../../services/jwtService/jwtCreator.js';
import { InvalidLoginError } from '../../errors/ErrorTypes/invalidLogin.js';

export class UserController {
  constructor ({ UserRepository }) {
    this.UserRepository = UserRepository;
  }
  create = tryCatch(async (req, res) => {
    const { userName, password } = req.body;
    const result = validateUser(userName, password);
    if (!result.success) {
      throw new InvalidDataError(INVALID_DATA, USERS);
    }
    const newUser = await this.UserRepository.create({ input: result.data });
    if (newUser) {
      res.status(201).json(newUser);
    }
  });
  getByUserName = tryCatch(async (req, res) => {
    const { userName, password } = req.body;
    const validation = validateUser(userName, password);
    if (!validation.success) {
      throw new InvalidDataError(INVALID_DATA, USERS);
    }

    const logUser = await this.UserRepository.getBy({ userName: userName });

    if (logUser) {
      console.log('logUser: ', logUser.userName);

      if (logUser.password !== password) {
        throw new InvalidLoginError(INVALID_LOGIN, USERS);
      }

      const token = jwtCreator(logUser);
      res
        .cookie('acces_token', token,
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
          }
        )
        .status(200)
        .json({ userName: logUser.userName });
    }
  });
}
