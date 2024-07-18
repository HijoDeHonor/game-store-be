import { FAILED_ADDING, FAILED_GETTING, INVENTORY, SQLERROR } from '../utils/textConstants.js';
import { FailedGettingError } from '../errors/errorTypes/failedGettingError.js';
import { FailedAddingError } from '../errors/ErrorTypes/failedAddingError.js';

export class InventoryRepository {
  constructor ({ mySQLConnection }) {
    this.mySQLConnection = mySQLConnection;
  }

  async getByUserName (property) {
    try {
      const rows = await this.mySQLConnection.executeQuery(
        `SELECT items.Name, items.Img, user_items.Quantity
        FROM user_items
        JOIN items ON user_items.item_Name = items.Name
        WHERE user_items.user_userName = (?);
        ORDER BY items.name ASC;`,
        [property]
      );
      return rows;
    } catch (error) {
      if (error.name === SQLERROR) {
        throw new FailedGettingError(FAILED_GETTING, INVENTORY, error);
      }
      throw error;
    }
  }

  async getServerItems () {
    try {
      const rows = await this.mySQLConnection.executeQuery(
      `SELECT * FROM items
       ORDER BY Name ASC;`
      );
      if (!rows || rows.length === 0) {
        throw new FailedGettingError(FAILED_GETTING, INVENTORY);
      }
      return rows;
    } catch (error) {
      if (error.name === SQLERROR) {
        throw new FailedGettingError(FAILED_GETTING, INVENTORY, error);
      }
      throw error;
    };
  };

  async addItemToUser (userName, item, quantity) {
    try {
      const rows = await this.mySQLConnection.executeQuery(
      ` INSERT INTO user_items (user_userName, item_Name, Quantity)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE Quantity = Quantity + VALUES(Quantity);
      `,
      [userName, item, quantity]
      );
      if (rows.length === 0) {
        return false;
      }
      return true;
    } catch (error) {
      if (error.name === SQLERROR) {
        throw new FailedAddingError(FAILED_ADDING, INVENTORY, error);
      }
      throw error;
    }
  }
}
