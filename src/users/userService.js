import { FailedCreatingError } from '../errors/errorTypes/failedCreatingError.js';
import { InvalidDataError } from '../errors/errorTypes/invalidDataError.js';
import { userValidate } from './userValidator.js';
import { FAILED_CREATE, INVALID_DATA, INVALID_LOGIN, USERS } from '../utils/textConstants.js';

export class UserService {
  constructor ({ userRepository }) {
    this.userRepository = userRepository;
  }

  validateUser = (userName, password) => {
    const userValidated = userValidate(userName, password);
    if (!userValidated.success) {
      throw new InvalidDataError(INVALID_DATA, USERS);
    }
    return userValidated.data;
  };

  create = async (userName, password) => {
    const user = this.validateUser(userName, password);
    const newUser = await this.userRepository.create(user);
    if (!newUser) {
      throw new FailedCreatingError(FAILED_CREATE, USERS);
    };
    return newUser;
  };

  login = async (userName, password) => {
    const user = this.validateUser(userName, password);
    const getUser = await this.userRepository.getBy({ userName: user.userName });
    if (getUser[0].password !== password) {
      throw new InvalidDataError(INVALID_LOGIN, USERS);
    }
    return getUser;
  };
};
