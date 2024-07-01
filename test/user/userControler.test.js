import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { INVALID_DATA, FALIED_CREATE_USER, TEST_PASSWORD, TEST_PASSWORD_WITH_SPACE, TEST_USERNAME, ALREADY_EXIST_ERROR, USERS, INVALID_DATA_ERROR, USER_ALREADY_EXIST, INTERNAL_SERVER_ERROR, TEST_DONT_EXIST_USERNAME, USER_DONT_EXIST_ERROR, USER_DONT_EXIST } from '../../utils/textConstants.js';
import { MySQLConnection } from '../../utils/mySQLConnection.js';
import request from 'supertest';
import { app } from '../../index.js';



// test
describe('create', () => {

  // MysqlConnection mock settings
  let executeQueryMock;

  beforeEach(() => {
    executeQueryMock = vi.spyOn(MySQLConnection.prototype, 'executeQuery');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  //tests
  //1
  it('should create a user successfully', async () => {
    // Arrange
    const uniqueUserName = `TEST_USERNAME_${Date.now()}`;
    executeQueryMock.mockImplementationOnce(() => Promise.resolve([]))
      .mockImplementationOnce(() => Promise.resolve({ userName: uniqueUserName }));

    // Act
    const res = await request(app)
      .post('/users')
      .send({ userName: uniqueUserName, password: TEST_PASSWORD });

    // Assert
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ userName: uniqueUserName });
    expect(executeQueryMock).toHaveBeenCalledTimes(2);
  });
  //2
  it('should return a validation error', async () => {
    // ARRANGE

    // ACT 
    const res = await request(app)
      .post('/users')
      .send({ username: TEST_USERNAME, password: TEST_PASSWORD_WITH_SPACE });
    // ASSERT
    expect(400);
    expect(res.body.name).toBe(INVALID_DATA_ERROR);
    expect(res.body.entity).toBe(USERS);
    expect(res.body.message).toBe(INVALID_DATA);
  });
  //3
  it('should return an error if the user already exists', async () => {
    // ARRANGE
    executeQueryMock.mockImplementationOnce(() => Promise.resolve([{ userName: TEST_USERNAME }]));

    // ACT
    const res = await request(app)
      .post('/users')
      .send({ userName: TEST_USERNAME, password: TEST_PASSWORD });

    // ASSERTS
    expect(400);
    expect(executeQueryMock).toHaveBeenCalledTimes(1);
    expect(res.body.name).toBe(ALREADY_EXIST_ERROR);
    expect(res.body.entity).toBe(USERS);
    expect(res.body.message).toBe(USER_ALREADY_EXIST);
  });
  //4
  it('should return a general creation error', async () => {
    // ARRANGE
    executeQueryMock.mockImplementationOnce(() => Promise.resolve());
    // ACT
    const res = await request(app)
      .post('/users')
      .send({ userName: TEST_USERNAME, password: TEST_PASSWORD });
    // ASSERT
    expect(500);
    expect(executeQueryMock).toHaveBeenCalledTimes(1);
    expect(res.body.message).toBe(INTERNAL_SERVER_ERROR);
  });

});

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
    executeQueryMock.mockImplementationOnce(() => Promise.resolve([{ userName: TEST_USERNAME, password: TEST_PASSWORD }]));

    // Act
    const res = await request(app)
      .get('/users')
      .send({ userName: TEST_USERNAME, password: TEST_PASSWORD });

    // Assert

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ userName: TEST_USERNAME, });
    expect(executeQueryMock).toHaveBeenCalledTimes(1);
  });

  //2
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

  //3
  it('should return an error if the user already exists', async () => {
    // ARRANGE
    executeQueryMock.mockImplementationOnce(() => Promise.resolve([]));

    // ACT
    const res = await request(app)
      .get('/users')
      .send({ userName: TEST_DONT_EXIST_USERNAME, password: TEST_PASSWORD });

    // ASSERTS
    expect(400);
    expect(executeQueryMock).toHaveBeenCalledTimes(1);
    expect(res.body.name).toBe(USER_DONT_EXIST_ERROR);
    expect(res.body.entity).toBe(USERS);
    expect(res.body.message).toBe(USER_DONT_EXIST);
  });

  //4
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