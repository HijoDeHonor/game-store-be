import moment from 'moment';
import { FailedGettingError } from '../errors/errorTypes/failedGettingError.js';
import { DATE_FORMAT, FAILED_CREATE, FAILED_GETTING, OFFERS, SQLERROR } from '../utils/textConstants.js';
import { FailedCreatingError } from '../errors/errorTypes/failedCreatingError.js';
import { v4 as uuidv4 } from 'uuid';

export class OfferRepository {
  constructor ({ mySQLConnection }) {
    this.mySQLConnection = mySQLConnection;
  }

  async create (userName, offer, request) {
    try {
      const newOffer = await this.mySQLConnection.executeTransaction(async (connection) => {
        const offerId = uuidv4();
        await connection.executeQuery(
          'INSERT INTO offers (id, userNamePoster) VALUES (UUID_TO_BIN(?), ?)',
          [offerId, userName]
        );

        const offerItemsQueries = offer.map(item =>
          connection.executeQuery(
            'INSERT INTO offer_items (offer_id, item_Name, Quantity) VALUES (UUID_TO_BIN(?), ?, ?)',
            [offerId, item.name, item.quantity]
          )
        );
        await Promise.all(offerItemsQueries);

        const requestItemsQueries = request.map(item =>
          connection.executeQuery(
            'INSERT INTO request_items (offer_id, item_Name, Quantity) VALUES (UUID_TO_BIN(?), ?, ?)',
            [offerId, item.name, item.quantity]
          )
        );
        await Promise.all(requestItemsQueries);

        return { success: true };
      });

      if (!newOffer.success) {
        return false;
      }
      return true;
    } catch (error) {
      if (error.name === SQLERROR) {
        throw new FailedCreatingError(FAILED_CREATE, OFFERS, error);
      }
      throw error;
    }
  }

  async getOffers () {
    try {
      const offerList = await this.mySQLConnection.executeQuery(
        `SELECT
           o.id AS offer_id,
           o.userNamePoster,
           oi.item_Name AS offer_item_name,
           oi.Quantity AS offer_quantity,
           i.Img AS offer_img,
           ri.item_Name AS request_item_name,
           ri.Quantity AS request_quantity,
           ir.Img AS request_img
         FROM
           offers o
           LEFT JOIN offer_items oi ON o.id = oi.offer_id
           LEFT JOIN items i ON oi.item_Name = i.Name
           LEFT JOIN request_items ri ON o.id = ri.offer_id
           LEFT JOIN items ir ON ri.item_Name = ir.Name
         WHERE
           o.deleted = FALSE;`
      );
      return offerList;
    } catch (error) {
      if (error.name === SQLERROR) {
        throw new FailedGettingError(FAILED_GETTING, OFFERS, error);
      }
      throw error;
    }
  }

  async deleteOffer (id) {
    try {
      const date = moment().format(DATE_FORMAT);
      const rows = await this.mySQLConnection.executeQuery(
        `UPDATE offers
         SET deleted = TRUE,
             date = ?
         WHERE id = UUID_TO_BIN(?);`,
        [date, id]
      );
      return rows.affectedRows > 0;
    } catch (error) {
      if (error.name === SQLERROR) {
        throw new FailedGettingError(FAILED_GETTING, OFFERS, error);
      }
      throw error;
    }
  }
}
