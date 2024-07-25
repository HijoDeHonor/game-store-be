import moment from 'moment';
import dotenv from 'dotenv';
import { FailedGettingError } from '../errors/errorTypes/failedGettingError.js';
import { DATE_FORMAT, FAILED_GETTING, OFFERS, SQLERROR } from '../utils/textConstants.js';
dotenv.config();

export class OfferRepository {
  constructor ({ mySQLConnection }) {
    this.mySQLConnection = mySQLConnection;
  }

  async getOffers (page) {
    try {
      const limit = 10;
      const actualPage = (parseInt(page) - 1) * limit;
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
        [limit, actualPage]
      );

      const ids = offerIdList.map(row => row.offerId);
      if (ids.length === 0) {
        return [];
      }
      const idsForQuery = ids.map(() => 'UUID_TO_BIN(?)').join(', ');

      const offerItemsQuery = `
      SELECT 
        BIN_TO_UUID(o.id) AS offerId,
        oi.item_Name AS offerItemName,
        oi.Quantity AS offerQuantity,
        i.Img AS offerItemImg
      FROM 
        offers o
        LEFT JOIN offer_items oi ON o.id = oi.offer_id
        LEFT JOIN items i ON oi.item_Name = i.Name
      WHERE 
        o.id IN (${idsForQuery})
    `;
      const offerItems = await this.mySQLConnection.executeQuery(offerItemsQuery, ids);

      const requestItemsQuery = `
      SELECT 
        BIN_TO_UUID(o.id) AS offerId,
        ri.item_Name AS requestItemName,
        ri.Quantity AS requestQuantity,
        ir.Img AS requestItemImg
      FROM 
        offers o
        LEFT JOIN request_items ri ON o.id = ri.offer_id
        LEFT JOIN items ir ON ri.item_Name = ir.Name
      WHERE 
        o.id IN (${idsForQuery})
    `;
      const requestItems = await this.mySQLConnection.executeQuery(requestItemsQuery, ids);

      const groupedOffers = {};

      offerIdList.forEach(offer => {
        groupedOffers[offer.offerId] = {
          id: offer.offerId,
          userName: offer.userName,
          offerItems: [],
          requestItems: []
        };
      });

      offerItems.forEach(item => {
        if (groupedOffers[item.offerId]) {
          groupedOffers[item.offerId].offerItems.push({
            name: item.offerItemName,
            quantity: item.offerQuantity,
            img: item.offerItemImg
          });
        }
      });

      requestItems.forEach(item => {
        if (groupedOffers[item.offerId]) {
          groupedOffers[item.offerId].requestItems.push({
            name: item.requestItemName,
            quantity: item.requestQuantity,
            img: item.requestItemImg
          });
        }
      });

      return Object.values(groupedOffers);
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
