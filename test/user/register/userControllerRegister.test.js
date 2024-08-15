import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { INVALID_DATA, TEST_PASSWORD, TEST_PASSWORD_WITH_SPACE, TEST_USERNAME, FAILED_CREATE, USERS, TEST_QUERY, TEST_QUERY_PARAMETER, FAILED_CREATING_ERROR, TEST_USER_REPOSITORY_METHOD_CREATE, TEST_USER_SERVICE_METHOD_CREATE, TEST_USER_CONTROLLER_FILE_NAME } from '../../../src/utils/textConstants.js';
import { MySQLConnection } from '../../../src/utils/mySQL/mySQLConnection.js';
import request from 'supertest';
import { app } from '../../../index.js';
import { FailedCreatingError } from '../../../src/errors/errorTypes/failedCreatingError.js';
import { SQLError } from '../../../src/errors/errorTypes/SQLError.js';

const query = TEST_QUERY;
const queryParameter = TEST_QUERY_PARAMETER;

describe('create', () => {
  let executeQueryMock;

  beforeEach(() => {
    executeQueryMock = vi.spyOn(MySQLConnection.prototype, 'executeQuery');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // tests
  // 1

  it('should create a user successfully', async () => {
    // Arrange
    const uniqueUserName = `TEST_USERNAME_${Date.now()}`;
    executeQueryMock.mockImplementationOnce(() => Promise.resolve([]))
      .mockImplementationOnce(() => Promise.resolve([{ userName: uniqueUserName }]));

    // Act
    const res = await request(app)
      .put('/users')
      .send({ userName: uniqueUserName, password: TEST_PASSWORD });

    // Assert
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ userName: uniqueUserName });
    expect(executeQueryMock).toHaveBeenCalledTimes(2);
  });
  // 2

  it('should return a validation error', async () => {
    // ARRANGE

    // ACT
    const res = await request(app)
      .put('/users')
      .send({ username: TEST_USERNAME, password: TEST_PASSWORD_WITH_SPACE });
    // ASSERT
    expect(400);
    expect(res.body.message).toBe(INVALID_DATA);
  });
  // 3

  it('should return a general creation error', async () => {
    // ARRANGE
    const errorInstance = new FailedCreatingError(FAILED_CREATE, USERS);
    executeQueryMock.mockImplementationOnce(() => {
      throw new SQLError(errorInstance, query, queryParameter);
    });
    // ACT
    const res = await request(app)
      .put('/users')
      .send({ userName: TEST_USERNAME, password: TEST_PASSWORD });
    // ASSERT
    expect(500);
    expect(executeQueryMock).toHaveBeenCalledTimes(1);
    expect(res.body).toMatchObject({
      error: {
        name: FAILED_CREATING_ERROR
      },
      message: errorInstance.message
    });
    expect(res.body.stack).toContain(FAILED_CREATING_ERROR);
    expect(res.body.stack).toContain(TEST_USER_REPOSITORY_METHOD_CREATE);
    expect(res.body.stack).toContain(TEST_USER_SERVICE_METHOD_CREATE);
    expect(res.body.stack).toContain(TEST_USER_CONTROLLER_FILE_NAME);
  });
});
