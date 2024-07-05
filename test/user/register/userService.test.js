import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { UserService } from '../../../services/userService/userService.js';
import { INVALID_DATA, INVALID_DATA_ERROR, TEST_PASSWORD, TEST_PASSWORD_WITH_SPACE, TEST_USERNAME, USERS } from '../../../utils/textConstants';
import { UserRepository } from '../../../users/userRepository.js';
import { MySQLConnection } from '../../../utils/mySQLConnection.js';
import { InvalidDataError } from '../../../errors/errorTypes/invalidDataError';
import { AlreadyExistError } from '../../../errors/errorTypes/alreadyExistError.js';

// Mock MySQLConnection
vi.mock('../../../utils/mySQLConnection.js', () => {
  return {
    MySQLConnection: vi.fn().mockImplementation(() => {
      return {
        executeQuery: vi.fn()
      };
    })
  };
});

describe('userService.create', () => {
  let userService;
  let mySQLConnectionMock;

  beforeEach(() => {
    const MySQLConnectionMock = new MySQLConnection();
    const userRepository = new UserRepository({ mySQLConnection: MySQLConnectionMock });
    userService = new UserService({ userRepository });
    mySQLConnectionMock = MySQLConnectionMock.executeQuery;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return a user successfully if all goes right', async () => {
    // ARRANGE
    const uniqueUserName = `${TEST_USERNAME}${Date.now()}`;
    const password = TEST_PASSWORD;
    mySQLConnectionMock
      .mockImplementationOnce(() => Promise.resolve([])) // First call: user does not exist
      .mockImplementationOnce(() => Promise.resolve({ userName: uniqueUserName })); // Second call: user creation

    // ACT
    const res = await userService.create(uniqueUserName, password);

    // ASSERT
    expect(mySQLConnectionMock).toHaveBeenCalledTimes(2);
    expect(res).toEqual({ userName: uniqueUserName });
  });

  it('should return a validation error if userName or password are not valid', async () => {
    // ARRANGE
    const username = TEST_USERNAME;
    const password = TEST_PASSWORD_WITH_SPACE;

    // ACT & ASSERT
    await expect(userService.create(username, password)).rejects.toThrow(InvalidDataError);

    await expect(userService.create(username, password)).rejects.toMatchObject({
      name: INVALID_DATA_ERROR,
      message: INVALID_DATA,
      entity: USERS
    });
  });

  it('should return an error if the user already exists', async () => {
    // ARRANGE
    const userName = TEST_USERNAME;
    const password = TEST_PASSWORD;
    mySQLConnectionMock.mockImplementationOnce(() => Promise.resolve([{ userName: TEST_USERNAME }]));

    // ACT & ASSERT
    await expect(userService.create(userName, password)).rejects.toThrow(AlreadyExistError);
    expect(mySQLConnectionMock).toHaveBeenCalledTimes(1);
  });
});
