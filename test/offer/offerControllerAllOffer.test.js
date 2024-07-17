import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MySQLConnection } from '../../src/utils/mySQL/mySQLConnection.js';
import request from 'supertest';
import { app } from '../../index.js';
import { SQLError } from '../../src/errors/errorTypes/SQLError.js';
import { INTERNAL_SERVER_ERROR } from '../../src/utils/textConstants.js';

describe('getOffers', () => {
  let executeQueryMock;
  const offers = [
    {
      offer_id: 1,
      userNamePoster: 'SaturDon',
      offer_items: [
        {
          item_name: 'Martillo de Thor',
          quantity: 1,
          img: 'https://cdn-icons-png.freepik.com/256/12092/12092522.png?uid=R125020544&ga=GA1.1.297410512.1711637426&'
        }
      ],
      request_items: [
        {
          item_name: 'Arco de cristal',
          quantity: 1,
          img: 'https://cdn-icons-png.freepik.com/256/12569/12569010.png?uid=R125020544&ga=GA1.1.297410512.1711637426&'
        }
      ]
    }];

  beforeEach(() => {
    executeQueryMock = vi.spyOn(MySQLConnection.prototype, 'executeQuery');
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should return the offers with a status of 200', async () => {
    // ARRANGE
    executeQueryMock.mockImplementationOnce(() => Promise.resolve(offers));
    // ACT
    const res = await request(app)
      .get('/offers');
    // ARRANGE
    expect(res.status).toBe(200);
    expect(res.body).toEqual(offers);
  });

  it('should reject with an error if', async () => {
    // ARRANGE
    executeQueryMock.mockImplementationOnce(() => {
      throw new SQLError();
    });
    // ACT
    const res = await request(app)
      .get('/offers');
    // ASSERT
    expect(res.status).toBe(500);
    expect(res.body).toMatchObject({
      message: INTERNAL_SERVER_ERROR
    });
  });
});
