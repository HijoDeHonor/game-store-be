import mysql from 'mysql2/promise';
import { SQLError } from '../../errors/errorTypes/SQLError.js';

export class MySQLConnection {
  constructor ({ defaultConfig }) {
    this.defaultConfig = defaultConfig;
  }

  async executeQuery (query, parameters) {
    let connection;
    try {
      connection = await mysql.createConnection(this.defaultConfig);
      const [rows, fields] = await connection.query(query, parameters);
      return rows;
    } catch (error) {
      throw new SQLError(error, query, parameters);
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  }
}
