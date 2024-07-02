import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { INVALID_DATA, TEST_PASSWORD, TEST_PASSWORD_WITH_SPACE, TEST_USERNAME, USERS, INVALID_DATA_ERROR, INTERNAL_SERVER_ERROR, TEST_DONT_EXIST_USERNAME, USER_DOES_NOT_EXIST_ERROR, USER_DOES_NOT_EXIST, TEST_TOKEN } from '../../utils/textConstants.js';
import { MySQLConnection } from '../../utils/mySQLConnection.js';
import request from 'supertest';
import { app } from '../../index.js';



describe('getByUserName', () => {

  // MysqlConnection mock settings
  let executeQueryMock;


  beforeEach(() => {
    executeQueryMock = vi.spyOn(MySQLConnection.prototype, 'executeQuery');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // TEST

  // 1
  it('should login if all goes rigth', async () => {
    //ASSERT
    executeQueryMock.mockImplementationOnce(() => Promise.resolve({ userName: TEST_USERNAME, password: TEST_PASSWORD }));

    // Act
    const res = await request(app)
      .get('/users')
      .send({ userName: TEST_USERNAME, password: TEST_PASSWORD });

    // Assert

    expect(executeQueryMock).toHaveBeenCalledTimes(1);
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
  it('should return an error if the user does not exists', async () => {
    // ARRANGE
    executeQueryMock.mockImplementationOnce(() => Promise.resolve([]));

    // ACT
    const res = await request(app)
      .get('/users')
      .send({ userName: TEST_DONT_EXIST_USERNAME, password: TEST_PASSWORD });

    // ASSERTS

    expect(400);
    expect(executeQueryMock).toHaveBeenCalledTimes(1);
    expect(res.body.name).toBe(USER_DOES_NOT_EXIST_ERROR);
    expect(res.body.entity).toBe(USERS);
    expect(res.body.message).toBe(USER_DOES_NOT_EXIST);
  });

  // 4
  it('should return a general creation error', async () => {
    // ARRANGE
    executeQueryMock.mockImplementationOnce(() => Promise.resolve());
    // ACT
    const res = await request(app)
      .get('/users')
      .send({ userName: TEST_USERNAME, password: TEST_PASSWORD });
    // ASSERT
    expect(500);
    expect(executeQueryMock).toHaveBeenCalledTimes(1);
    expect(res.body.message).toBe(INTERNAL_SERVER_ERROR);
  });
});