import { FALIED_CREATE_USER, FALIED_LOGIN_USER, INVALID_LOGIN, SQLERROR, USERS, USER_ALREADY_EXIST, USER_DOES_NOT_EXIST } from '../utils/textConstants.js';
import { DEFAULT_CONFIG } from '../utils/MySQLConfig.js';
import { AlreadyExistError } from '../errors/ErrorTypes/userAlreadyExist.js';
import { FailedCreateUserError } from '../errors/ErrorTypes/FailedCreateUser.js';
import { MySQLConnection } from '../utils/mySQLConnection.js';
import { UserDoesNotExistError } from '../errors/ErrorTypes/userDoesNotExist.js';

const connectionString = DEFAULT_CONFIG;
const mySQLConnection = new MySQLConnection(connectionString);

export class UserRepository {
  static async create ({ input }) {
    try {
      const { userName, password } = input;
      const rows = await mySQLConnection.executeQuery(
        `SELECT userName FROM users WHERE userName = (?);`,
        [userName]
      );
      if (rows.length > 0) throw new AlreadyExistError(USER_ALREADY_EXIST, USERS);

      await mySQLConnection.executeQuery(
        `INSERT INTO users (userName, password)
          VALUES (?, ?);`,
        [userName, password]
      );
      return { userName: userName };

    } catch (error) {
      if (error.name === SQLERROR) {
        throw new FailedCreateUserError(FALIED_CREATE_USER, USERS, error);
      }
      throw error;
    }
  }

  static async getBy (property, value) {
    try {
      const rows = await mySQLConnection.executeQuery(
        `SELECT * FROM users WHERE (?) = (?);`,
        [property, value]
      );

      if (rows.length === 0) {
        throw new UserDoesNotExistError(USER_DOES_NOT_EXIST, USERS);
      }

      return rows;

    } catch (error) {
      if (error.name === SQLERROR) {
        throw new FailedCreateUserError(FALIED_LOGIN_USER, USERS, error);
      }
      throw error;
    }
  }
}
