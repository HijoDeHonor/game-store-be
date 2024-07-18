import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { INVALID_DATA, TEST_PASSWORD, TEST_PASSWORD_WITH_SPACE, TEST_USERNAME } from '../../../src/utils/textConstants.js';
import request from 'supertest';
import { app } from '../../../index.js';
import { UserRepository } from '../../../src/users/userRepository.js';
import { AlreadyExistError } from '../../../src/errors/errorTypes/alreadyExistError.js';
import { FailedCreatingError } from '../../../src/errors/errorTypes/failedCreatingError.js';
import { SQLError } from '../../../src/errors/errorTypes/SQLError.js';

describe('create', () => {
  let mockConnection;
  let userRepository;

  beforeEach(() => {
    mockConnection = {
      executeQuery: vi.fn()
    };
    userRepository = new UserRepository({ mySQLConnection: mockConnection });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // tests
  // 1

  it('should create a user successfully', async () => {
    // Arrange
    mockConnection.executeQuery
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce({ userName: TEST_USERNAME });

    // Act
    const input = { userName: TEST_USERNAME, password: TEST_PASSWORD };
    const res = await userRepository.create(input);
    // Assert
    expect(mockConnection.executeQuery).toHaveBeenCalledTimes(2);
    expect(res).toEqual({ userName: TEST_USERNAME });
  });

  // 2
  it('should return a validation error', async () => {
    // ARRANGE
    // ACT
    const res = await request(app)
      .post('/users')
      .send({ username: TEST_USERNAME, password: TEST_PASSWORD_WITH_SPACE });
    // ASSERT
    expect(400);
    expect(res.body.message).toBe(INVALID_DATA);
  });

  // 3
  it('should return an error if the user already exists', async () => {
    // Arrange
    mockConnection.executeQuery
      .mockResolvedValueOnce([{ TEST_USERNAME }]);

    const input = { userName: TEST_USERNAME, password: TEST_PASSWORD };

    // ACT & ASSERT
    await expect(userRepository.create(input)).rejects.toThrow(AlreadyExistError);
  });
  // 4

  it('should return a general creation error', async () => {
    // ARRANGE
    mockConnection.executeQuery
      .mockImplementationOnce(() => {
        throw SQLError;
      });
    // ACT
    const input = { userName: TEST_USERNAME, password: TEST_PASSWORD };
    // ASSERT
    await expect(userRepository.create(input)).rejects.toThrow(FailedCreatingError);
  });
});
