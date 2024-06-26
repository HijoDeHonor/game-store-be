import { validateUser } from '../../users/userSchema.js';
import { ERROR_CREATING_USER, FALIED_CREATE_USER, INVALID_DATA, INVALID_DATA_ERROR, USER_ALREADY_EXIST, USERS } from '../../utils/textConstants.js';

// Function to create
export class UserController {
  constructor ({ userModel }) {
    this.userModel = userModel;
  }

  create = async (req, res) => {
    const { userName, password } = req.body;
    const result = validateUser(userName, password);
    if (!result.success) {
      throw new InvalidDataError(INVALID_DATA, USERS);
    }
    try {
      const newUser = await this.userModel.create({ input: result.data });
      if (newUser) {
        res.status(201).json({ userName });
      }
    } catch (error) {
      if (error.message === `${ERROR_CREATING_USER}${USER_ALREADY_EXIST}`) {
        return res.status(400).json({ error: USER_ALREADY_EXIST });
      } else {
        return res.status(500).json({ error: FALIED_CREATE_USER });
      }
    }
  }
}

export class InvalidDataError extends Error {
  constructor (message, entity) {
    super(message); // Call the base class constructor
    this.name = INVALID_DATA_ERROR; // Assign error name
    this.entity = entity; // Assign entity if relevant
  }
}
