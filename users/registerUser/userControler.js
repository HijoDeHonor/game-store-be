import { validateUser } from '../../users/userSchema.js';
import { INVALID_DATA, USERS } from '../../utils/textConstants.js';
import { InvalidDataError } from '../../errors/ErrorTypes/invalidData.js';
import { tryCatch } from '../../utils/tryCatch.js';


export class UserController {
  constructor ({ userModel }) {
    this.userModel = userModel;
  }
  create = tryCatch(async (req, res) => {
    const { userName, password } = req.body;
    const result = validateUser(userName, password);
    if (!result.success) {
      throw new InvalidDataError(INVALID_DATA, USERS);
    }
    const newUser = await this.userModel.create({ input: result.data });
    if (newUser) {
      res.status(201).json(newUser);
    }
  });
  getByUserName = tryCatch(async (req, res) => {
    const { userName, password } = req.body;
    const result = validateUser(userName, password);

    if (!result.success) throw new InvalidDataError(INVALID_DATA, USERS);

    const logUser = await this.userModel.getByUserName({ input: result.data });
    if (logUser) {
      const { token, ...userWithoutToken } = logUser;
      res
        .cookie('acces_token', logUser.token,
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
          }
        )
        .status(200)
        .json(userWithoutToken);
    }
  });


}
