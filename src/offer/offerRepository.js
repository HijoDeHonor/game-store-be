import { FailedGettingError } from '../errors/errorTypes/failedGettingError.js';
import { FAILED_GETTING, OFFERS, SQLERROR } from '../utils/textConstants.js';

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
       LEFT JOIN items ir ON ri.item_Name = ir.Name;`
      );
      return offerList;
    } catch (error) {
      if (error.name === SQLERROR) {
        throw new FailedGettingError(FAILED_GETTING, OFFERS);
      } throw error;
    }
  };
}
