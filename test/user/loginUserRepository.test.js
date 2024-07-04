import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TEST_PASSWORD, TEST_USERNAME } from '../../utils/textConstants.js';
import { UserRepository } from '../../users/userRepository.js';
import { SQLError } from '../../errors/ErrorTypes/SQLError.js';
import { DoesNotExistError } from '../../errors/errorTypes/doesNotExistError.js';
import { FailedGettingError } from '../../errors/errorTypes/failedGettingError.js';

describe('getByUsername', () => {
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
  // TEST

  // 1
  it('should return user data if user exists', async () => {
    // ARRANGE
    mockConnection.executeQuery.mockResolvedValue([{ userName: TEST_USERNAME, password: TEST_PASSWORD }]);

    const res = await userRepository.getBy({ userName: TEST_USERNAME });

    // ACT & ASSERT
    expect(mockConnection.executeQuery).toHaveBeenCalledTimes(1); // Verifica que se llamó 1 vez
    expect(res).toEqual([{ userName: TEST_USERNAME, password: TEST_PASSWORD }]);
  });

  // 2
  it('should throw DoesNotExistError if user does not exist', async () => {
    // ARRANGE
    mockConnection.executeQuery.mockResolvedValue([]);

    // ACT & ASSERT
    await expect(userRepository.getBy({ userName: 'nonexistentuser' })).rejects.toThrow(DoesNotExistError);
    expect(mockConnection.executeQuery).toHaveBeenCalledTimes(1);
  });

  // 3
  it('should throw FailedCreateUserError on SQL error', async () => {
    // ARRANGE
    mockConnection.executeQuery
      .mockImplementationOnce(() => {
        throw SQLError;
      });

    // ACT & ASSERT
    await expect(userRepository.getBy({ userName: 'testuser' })).rejects.toThrow(FailedGettingError);
    expect(mockConnection.executeQuery).toHaveBeenCalledTimes(1);
  });
});
