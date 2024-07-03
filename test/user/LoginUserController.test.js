import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { INVALID_DATA, TEST_PASSWORD, TEST_PASSWORD_WITH_SPACE, TEST_USERNAME, USERS, INVALID_DATA_ERROR, INTERNAL_SERVER_ERROR, TEST_TOKEN, INVALID_LOGIN_ERROR, INVALID_LOGIN, TEST_WRONG_PASSWORD } from '../../utils/textConstants.js';
import request from 'supertest';
import { app } from '../../index.js';
import { UserRepository } from '../../users/userRepository.js';
import * as jwtUtils from '../../services/jwtService/jwtCreator.js';

describe('Login', () => {
  let userRepositoryMock;
  let jwtCreatorMock;

  beforeEach(() => {
    userRepositoryMock = vi.spyOn(UserRepository.prototype, 'getBy');
    jwtCreatorMock = vi.spyOn(jwtUtils, 'jwtCreator').mockReturnValue(TEST_TOKEN);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // TEST

  // 1
  it('should login if all goes rigth', async () => {
    // ASSERT
    userRepositoryMock.mockImplementationOnce(() => Promise.resolve({ userName: TEST_USERNAME, password: TEST_PASSWORD }));

    // Act
    const res = await request(app)
      .get('/users')
      .send({ userName: TEST_USERNAME, password: TEST_PASSWORD });

    // Assert
    expect(res.headers['set-cookie']).toBeDefined();
    const cookies = res.headers['set-cookie'];
    expect(jwtCreatorMock).toHaveBeenCalled();
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
    expect(res.body.name).toBe(INVALID_DATA_ERROR);
    expect(res.body.entity).toBe(USERS);
    expect(res.body.message).toBe(INVALID_DATA);
  });

  // 3
  it('should return an error if the user or password dont match', async () => {
    // ARRANGE
    userRepositoryMock.mockImplementationOnce(() => Promise.resolve({ userName: TEST_USERNAME, password: TEST_PASSWORD }));

    // ACT
    const res = await request(app)
      .get('/users')
      .send({ userName: TEST_USERNAME, password: TEST_WRONG_PASSWORD });

    // ASSERTS

    expect(userRepositoryMock).toHaveBeenCalledTimes(1);
    expect(400);
    expect(res.body.name).toBe(INVALID_LOGIN_ERROR);
    expect(res.body.entity).toBe(USERS);
    expect(res.body.message).toBe(INVALID_LOGIN);
  });
  // 4
  it('should return a general creation error', async () => {
    // ARRANGE
    userRepositoryMock.mockImplementationOnce(() => {
      throw error;
    });
    // ACT
    const res = await request(app)
      .get('/users')
      .send({ userName: TEST_USERNAME, password: TEST_PASSWORD });
    // ASSERT
    expect(500);
    expect(userRepositoryMock).toHaveBeenCalledTimes(1);
    expect(res.body.message).toBe(INTERNAL_SERVER_ERROR);
  });
});
