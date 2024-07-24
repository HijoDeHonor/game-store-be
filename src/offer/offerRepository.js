import moment from 'moment';
import { FailedGettingError } from '../errors/errorTypes/failedGettingError.js';
import { DATE_FORMAT, FAILED_COMPLETING, FAILED_CREATE, FAILED_GETTING, INVALID_DATA, OFFERS, SQLERROR } from '../utils/textConstants.js';
import { FailedCreatingError } from '../errors/errorTypes/failedCreatingError.js';
import { InvalidDataError } from '../errors/errorTypes/invalidDataError.js';
import { FailedCompletingError } from '../errors/ErrorTypes/failedCompleting.js';

export class OfferRepository {
  constructor ({ mySQLConnection, inventoryRepository }) {
    this.mySQLConnection = mySQLConnection;
    this.inventoryRepository = inventoryRepository;
  }

  async create (id, userName, offer, request) {
    try {
      const newOffer = await this.mySQLConnection.executeTransaction(async (connection) => {
        const date = moment().format(DATE_FORMAT);
        await this.mySQLConnection.executeQuery(
          'INSERT INTO offers (id, userNamePoster, createDate) VALUES (UUID_TO_BIN(?), ?, ?)',
          [id, userName, date]
        );

        const offerDeleteItem = offer.map(item =>
          this.inventoryRepository.removeItemToUser(userName, item.name, item.Quantity, connection)
        );
        await Promise.all(offerDeleteItem);

        const offerItemsQueries = offer.map(item =>
          this.mySQLConnection.executeQuery(
            'INSERT INTO offer_items (offer_id, item_Name, Quantity) VALUES (UUID_TO_BIN(?), ?, ?)',
            [id, item.name, item.Quantity], connection
          )
        );
        await Promise.all(offerItemsQueries);

        const requestItemsQueries = request.map(item =>
          this.mySQLConnection.executeQuery(
            'INSERT INTO request_items (offer_id, item_Name, Quantity) VALUES (UUID_TO_BIN(?), ?, ?)',
            [id, item.name, item.Quantity], connection
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

  async deleteOffer (id, connection) {
    try {
      const date = moment().format(DATE_FORMAT);
      const rows = await this.mySQLConnection.executeQuery(
        `UPDATE offers
         SET deleted = TRUE,
             deleteDate = ?
         WHERE id = UUID_TO_BIN(?)`,
        [date, id], connection
      );
      return rows.affectedRows > 0;
    } catch (error) {
      if (error.name === SQLERROR) {
        throw new FailedGettingError(FAILED_GETTING, OFFERS, error);
      }
      throw error;
    }
  }

  async complete (id, userNameTrader) {
    try {
      const activeOfferUserNameResult = await this.mySQLConnection.executeQuery(
        `
        SELECT userNamePoster
        FROM offers
        WHERE id = UUID_TO_BIN(?)
        AND deleted = false;
        `, [id]
      );

      if (activeOfferUserNameResult.length === 0) {
        throw new InvalidDataError(INVALID_DATA, OFFERS);
      }

      const activeOfferUserName = activeOfferUserNameResult[0].userNamePoster;

      const offerToCompleteTransaction = await this.mySQLConnection.executeTransaction(async (connection) => {
        const offerItems = await this.mySQLConnection.executeQuery(
          `SELECT
            oi.item_Name AS offerItemName,
            oi.Quantity AS offerQuantity
           FROM
            offers o
           LEFT JOIN offer_items oi ON o.id = oi.offer_id
           LEFT JOIN items i ON oi.item_Name = i.Name
           WHERE
            o.id = UUID_TO_BIN(?)`, [id], connection
        );

        if (offerItems.length === 0) {
          throw FailedGettingError(FailedGettingError, OFFERS);
        }
        console.log(offerItems);
        const requestItems = await this.mySQLConnection.executeQuery(
          `SELECT
            ri.item_Name AS requestItemName,
            ri.Quantity AS requestQuantity
           FROM
            offers o
           LEFT JOIN request_items ri ON o.id = ri.offer_id
           LEFT JOIN items ir ON ri.item_Name = ir.Name
           WHERE
            o.id = UUID_TO_BIN(?)`, [id], connection
        );
        console.log(requestItems);
        if (requestItems.length === 0) {
          throw FailedGettingError(FailedGettingError, OFFERS);
        }

        const addItemsToTheUserPoster = requestItems.map(item =>
          this.inventoryRepository.addItemToUser(activeOfferUserName, item.requestItemName, item.requestQuantity, connection)
        );
        await Promise.all(addItemsToTheUserPoster);

        const addItemsToTheUserTrader = offerItems.map(item =>
          this.inventoryRepository.addItemToUser(userNameTrader, item.offerItemName, item.offerQuantity, connection)
        );
        await Promise.all(addItemsToTheUserTrader);

        const removeItemTotheUserTrader = requestItems.map(item =>
          this.inventoryRepository.removeItemToUser(userNameTrader, item.requestItemName, item.requestQuantity, connection)
        );

        await Promise.all(removeItemTotheUserTrader);

        const isDelete = await this.deleteOffer(id, connection);

        if (isDelete) {
          return { success: true };
        }
      });
      if (!offerToCompleteTransaction.success) {
        throw new FailedCompletingError(FAILED_COMPLETING, OFFERS);
      }
    } catch (error) {
      if (error.name === SQLERROR) {
        throw new FailedGettingError(FAILED_GETTING, OFFERS, error);
      }
      throw error;
    }
  }
}
