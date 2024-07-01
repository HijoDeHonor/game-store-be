import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MySQLConnection } from "../../utils/mySQLConnection";
import { TEST_PASSWORD, TEST_USERNAME } from "../../utils/textConstants.js";
import { UserModel } from "../../users/userModel.js";
import { AlreadyExistError } from "../../errors/ErrorTypes/userAlreadyExist.js";
import { SQLError } from "../../errors/ErrorTypes/SQLError.js";
import { FailedCreateUserError } from "../../errors/ErrorTypes/FailedCreateUser";



describe('UserModel', () => {

  // MySQLConnnection mock settings
  let executeQueryMock;
  beforeEach(() => {
    executeQueryMock = vi.spyOn(MySQLConnection.prototype, 'executeQuery');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  //tests
  //1
  it('should create the user and return the userName', async () => {
    // ARRANGE
    const input = { userName: TEST_USERNAME, password: TEST_PASSWORD }

    executeQueryMock.mockImplementationOnce(() => Promise.resolve([])) // Simula que el usuario no existe
      .mockImplementationOnce(() => Promise.resolve({ userName: TEST_USERNAME })); // Simula inserción exitosa y devuelve el usuario creado

    // ACT
    const res = await UserModel.create({ input });

    // ASSERT
    expect(executeQueryMock).toHaveBeenCalledTimes(2);
    expect(res).toEqual({ userName: TEST_USERNAME });
  });

  //2
  it('should throw an AlreadyExistError when the first call to executeQuery dont return an empty array', async () => {
    // ARRANGE
    const input = { userName: TEST_USERNAME, password: TEST_PASSWORD }

    executeQueryMock.mockImplementationOnce(() => Promise.resolve([{ userName: TEST_USERNAME }]));

    // ACT & ASSERT
    await expect(UserModel.create({ input })).rejects.toThrow(AlreadyExistError);

    expect(executeQueryMock).toHaveBeenCalledTimes(1);
  })

  //3
  it('should throw an FailedCreateUserError if is an SQLERROR been throwed', async () => {
    //ARRANGE
    const input = { userName: TEST_USERNAME, password: TEST_PASSWORD }
    executeQueryMock.mockImplementationOnce(() => Promise.resolve([]))
      .mockImplementationOnce(() => { throw SQLError; });

    // ACT & ASSERT
    await expect(UserModel.create({ input })).rejects.toThrow(FailedCreateUserError)
    expect(executeQueryMock).toHaveBeenCalledTimes(2)
  })
});