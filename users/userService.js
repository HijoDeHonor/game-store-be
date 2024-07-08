import { FailedCreatingError } from '../errors/errorTypes/failedCreatingError.js';
import { InvalidDataError } from '../errors/errorTypes/invalidDataError.js';
import { InvalidLoginError } from '../errors/errorTypes/InvalidLoginError.js';
import { userValidate } from './userValidate.js';
import { FAILED_CREATE, INVALID_DATA, INVALID_LOGIN, USERS } from '../utils/textConstants.js';
import { jwtCreator } from '../jwt/jwtCreator.js';

export class UserService {
  constructor ({ userRepository }) {
    this.userRepository = userRepository;
  }

  create = async (userName, password) => {
    const userValidated = userValidate(userName, password);
    if (!userValidated.success) {
      throw new InvalidDataError(INVALID_DATA, USERS);
    }
    const newUser = await this.userRepository.create({ input: userValidated.data });
    if (!newUser) {
      throw new FailedCreatingError(FAILED_CREATE, USERS);
    };
    return newUser;
  };

  login = async (userName, password) => {
    const validation = userValidate(userName, password);
    if (!validation.success) {
      throw new InvalidDataError(INVALID_DATA, USERS);
    }
    const findUser = await this.userRepository.getBy({ userName });
    if (findUser[0].password !== password) {
      throw new InvalidLoginError(INVALID_LOGIN, USERS);
    }
    const token = jwtCreator(findUser[0]);
    return { findUser, token };
  };
};
