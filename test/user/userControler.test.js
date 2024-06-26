import { describe, it, expect, vi } from 'vitest';
import { INVALID_DATA, USER_ALREADY_EXIST, FALIED_CREATE_USER, ERROR_CREATING_USER } from '../../utils/textConstants.js';
import { UserController, InvalidDataError } from '../../users/registerUser/userControler.js';
import { validateUser } from '../../users/userSchema.js';
vi.mock('../../users/userSchema.js');
vi.mock('../../models/UserModel.js'); // Mock the UserModel



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


  //1
  it('should create a user successfully', async () => {
    const uniqueUserName = `User_${Date.now()}`;
    validateUser.mockReturnValue({ success: true, data: { userName: uniqueUserName, password: 'Admin' } });
    userModelMock.create.mockResolvedValue({ userName: uniqueUserName });

    const { req, res } = mockReqRes({ userName: uniqueUserName, password: 'Admin' });

    await userController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ userName: uniqueUserName });
  });
  //2
  it('should return a validation error', async () => {
    validateUser.mockReturnValue({ success: false });

    const { req, res } = mockReqRes({ userName: 'Admin', password: 'Ad min' });

    try {
      await userController.create(req, res);
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidDataError);
      expect(error.message).toBe(INVALID_DATA);
    }
  });
  //3
  it('should return an error if the user already exists', async () => {
    validateUser.mockReturnValue({ success: true, data: { userName: 'Admin', password: 'Admin' } });
    userModelMock.create.mockRejectedValue(new Error(`${ERROR_CREATING_USER}${USER_ALREADY_EXIST}`));

    const { req, res } = mockReqRes({ userName: 'Admin', password: 'Admin' });

    await userController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: USER_ALREADY_EXIST });
  });
  //4
  it('should return a general creation error', async () => {
    validateUser.mockReturnValue({ success: true, data: { userName: 'Admin', password: 'Admin' } });
    userModelMock.create.mockRejectedValue(new Error(FALIED_CREATE_USER));

    const { req, res } = mockReqRes({ userName: 'Admin', password: 'Admin' });

    await userController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: FALIED_CREATE_USER });
  });


})
