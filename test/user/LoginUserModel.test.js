import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MySQLConnection } from "../../utils/mySQLConnection.js";
import { TEST_PASSWORD, TEST_USERNAME } from "../../utils/textConstants.js";
import { UserRepository } from "../../users/userRepository.js";
import { SQLError } from "../../errors/ErrorTypes/SQLError.js";
import { FailedCreateUserError } from "../../errors/ErrorTypes/FailedCreateUser.js";
import { UserDoesNotExistError } from "../../errors/ErrorTypes/userDoesNotExist.js";



describe(' UserRepository.getBy', () => {

  let executeQueryMock;

  beforeEach(() => {
    executeQueryMock = vi.spyOn(MySQLConnection.prototype, 'executeQuery');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // TEST

  // 1
  it('should get the user and return the userName and password', async () => {
    // ARRANGE
    const property = 'userName';
    const value = TEST_USERNAME;
    const mockResult = [{ userName: TEST_USERNAME, password: TEST_PASSWORD }];

    executeQueryMock.mockImplementationOnce(() => Promise.resolve(mockResult));

    // ACT
    const res = await UserRepository.getBy(property, value);

    // ASSERT
    expect(executeQueryMock).toHaveBeenCalledTimes(1);
    expect(executeQueryMock).toHaveBeenCalledWith(
      `SELECT * FROM users WHERE (?) = (?);`,
      [property, value]
    );
    expect(res).toEqual({ user: mockResult[0] });
  });

  // 2
  it('should throw an DontExistError when the first call to executeQuery return an empty array', async () => {
    // ARRANGE
    const property = 'userName';
    const value = TEST_USERNAME;

    executeQueryMock.mockImplementationOnce(() => Promise.resolve([]));

    // ACT & ASSERT
    await expect(UserRepository.getBy(property, value)).rejects.toThrow(UserDoesNotExistError);

    expect(executeQueryMock).toHaveBeenCalledTimes(1);
    expect(executeQueryMock).toHaveBeenCalledWith(
      `SELECT * FROM users WHERE (?) = (?);`,
      [property, value]
    );
  });

  // 3
  it('should throw an FailedCreateUserError if is an SQLERROR been throwed', async () => {
    //ARRANGE
    const property = 'userName';
    const value = TEST_USERNAME;

    executeQueryMock.mockImplementationOnce(() => { throw SQLError; });

    // ACT & ASSERT
    await expect(UserRepository.getBy(property, value)).rejects.toThrow(FailedCreateUserError);
    expect(executeQueryMock).toHaveBeenCalledTimes(1);
    expect(executeQueryMock).toHaveBeenCalledWith(
      `SELECT * FROM users WHERE (?) = (?);`,
      [property, value]
    );
  });

});