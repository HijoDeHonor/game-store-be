import mysql from 'mysql2/promise'
import { ERROR_CREATING_USER } from '../utils/textConstants'

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '123123123',
  database: 'GameStore'
}
const connectionString = DEFAULT_CONFIG

const connection = await mysql.createConnection(connectionString)

export class UserModel {
  static async create ({ input }) {
    const { userName, password } = input
    try {
      await connection.query(
        `INSERT INTO users (userName, password)
          VALUES (?, ?);`,
        [userName, password]
      )
    } catch (e) {
      // puede enviarle información sensible
      throw new Error(ERROR_CREATING_USER)
      // enviar la traza a un servicio interno
      // sendLog(e)
    }

    const [user] = await connection.query(
      `SELECT userName
        FROM users WHERE userName = (?);`,
      [userName]
    )

    return user[0]
  }
}