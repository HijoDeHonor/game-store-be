import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { UserService } from '../../../src/users/userService.js';
import { ALREADY_EXIST, ALREADY_EXIST_ERROR, FAILED_CREATING_ERROR, INVALID_DATA, INVALID_DATA_ERROR, TEST_PASSWORD, TEST_PASSWORD_WITH_SPACE, TEST_USERNAME, USERS } from '../../../src/utils/textConstants.js';
import { UserRepository } from '../../../src/users/userRepository.js';
import { MySQLConnection } from '../../../src/utils//mySQL/mySQLConnection.js';
import { InvalidDataError } from '../../../src/errors/errorTypes/invalidDataError.js';
import { DEFAULT_CONFIG } from '../../../src/utils/mySQL/mySQLConfig.js';

describe('userService.create', () => {
  let userService;
  let executeQueryMock;
  beforeEach(() => {
    const userRepository = new UserRepository({ mySQLConnection: new MySQLConnection(DEFAULT_CONFIG) });
    userService = new UserService({ userRepository });
    executeQueryMock = vi.spyOn(MySQLConnection.prototype, 'executeQuery');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return a user successfully if all goes right', async () => {
    // ARRANGE
    const uniqueUserName = `${TEST_USERNAME}${Date.now()}`;
    const password = TEST_PASSWORD;
    executeQueryMock
      .mockImplementationOnce(() => Promise.resolve([])) // First call: user does not exist
      .mockImplementationOnce(() => Promise.resolve({ userName: uniqueUserName })); // Second call: user creation

    // ACT
    const res = await userService.create(uniqueUserName, password);

    // ASSERT
    expect(executeQueryMock).toHaveBeenCalledTimes(2);
    expect(res).toEqual({ userName: uniqueUserName });
  });

  it('should return a validation error if userName or password are not valid', async () => {
    // ARRANGE
    const userName = TEST_USERNAME;
    const password = TEST_PASSWORD_WITH_SPACE;

    // ACT & ASSERT
    await expect(userService.create(userName, password)).rejects.toThrow(InvalidDataError);

    await expect(userService.create(userName, password)).rejects.toMatchObject({
      name: INVALID_DATA_ERROR,
      message: INVALID_DATA,
      entity: USERS
    });
  });

  it('should return an error if the user already exists', async () => {
    // ARRANGE
    const userName = TEST_USERNAME;
    const password = TEST_PASSWORD;
    executeQueryMock
      .mockImplementationOnce(() => Promise.resolve([{ userName: TEST_USERNAME }]));

    // ACT & ASSERT
    await expect(userService.create(userName, password)).rejects
      .toMatchObject({
        name: ALREADY_EXIST_ERROR,
        message: ALREADY_EXIST,
        entity: USERS
      });
    expect(executeQueryMock).toHaveBeenCalledTimes(1);
  });

  it('should return an error if the user cant be create', async () => {
    // ARRANGE
    const userName = TEST_USERNAME;
    const password = TEST_PASSWORD;
    executeQueryMock
      .mockImplementationOnce(() => Promise.resolve([]));
    // ACT & ASSERT
    await expect(userService.create(userName, password)).rejects
      .toMatchObject({
        name: FAILED_CREATING_ERROR,
        entity: USERS
      });
  });
});
