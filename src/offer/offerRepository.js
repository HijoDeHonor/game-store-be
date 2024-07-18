import moment from 'moment';
import { FailedGettingError } from '../errors/errorTypes/failedGettingError.js';
import { DATE_FORMAT, FAILED_GETTING, OFFERS, SQLERROR } from '../utils/textConstants.js';

export class OfferRepository {
  constructor ({ mySQLConnection }) {
    this.mySQLConnection = mySQLConnection;
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
        throw new FailedGettingError(FAILED_GETTING, OFFERS);
      } throw error;
    }
  };

  async deleteOffer (id) {
    try {
      const date = moment().format(DATE_FORMAT);
      const rows = await this.mySQLConnection.executeQuery(
        `UPDATE offers
         SET deleted = TRUE
             date = ?
         WHERE id = UUID_TO_BIN(?);`
        , [date, id]
      );
      if (rows.affectedRows === 0) {
        return false;
      }
      return true;
    } catch (error) {
      if (error.name === SQLERROR) {
        throw new FailedGettingError(FAILED_GETTING, OFFERS);
      } throw error;
    }
  }
}
