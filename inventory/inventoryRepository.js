import { FAILED_GETTING, INVENTORY, SQLERROR } from '../utils/textConstants.js';
import { FailedGettingError } from '../errors/errorTypes/failedGettingError.js';

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
}
