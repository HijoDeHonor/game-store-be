import { describe, expect, it, vi } from "vitest";
import { UserModel } from "../../users/userModel.js";
import { MySQLConnection } from "../../utils/mySQLConnection.js";
import { TEST_PASSWORD, TEST_USERNAME } from "../../utils/textConstants.js";


vi.mock('../../utils/mySQLConnection.js', () => {
  return {
    MySQLConnection: class {
      constructor () {
        this.executeQuery = vi.fn();
      }
    }
  };
});

describe('UserModel', () => {
  it('should create the user and return the userName', async () => {
    // ARRANGE
    const input = { userName: TEST_USERNAME, password: TEST_PASSWORD }

    const executeQueryMock = new MySQLConnection().executeQuery;


    executeQueryMock.mock
      .resolveWith([])
      .resolveWith([{ userName: TEST_USERNAME }]);

    // ACT
    const result = await UserModel.create({ input });

    // ASSERT
    expect(executeQueryMock).toHaveBeenCalledTimes(2);
    expect(result).toBe(TEST_USERNAME);
  });
});
