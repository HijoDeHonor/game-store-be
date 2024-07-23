import moment from 'moment';
import { FailedGettingError } from '../errors/errorTypes/failedGettingError.js';
import { DATE_FORMAT, FAILED_GETTING, OFFERS, SQLERROR } from '../utils/textConstants.js';

export class OfferRepository {
  constructor ({ mySQLConnection }) {
    this.mySQLConnection = mySQLConnection;
  }

  async getOffers (limit, offset) {
    try {
      const limitParse = parseInt(limit);
      const offsetParse = parseInt(offset);

      const offerIdList = await this.mySQLConnection.executeQuery(
        `SELECT
         BIN_TO_UUID(o.id) AS offerId,
         o.userNamePoster AS userName
       FROM
         offers o
       WHERE
         o.deleted = FALSE
       ORDER BY
         o.createDate DESC
       LIMIT ? OFFSET ?`,
        [limitParse, offsetParse]
      );
      const ids = offerIdList.map(row => row.offerId);
      if (ids.length === 0) {
        return [];
      }

      const offerItemsQuery = ids.map(id =>
        this.mySQLConnection.executeQuery(
          `SELECT 
          BIN_TO_UUID(o.id) AS offerId,
          oi.item_Name AS offerItemName,
          oi.Quantity AS offerQuantity,
          i.Img AS offerItemImg
         FROM 
          offers o
         LEFT JOIN offer_items oi ON o.id = oi.offer_id
         LEFT JOIN items i ON oi.item_Name = i.Name
         WHERE 
          o.id = UUID_TO_BIN(?)`,
          [id]
        )
      );
      const offerItemsResults = await Promise.all(offerItemsQuery);

      const requestItemsQuery = ids.map(id =>
        this.mySQLConnection.executeQuery(
          `SELECT
          BIN_TO_UUID(o.id) AS offerId,
          ri.item_Name AS requestItemName,
          ri.Quantity AS requestQuantity,
          ir.Img AS requestItemImg
         FROM
         offers o
         LEFT JOIN request_items ri ON o.id = ri.offer_id
         LEFT JOIN items ir ON ri.item_Name = ir.Name
         WHERE
         o.id = UUID_TO_BIN(?)`,
          [id]
        )
      );
      const requestItemsResults = await Promise.all(requestItemsQuery);

      const groupedOffers = offerIdList.map(({ offerId, userName }) => ({
        id: offerId,
        userName,
        offerItems: [],
        requestItems: []
      }));

      offerItemsResults.flat().forEach(row => {
        const offer = groupedOffers.find(offer => offer.id === row.offerId);
        if (offer) {
          offer.offerItems.push({
            name: row.offerItemName,
            quantity: row.offerQuantity,
            img: row.offerItemImg
          });
        }
      });

      requestItemsResults.flat().forEach(row => {
        const offer = groupedOffers.find(offer => offer.id === row.offerId);
        if (offer) {
          offer.requestItems.push({
            name: row.requestItemName,
            quantity: row.requestQuantity,
            img: row.requestItemImg
          });
        }
      });

      return groupedOffers;
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
         SET deleted = TRUE
             deleteDate = ?
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
