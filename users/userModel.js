import { ALREADY_EXIST_ERROR, FALIED_CREATE_USER, SQLERROR, USERS } from '../utils/textConstants.js'
import { DEFAULT_CONFIG } from '../utils/MySQLConfig.js'
import { AlreadyExistError } from '../errors/ErrorTypes/userAlreadyExist.js'
import { FailedCreateUserError } from '../errors/ErrorTypes/FailedCreateUser.js'
import { MySQLConnection } from '../utils/mySQLConnection.js'

const connectionString = DEFAULT_CONFIG
const mySQLConnection = new MySQLConnection(connectionString)

export class UserModel {
  static async create ({ input }) {
    try {
      const { userName, password } = input
      const rows = await mySQLConnection.executeQuery(
        `SELECT userName FROM users WHERE userName = (?);`,
        [userName]
      );
      console.log('Rows:', rows);
      if (rows.length > 0) throw new AlreadyExistError(ALREADY_EXIST_ERROR, USERS);


      await mySQLConnection.executeQuery(
        `INSERT INTO users (userName, password)
          VALUES (?, ?);`,
        [userName, password]
      )
      return userName
    } catch (error) {
      if (error.name === SQLERROR) {
        throw new FailedCreateUserError(FALIED_CREATE_USER, USERS, error);
      }
      throw error
    }
  }
}
