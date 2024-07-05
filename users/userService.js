import { FailedCreatingError } from '../errors/errorTypes/failedCreatingError.js';
import { InvalidDataError } from '../errors/errorTypes/invalidDataError.js';
import { userValidate } from './userValidate.js';
import { FAILED_CREATE, INVALID_DATA, USERS } from '../utils/textConstants.js';

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
};
