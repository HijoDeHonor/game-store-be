import { FALIED_CREATE_USER, FALIED_LOGIN_USER, INVALID_LOGIN, SQLERROR, USERS, USER_ALREADY_EXIST, USER_DONT_EXIST } from '../utils/textConstants.js';
import { DEFAULT_CONFIG } from '../utils/MySQLConfig.js';
import { AlreadyExistError } from '../errors/ErrorTypes/userAlreadyExist.js';
import { FailedCreateUserError } from '../errors/ErrorTypes/FailedCreateUser.js';
import { MySQLConnection } from '../utils/mySQLConnection.js';
import { UserDontExistError } from '../errors/ErrorTypes/userDontExist.js';
import { InvalidLoginError } from '../errors/ErrorTypes/invalidLogin.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
const connectionString = DEFAULT_CONFIG;
const mySQLConnection = new MySQLConnection(connectionString);
export class UserModel {
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

  static async getByUserName ({ input }) {
    try {
      const { userName, password } = input;
      const rows = await mySQLConnection.executeQuery(
        `SELECT * FROM users WHERE userName = (?);`,
        [userName]
      );

      if (rows.length === 0) throw new UserDontExistError(USER_DONT_EXIST, USERS);
      const user = rows[0];
      if (user.password !== password) {
        throw new InvalidLoginError(INVALID_LOGIN, USERS);
      }
      const token = jwt.sign({ userName: user.userName },
        SECRET_KEY,
        {
          expiresIn: '1h'
        });

      return {
        userName: user.userName,
        token: token
      };
    } catch (error) {
      if (error.name === SQLERROR) {
        throw new FailedCreateUserError(FALIED_LOGIN_USER, USERS, error);
      }
      throw error;
    }
  }
}
