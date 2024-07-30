import { FAILED_ADDING, FAILED_DELETING, FAILED_GETTING, INVENTORY, SQLERROR } from '../utils/textConstants.js';
import { FailedGettingError } from '../errors/errorTypes/failedGettingError.js';
import { FailedAddingError } from '../errors/ErrorTypes/failedAddingError.js';
import { FailedToDeleteError } from '../errors/ErrorTypes/failedToDeleteError.js';

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
        WHERE user_items.user_userName = (?)
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

  async addItemToUser (userName, itemName, quantity) {
    try {
      const rows = await this.mySQLConnection.executeQuery(
      ` INSERT INTO user_items (user_userName, item_Name, Quantity)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE Quantity = Quantity + VALUES(Quantity);
      `,
      [userName, itemName, quantity]
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

  async removeItemFromUser (userName, itemName, quantity, connection) {
    try {
      const res = await this.mySQLConnection.executeQuery(
        `
        UPDATE user_items
        SET Quantity = ?
        WHERE user_userName = ?
        AND item_Name = ?;
        `, [quantity, userName, itemName], connection
      );
      return res.affectedRows > 0;
    } catch (error) {
      if (error.name === SQLERROR) {
        throw new FailedToDeleteError(FAILED_DELETING, INVENTORY, error);
      }
      throw error;
    }
  }

  async deleteItem (userName, itemName, connection) {
    try {
      await this.mySQLConnection.executeQuery(
       `
       DELETE FROM user_items
       WHERE user_userName = ?
       AND item_Name = ?;
       `
       , [userName, itemName], connection
      );
    } catch (error) {
      if (error.name === SQLERROR) {
        throw new FailedToDeleteError(FAILED_DELETING, INVENTORY, error);
      }
      throw error;
    }
  }

  async getQuantitys (userName, list) {
    try {
      const quantityPromises = list.map(item =>
        this.mySQLConnection.executeQuery(
          `
        SELECT 
        Quantity,
        item_name
        FROM user_items
        WHERE user_userName = ? AND item_Name = ?
        `, [userName, item.name]
        )
      );
      const quantityResults = await Promise.all(quantityPromises);

      const quantities = quantityResults.map((result, index) => {
        if (result.length === 0) {
          return { itemName: list[index].name, quantity: 0 };
        }
        return { itemName: list[index].name, quantity: result[0].Quantity };
      });

      return quantities;
    } catch (error) {
      if (error.name === 'SQLERROR') {
        throw new FailedGettingError('FAILED_GETTING', 'INVENTORY', error);
      }
      throw error;
    }
  }
}
