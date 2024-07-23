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
      const newOffer = await this.mySQLConnection.executeTransaction(async () => {
        const offerId = uuidv4();
        await this.mySQLConnection.executeQuery(
          'INSERT INTO offers (id, userNamePoster) VALUES (UUID_TO_BIN(?), ?)',
          [offerId, userName]
        );

        const offerItemsQueries = offer.map(item =>
          this.mySQLConnection.executeQuery(
            'INSERT INTO offer_items (offer_id, item_Name, Quantity) VALUES (UUID_TO_BIN(?), ?, ?)',
            [offerId, item.name, item.Quantity]
          )
        );
        await Promise.all(offerItemsQueries);

        const requestItemsQueries = request.map(item =>
          this.mySQLConnection.executeQuery(
            'INSERT INTO request_items (offer_id, item_Name, Quantity) VALUES (UUID_TO_BIN(?), ?, ?)',
            [offerId, item.name, item.Quantity]
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
      const offers = await this.mySQLConnection.executeQuery(
        `SELECT 
     BIN_TO_UUID(o.id) AS offer_id,
     o.userNamePoster AS user_name,
     oi.item_Name AS offer_item_name,
     oi.Quantity AS offer_quantity,
     i.Img AS offer_item_img,
     ri.item_Name AS request_item_name,
     ri.Quantity AS request_quantity,
     ir.Img AS request_item_img
   FROM 
     offers o
     LEFT JOIN offer_items oi ON o.id = oi.offer_id
     LEFT JOIN items i ON oi.item_Name = i.Name
     LEFT JOIN request_items ri ON o.id = ri.offer_id
     LEFT JOIN items ir ON ri.item_Name = ir.Name
   WHERE 
     o.deleted = FALSE
   ORDER BY 
     o.id, offer_item_name, request_item_name;`
      );

      const groupedOffers = offers.reduce((acc, row) => {
        if (!acc[row.offer_id]) {
          acc[row.offer_id] = {
            id: row.offer_id,
            userName: row.user_name,
            offerItems: [],
            requestItems: [],
            offerItemsSet: new Set(),
            requestItemsSet: new Set()
          };
        }

        if (row.offer_item_name) {
          const itemKey = row.offer_item_name;
          if (!acc[row.offer_id].offerItemsSet.has(itemKey)) {
            acc[row.offer_id].offerItemsSet.add(itemKey);
            acc[row.offer_id].offerItems.push({
              Name: itemKey,
              Quantity: row.offer_quantity,
              img: row.offer_item_img
            });
          }
        }

        if (row.request_item_name) {
          const itemKey = row.request_item_name;
          if (!acc[row.offer_id].requestItemsSet.has(itemKey)) {
            acc[row.offer_id].requestItemsSet.add(itemKey);
            acc[row.offer_id].requestItems.push({
              Name: itemKey,
              Quantity: row.request_quantity,
              img: row.request_item_img
            });
          }
        }

        return acc;
      }, {});

      const result = Object.values(groupedOffers).map(({ offerItemsSet, requestItemsSet, ...rest }) => rest);

      return result;
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
