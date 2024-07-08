import { tryCatch } from '../utils/tryCatch.js';

export class UserController {
  constructor ({ userService }) {
    this.userService = userService;
    this.create = this.create.bind(this);
    this.login = this.login.bind(this);
  }

  create = tryCatch(async (req, res) => {
    const { userName, password } = req.body;
    const newUser = await this.userService.create(userName, password);
    return res.status(201).json(newUser);
  });

  login = tryCatch(async (req, res) => {
    const { userName, password } = req.body;
    const logUser = await this.userService.login(userName, password);
    const logUserName = logUser.findUser[0].userName;
    const token = logUser.token;
    res
      .cookie('acces_token', token,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production'
        }
      )
      .status(200)
      .json({ userName: logUserName });
  });
}
