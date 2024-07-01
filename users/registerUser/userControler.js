import { validateUser } from '../../users/userSchema.js';
import { INVALID_DATA, USERS } from '../../utils/textConstants.js';
import { InvalidDataError } from '../../errors/ErrorTypes/invalidData.js';
import { tryCatch } from '../../utils/tryCatch.js'
// Function to create
export class UserController {
  constructor ({ userModel }) {
    this.userModel = userModel;
  }
  create = tryCatch(async (req, res) => {
    const { userName, password } = req.body
    const result = validateUser(userName, password);
    if (!result.success) {
      throw new InvalidDataError(INVALID_DATA, USERS);
    }
    const newUser = await this.userModel.create({ input: result.data });
    if (newUser) {
      res.status(201).json(newUser);
    }
  })
}
