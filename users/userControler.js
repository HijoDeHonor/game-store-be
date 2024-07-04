import { validateUser } from './userSchema.js';
import { tryCatch } from '../utils/tryCatch.js';
import { jwtCreator } from '../services/jwtService/jwtCreator.js';
import { MySQLConnection } from '../utils/mySQLConnection.js';
import { UserRepository } from './userRepository.js';
import { INVALID_DATA, INVALID_LOGIN, USERS } from '../utils/textConstants.js';
import { InvalidDataError } from '../errors/ErrorTypes/invalidDataError.js';
import { InvalidLoginError } from '../errors/ErrorTypes/invalidLoginError.js';
import { DEFAULT_CONFIG } from '../utils/mySQLConfig.js';

const connection = new MySQLConnection(DEFAULT_CONFIG);
const userRepository = new UserRepository(connection);

export class UserController {
  create = tryCatch(async (req, res) => {
    const { userName, password } = req.body;
    const validation = validateUser(userName, password);
    if (!validation.success) {
      throw new InvalidDataError(INVALID_DATA, USERS);
    }
    const newUser = await userRepository.create({ input: validation.data });
    if (newUser) {
      res.status(201).json(newUser);
    }
  });

  login = tryCatch(async (req, res) => {
    const { userName, password } = req.body;
    const validation = validateUser(userName, password);
    if (!validation.success) {
      throw new InvalidDataError(INVALID_DATA, USERS);
    }
    const logUser = await userRepository.getBy({ userName });
    if (logUser) {
      if (logUser.password !== password) {
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
        .json({ userName: logUser.userName });
    }
  });
}
