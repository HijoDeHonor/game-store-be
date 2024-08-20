import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import app from '../../../index.js';
import { HAS_BEEN_DELETE, TEST_ID_OFFER, TEST_ITEM, TEST_USERNAME } from '../../../src/utils/textConstants.js';
import { MySQLConnection } from '../../../src/utils/mySQL/mySQLConnection.js';
import { OfferRepository } from '../../../src/offer/offerRepository.js';

describe('offerControllerDelete', () => {
  let executeTransactionMock;
  let executeQueryMock;

  const userNamePoster = TEST_USERNAME;
  const offerItems = [{ itemName: TEST_ITEM, quantity: 1 }];

  beforeEach(() => {
    executeTransactionMock = vi.spyOn(MySQLConnection.prototype, 'executeTransaction');
    executeQueryMock = vi.spyOn(OfferRepository.prototype, 'getOffer');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should be able to delete the offer based on the id and return a success messagge', async () => {
    // arrange
    executeQueryMock.mockImplementationOnce(() => Promise.resolve([{ userNamePoster, offerItems }]));
    executeTransactionMock.mockImplementationOnce(() => Promise.resolve(true));
    // act
    const res = await request(app)
      .delete(`/offers/${TEST_ID_OFFER}`);
    // assert

    expect(res.status).toBe(200);
    expect(res.body).toBe(HAS_BEEN_DELETE);
  });
});
