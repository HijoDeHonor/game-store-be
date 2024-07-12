import { asClass } from 'awilix';
import { UserController } from '../../users/userController.js';
import { UserRepository } from '../../users/userRepository.js';
import { UserService } from '../../users/userService.js';

export const registerUserDependency = (container) => {
  container.register({
    userController: asClass(UserController).scoped(),
    userService: asClass(UserService).scoped(),
    userRepository: asClass(UserRepository).scoped()
  });
};
