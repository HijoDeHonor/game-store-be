import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { INVALID_DATA, TEST_PASSWORD, TEST_PASSWORD_WITH_SPACE, TEST_USERNAME, USERS, INVALID_LOGIN, TEST_WRONG_PASSWORD, TEST_QUERY, TEST_QUERY_PARAMETER, FAILED_CREATE, SQLERROR } from '../../../src/utils/textConstants.js';
import request from 'supertest';
import { app } from '../../../index.js';
import { UserRepository } from '../../../src/users/userRepository.js';
import { FailedCreatingError } from '../../../src/errors/errorTypes/failedCreatingError.js';
import { SQLError } from '../../../src/errors/errorTypes/SQLError.js';

const query = TEST_QUERY;
const queryParameter = TEST_QUERY_PARAMETER;

describe('Login', () => {
  let userRepositoryMock;

  beforeEach(() => {
    userRepositoryMock = vi.spyOn(UserRepository.prototype, 'getBy');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // TEST

  // 1
  it('should login if all goes rigth', async () => {
    // ASSERT
    userRepositoryMock.mockImplementationOnce(() => Promise.resolve([{ userName: TEST_USERNAME, password: TEST_PASSWORD }]));

    // Act
    const res = await request(app)
      .get('/users')
      .send({ userName: TEST_USERNAME, password: TEST_PASSWORD });

    // Assert
    expect(res.headers['set-cookie']).toBeDefined();
    expect(userRepositoryMock).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ userName: TEST_USERNAME });
  });

  // 2
  it('should return a validation error', async () => {
    // ARRANGE

    // ACT
    const res = await request(app)
      .get('/users')
      .send({ username: TEST_USERNAME, password: TEST_PASSWORD_WITH_SPACE });
    // ASSERT
    expect(400);
    expect(res.body.message).toBe(INVALID_DATA);
  });

  // 3
  it('should return an error if the user or password dont match', async () => {
    // ARRANGE
    userRepositoryMock.mockImplementationOnce(() => Promise.resolve([{ userName: TEST_USERNAME, password: TEST_PASSWORD }]));

    // ACT
    const res = await request(app)
      .get('/users')
      .send({ userName: TEST_USERNAME, password: TEST_WRONG_PASSWORD });

    // ASSERTS

    expect(userRepositoryMock).toHaveBeenCalledTimes(1);
    expect(400);
    expect(res.body.message).toBe(INVALID_LOGIN);
  });
  // 4
  it('should return a general creation error', async () => {
    // ARRANGE
    const errorInstance = new FailedCreatingError(FAILED_CREATE, USERS);
    userRepositoryMock.mockImplementationOnce(() => {
      throw new SQLError(errorInstance, query, queryParameter);
    });
    // ACT
    const res = await request(app)
      .get('/users')
      .send({ userName: TEST_USERNAME, password: TEST_PASSWORD });
    // ASSERT
    expect(500);
    expect(userRepositoryMock).toHaveBeenCalledTimes(1);
    expect(res.body).toMatchObject({
      error: {
        name: SQLERROR,
        query: TEST_QUERY,
        parameters: TEST_QUERY_PARAMETER
      },
      stack: errorInstance.stack,
      message: errorInstance.message
    });
  });
});
