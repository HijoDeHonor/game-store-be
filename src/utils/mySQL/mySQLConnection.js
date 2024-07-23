import mysql from 'mysql2/promise';
import { SQLError } from '../../errors/errorTypes/SQLError.js';

export class MySQLConnection {
  constructor ({ defaultConfig }) {
    this.defaultConfig = defaultConfig;
  }

  async executeQuery (query, parameters, connection) {
    let conn = connection;
    try {
      if (!conn) {
        conn = await mysql.createConnection(this.defaultConfig);
      }
      conn = await mysql.createConnection(this.defaultConfig);
      const [rows] = await conn.query(query, parameters);
      return rows;
    } catch (error) {
      throw new SQLError(error, query, parameters);
    } finally {
      if (conn) {
        await conn.end();
      }
    }
  }

  async executeTransaction (transactionFunction) {
    let connection;
    try {
      connection = await mysql.createConnection(this.defaultConfig);
      await connection.beginTransaction();
      const result = await transactionFunction(connection);
      await connection.commit();
      return result;
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      throw error;
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  }
}
