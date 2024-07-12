import { DOES_NOT_EXIST, FAILED_GETTING, INVENTORY, SQLERROR } from '../utils/textConstants.js';
import { DoesNotExistError } from '../errors/errorTypes/doesNotExistError.js';
import { FailedGettingError } from '../errors/errorTypes/failedGettingError.js';

export class InventoryRepository {
  constructor ({ mySQLConnection }) {
    this.mySQLConnection = mySQLConnection;
  }

  async getByUserId (property) {
    try {
      const userRows = await this.mySQLConnection.executeQuery(
        'SELECT userName FROM users WHERE id = (?);',
        [property]
      );
      if (userRows.length === 0) {
        throw new DoesNotExistError(DOES_NOT_EXIST, INVENTORY);
      }
      const rows = await this.mySQLConnection.executeQuery(
        `SELECT items.id, items.name, user_items.cantidad, items.imgUrl
        FROM items
        JOIN user_items ON items.id = user_items.item_id
        JOIN users ON user_items.user_id = users.id
        WHERE users.id = (?)
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
