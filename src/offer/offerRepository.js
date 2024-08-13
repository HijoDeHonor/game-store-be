import moment from 'moment';
import dotenv from 'dotenv';
import { FailedGettingError } from '../errors/errorTypes/failedGettingError.js';
import { DATE_FORMAT, FAILED_COMPLETING, FAILED_CREATE, FAILED_GETTING, FAILED_GETTING_OFFER, OFFERS, SQLERROR, UUID_TO_BIN } from '../utils/textConstants.js';
import { FailedCreatingError } from '../errors/errorTypes/failedCreatingError.js';
import { FailedCompletingError } from '../errors/errorTypes/failedCompleting.js';
dotenv.config();

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

        const offerItemsQueries = offer.map(item =>
          this.mySQLConnection.executeQuery(
            'INSERT INTO offer_items (offer_id, item_Name, Quantity) VALUES (UUID_TO_BIN(?), ?, ?)',
            [id, item.itemName, item.quantity], connection
          )
        );
        await Promise.all(offerItemsQueries);

        const requestItemsQueries = request.map(item =>
          this.mySQLConnection.executeQuery(
            'INSERT INTO request_items (offer_id, item_Name, Quantity) VALUES (UUID_TO_BIN(?), ?, ?)',
            [id, item.itemName, item.quantity], connection
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
        AND
        o.completed = FALSE
      ORDER BY
        o.createDate DESC
      LIMIT ? OFFSET ?`,
        [limit, actualPage]
      );

      const ids = offerIdList.map(row => row.offerId);
      if (ids.length === 0) {
        return [];
      }
      const idsForQuery = ids.map(() => UUID_TO_BIN).join(', ');

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
          Id: offer.offerId,
          UserNamePoster: offer.userName,
          Offer: [],
          Request: []
        };
      });

      offerItems.forEach(item => {
        if (groupedOffers[item.offerId]) {
          groupedOffers[item.offerId].Offer.push({
            Name: item.offerItemName,
            Quantity: item.offerQuantity,
            Img: item.offerItemImg
          });
        }
      });

      requestItems.forEach(item => {
        if (groupedOffers[item.offerId]) {
          groupedOffers[item.offerId].Request.push({
            Name: item.requestItemName,
            Quantity: item.requestQuantity,
            Img: item.requestItemImg
          });
        }
      });

      const offerCounts = await this.mySQLConnection.executeQuery(
        'SELECT COUNT(*) as Counts FROM offers WHERE completed = false AND deleted = false;'
      );
      const counts = offerCounts[0].Counts;
      return { totalOffers: counts, offers: Object.values(groupedOffers) };
    } catch (error) {
      if (error.name === SQLERROR) {
        throw new FailedGettingError(FAILED_GETTING, OFFERS, error);
      }
      throw error;
    }
  }

  async getOffer (id) {
    try {
      const offer = await this.mySQLConnection.executeQuery(
        `SELECT
        BIN_TO_UUID(o.id) AS offer_id,
        o.userNamePoster
        FROM offers o
        WHERE o.id = UUID_TO_BIN(?)
        AND o.deleted = FALSE
        AND o.completed = FALSE`, [id]
      );
      if (!offer) {
        throw new FailedGettingError(FAILED_GETTING_OFFER, OFFERS);
      }

      const offerItems = await this.mySQLConnection.executeQuery(
        `SELECT
        oi.item_Name AS offerItemName,
        oi.Quantity AS offerQuantity,
        BIN_TO_UUID(o.id) AS offer_id
     FROM
        offers o
       LEFT JOIN offer_items oi ON o.id = oi.offer_id
       LEFT JOIN items i ON oi.item_Name = i.Name
     WHERE
        o.id = UUID_TO_BIN(?)`, [id]
      );
      if (offerItems.length === 0) {
        throw new FailedGettingError(FAILED_GETTING_OFFER, OFFERS);
      }

      const requestItems = await this.mySQLConnection.executeQuery(
        `SELECT
        ri.item_Name AS requestItemName,
        ri.Quantity AS requestQuantity,
        BIN_TO_UUID(o.id) AS offer_id
     FROM
        offers o
       LEFT JOIN request_items ri ON o.id = ri.offer_id
       LEFT JOIN items ir ON ri.item_Name = ir.Name
     WHERE
        o.id = UUID_TO_BIN(?)`, [id]
      );
      if (requestItems.length === 0) {
        throw new FailedGettingError(FAILED_GETTING_OFFER, OFFERS);
      }

      const offerMap = {
        [offer[0].offer_id]: {
          id: offer[0].offer_id,
          userNamePoster: offer[0].userNamePoster,
          offerItems: [],
          requestItems: []
        }
      };

      offerItems.forEach(item => {
        if (offerMap[item.offer_id]) {
          offerMap[item.offer_id].offerItems.push({ itemName: item.offerItemName, quantity: item.offerQuantity });
        }
      });

      requestItems.forEach(item => {
        if (offerMap[item.offer_id]) {
          offerMap[item.offer_id].requestItems.push({ itemName: item.requestItemName, quantity: item.requestQuantity });
        }
      });

      const result = Object.values(offerMap);

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

  async complete (id, userNameTrader, connection) {
    try {
      const date = moment().format(DATE_FORMAT);
      await this.mySQLConnection.executeQuery(
        `
        UPDATE offers
        SET completed = TRUE,
            completedDate = ?,
            completedBy = ?
        WHERE id = UUID_TO_BIN(?)
        `,
        [date, userNameTrader, id],
        connection
      );
    } catch (error) {
      if (error.name === SQLERROR) {
        throw new FailedGettingError(FAILED_GETTING, OFFERS, error);
      }
      throw error;
    }
  }

  async trasnferItemsAndcompleteOffer (id, userNameTrader, userNamePoster, requestItems, offerItems) {
    try {
      await this.mySQLConnection.executeTransaction(async (connection) => {
        const addItemsToTheUserPoster = requestItems.map(item =>
          this.inventoryRepository.addItemToUser(userNamePoster, item.itemName, item.quantity, connection)
        );
        await Promise.all(addItemsToTheUserPoster);

        const addItemsToTheUserTrader = offerItems.map(item =>
          this.inventoryRepository.addItemToUser(userNameTrader, item.itemName, item.quantity, connection)
        );
        await Promise.all(addItemsToTheUserTrader);

        await this.complete(id, userNameTrader, connection);
      });
      return true;
    } catch (error) {
      if (error.name === SQLERROR) {
        throw new FailedCompletingError(FAILED_COMPLETING, OFFERS, error);
      }
      throw error;
    }
  }
}
