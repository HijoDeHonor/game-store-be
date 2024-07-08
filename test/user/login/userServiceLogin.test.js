import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TEST_USERNAME, TEST_PASSWORD, TEST_TOKEN, TEST_PASSWORD_WITH_SPACE, INVALID_DATA, INVALID_DATA_ERROR, USERS, TEST_WRONG_PASSWORD } from '../../../utils/textConstants.js';
import { UserService } from '../../../users/userService.js';
import { UserRepository } from '../../../users/userRepository.js';
import { MySQLConnection } from '../../../utils/mySQLConnection.js';
import { DEFAULT_CONFIG } from '../../../utils/mySQLConfig.js';
import * as jwtUtils from '../../../jwt/jwtCreator.js';
import { InvalidDataError } from '../../../errors/errorTypes/invalidDataError.js';
import { InvalidLoginError } from '../../../errors/errorTypes/InvalidLoginError.js';

describe('userServiceLogin', () => {
  let userService;
  let executeQueryMock;
  let jwtCreator;

  beforeEach(() => {
    const userRepository = new UserRepository({ mySQLConnection: new MySQLConnection(DEFAULT_CONFIG) });
    userService = new UserService({ userRepository });
    executeQueryMock = vi.spyOn(MySQLConnection.prototype, 'executeQuery');
    jwtCreator = vi.spyOn(jwtUtils, 'jwtCreator').mockReturnValue(TEST_TOKEN);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return a token and a userName if all goes right', async () => {
    // ARRANGE
    const userName = TEST_USERNAME;
    const password = TEST_PASSWORD;
    executeQueryMock
      .mockImplementationOnce(() => Promise.resolve([{ userName: TEST_USERNAME, password: TEST_PASSWORD }]));

    // ACT
    const res = await userService.login(userName, password);
    expect(res).toEqual({ findUser: [{ userName: TEST_USERNAME, password: TEST_PASSWORD }], token: TEST_TOKEN });
    // ASSERT
    expect(jwtCreator).toHaveBeenCalled();
  });

  it('should throw an error on a failed validation', async () => {
    // ARRANGE
    const userName = TEST_USERNAME;
    const password = TEST_PASSWORD_WITH_SPACE;

    // ACT
    await expect(userService.login(userName, password)).rejects.toThrow(InvalidDataError);

    // ASSERT
    await expect(userService.login(userName, password)).rejects.toMatchObject({
      name: INVALID_DATA_ERROR,
      message: INVALID_DATA,
      entity: USERS
    });
    expect(jwtCreator).toHaveBeenCalledTimes(0);
  });

  it('should return an error call invalid login if password dont mach', async () => {
    // ARRANGE
    const userName = TEST_USERNAME;
    const password = TEST_WRONG_PASSWORD;

    executeQueryMock
      .mockImplementationOnce(() => Promise.resolve([{ userName: TEST_USERNAME, password: TEST_PASSWORD }]));
    // ACT

    await expect(userService.login(userName, password)).rejects.toThrow(InvalidLoginError);

    // ASSERT
    expect(jwtCreator).toHaveBeenCalledTimes(0);
  });
});
