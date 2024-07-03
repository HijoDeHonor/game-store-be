import mysql from 'mysql2/promise';
import { SQLError } from '../errors/ErrorTypes/SQLError.js';

export class MySQLConnection {
  constructor (connectionString) {
    this.connectionString = connectionString;
  }

  async executeQuery (query, parameters) {
    let connection;
    try {
      connection = await mysql.createConnection(this.connectionString);
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
