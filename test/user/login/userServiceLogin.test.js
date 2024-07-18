import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TEST_USERNAME, TEST_PASSWORD, TEST_PASSWORD_WITH_SPACE, INVALID_DATA, INVALID_DATA_ERROR, USERS } from '../../../src/utils/textConstants.js';
import { UserService } from '../../../src/users/userService.js';
import { UserRepository } from '../../../src/users/userRepository.js';
import { MySQLConnection } from '../../../src/utils/mySQL/mySQLConnection.js';
import { DEFAULT_CONFIG } from '../../../src/utils/mySQL/mySQLConfig.js';

describe('userServiceLogin', () => {
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

  it('should return a userName and a password if all goes right', async () => {
    // ARRANGE
    const userName = TEST_USERNAME;
    const password = TEST_PASSWORD;
    executeQueryMock
      .mockImplementationOnce(() => Promise.resolve([{ userName: TEST_USERNAME, password: TEST_PASSWORD }]));

    // ACT
    const res = await userService.login(userName, password);
    // ASSERT
    expect(res).toEqual([{ userName: TEST_USERNAME, password: TEST_PASSWORD }]);
  });

  it('should throw an error on a failed validation', async () => {
    // ARRANGE
    const userName = TEST_USERNAME;
    const password = TEST_PASSWORD_WITH_SPACE;

    // ACT
    await expect(userService.login(userName, password)).rejects.toThrow();

    // ASSERT
    await expect(userService.login(userName, password)).rejects.toMatchObject({
      name: INVALID_DATA_ERROR,
      message: INVALID_DATA,
      entity: USERS
    });
  });
});
