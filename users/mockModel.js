import fs from 'fs/promises'
import path from 'path'

import { ERROR_CREATING_USER, USER_ALREADY_EXIST } from '../utils/textConstants'

const DATABASE_FILE = path.resolve('users.json')

export class UserModel {
  static async create ({ input }) {
    const { userName, password } = input

    try {
      // Leer el archivo JSON
      const data = await fs.readFile(DATABASE_FILE, 'utf-8')
      const users = JSON.parse(data)

      const existingUser = users.find(user => user.userName === userName)
      if (existingUser) {
        throw new Error(USER_ALREADY_EXIST)
      }

      const newUser = { userName, password }
      users.push(newUser)

      await fs.writeFile(DATABASE_FILE, JSON.stringify(users, null, 2), 'utf-8')

      return { userName }
    } catch (e) {
      throw new Error(ERROR_CREATING_USER + e.message)
    }
  }
}


