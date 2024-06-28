import { describe, it, expect, vi } from 'vitest';
import { INVALID_DATA, FALIED_CREATE_USER, TEST_PASSWORD, TEST_PASSWORD_WITH_SPACE, TEST_USERNAME, ALREADY_EXIST_ERROR, USERS, INVALID_DATA_ERROR } from '../../utils/textConstants.js';
import { UserController } from '../../users/registerUser/userControler.js';
import { InvalidDataError } from '../../errors/ErrorTypes/invalidData.js';
import { validateUser } from '../../users/userSchema.js';
import { AlreadyExistError } from '../../errors/ErrorTypes/userAlreadyExist.js';
import { FailedCreateUserError } from '../../errors/ErrorTypes/FailedCreateUser.js';
import request from 'supertest';
import { app } from '../../index.js';
// Mock DEPENDENCIES
vi.mock('../../users/userSchema.js');
vi.mock('../../models/userModel.js');


// test
describe('create', () => {
  const userModelMock = {
    create: vi.fn()
  };

  const userController = new UserController({ userModel: userModelMock });

  const mockReqRes = (body) => {
    const req = { body };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    };
    return { req, res };
  };

  //1 ::check::
  it('should create a user successfully', async () => {
    // ARRANGE
    const uniqueUserName = `${TEST_USERNAME}${Date.now()}`;
    validateUser.mockReturnValue({ success: true, data: { userName: uniqueUserName, password: TEST_PASSWORD } });
    userModelMock.create.mockResolvedValue({ userName: uniqueUserName });
    const { req, res } = mockReqRes({ userName: uniqueUserName, password: TEST_PASSWORD });
    // ACT
    await userController.create(req, res);
    // ASSERT
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ userName: uniqueUserName });
  });

  //2
  it('should return a validation error', async () => {
    // ARRANGE
    validateUser.mockReturnValue({ success: false });
    const { req, res } = mockReqRes({ userName: TEST_USERNAME, password: TEST_PASSWORD_WITH_SPACE });
    const next = vi.fn();
    // ACT & ASSERT
    await userController.create(req, res, next);
    expect(next).toBeCalled()
    const [error] = next.mock.calls[0];
    expect(error).toBeInstanceOf(InvalidDataError);
    expect(error.message).toBe(INVALID_DATA);
  });

  //3
  it('should return an error if the user already exists', async () => {
    // ARRANGE
    validateUser.mockReturnValue({ success: true, data: { userName: TEST_USERNAME, password: TEST_PASSWORD } });
    userModelMock.create.mockRejectedValue(new AlreadyExistError(ALREADY_EXIST_ERROR, USERS));
    const { req, res } = mockReqRes({ userName: TEST_USERNAME, password: TEST_PASSWORD });
    const next = vi.fn()
    // ACT
    await userController.create(req, res, next);
    // ASSERT
    expect(next).toBeCalled()
    const [error] = next.mock.calls[0]
    expect(error).toBeInstanceOf(AlreadyExistError)
    expect(error.message).toBe(ALREADY_EXIST_ERROR)
    expect(error.entity).toBe(USERS)
  });

  //4
  it('should return a general creation error', async () => {
    // ARRANGE
    validateUser.mockReturnValue({ success: true, data: { userName: TEST_USERNAME, password: TEST_PASSWORD } });
    userModelMock.create.mockRejectedValue(new FailedCreateUserError(FALIED_CREATE_USER, USERS));
    const { req, res } = mockReqRes({ userName: TEST_USERNAME, password: TEST_PASSWORD });
    const next = vi.fn()
    // ACT
    await userController.create(req, res, next);
    // ASSERT
    expect(next).toBeCalled()
    const [error] = next.mock.calls[0]
    expect(error).toBeInstanceOf(FailedCreateUserError)
    expect(error.message).toBe(FALIED_CREATE_USER)
    expect(error.entity).toBe(USERS)
  });

  //5
  it('should return a 400 status on validation error', async () => {
    // ARRANGE
    validateUser.mockReturnValue({ success: false })
    // ACT
    const res = await request(app)
      .post('/users')
      .send({ userName: TEST_USERNAME, password: TEST_PASSWORD_WITH_SPACE });

    // ASSERT
    expect(res.status).toBe(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.entity).toBe(USERS);
    expect(res.body.message).toBe(INVALID_DATA);
    expect(res.body.name).toBe(INVALID_DATA_ERROR)
  })

});
