import mysql from 'mysql2/promise';
import { SQLERROR } from "./textConstants";

export class MySQLConnection {
  constructor (connectionSting) {
    this.connectionString = connectionSting;
  }
  async executeQuery (query, parameters) {
    let connection;
    try {
      connection = await mysql.createConnection(this.connectionString);
      const [result] = await connection.query(query, parameters);
      return result;
    } catch (error) {
      throw new SQLERROR(error, query, parameters);
    } finally {
      await connection.end();
    }
  }
}