import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MySQLConnection } from '../../../src/utils/mySQL/mySQLConnection.js';
import request from 'supertest';
import app from '../../../index.js';
import { SQLError } from '../../../src/errors/errorTypes/SQLError.js';
import { FAILED_GETTING, FAILED_GETTING_ERROR, OFFERS, TEST_OFFER_CONTROLLER_FILE_NAME, TEST_OFFER_REPOSITORY_METHOD_GET_ALL, TEST_OFFER_SERVICE_METHOD_GET_ALL, TEST_QUERY, TEST_QUERY_PARAMETER } from '../../../src/utils/textConstants.js';
import { FailedGettingError } from '../../../src/errors/errorTypes/failedGettingError.js';
import { executeQueryExampleFirstCall, executeQueryExampleParse, executeQueryExampleSecondCall, executeQueryExampleThirdCall } from './executeQueryExample.js';

const query = TEST_QUERY;
const queryParameter = TEST_QUERY_PARAMETER;
describe('getOffers', () => {
  let executeQueryMock;

  beforeEach(() => {
    executeQueryMock = vi.spyOn(MySQLConnection.prototype, 'executeQuery');
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should return the offers with a status of 200', async () => {
    // ARRANGE
    executeQueryMock
      .mockImplementationOnce(() => Promise.resolve(executeQueryExampleFirstCall))
      .mockImplementationOnce(() => Promise.resolve(executeQueryExampleSecondCall))
      .mockImplementationOnce(() => Promise.resolve(executeQueryExampleThirdCall))
      .mockImplementationOnce(() => Promise.resolve([{ Counts: 11 }]));
    // ACT
    const res = await request(app)
      .get('/offers/1');
    // ARRANGE
    expect(res.status).toBe(200);
    expect(res.body).toEqual(executeQueryExampleParse);
  });

  it('should reject with an error if the executequerry fails', async () => {
    // ARRANGE
    const errorInstance = new FailedGettingError(FAILED_GETTING, OFFERS);
    executeQueryMock.mockImplementationOnce(() => {
      throw new SQLError(errorInstance, query, queryParameter);
    });
    // ACT
    const res = await request(app)
      .get('/offers/1');
    // ASSERT
    expect(res.status).toBe(500);
    expect(res.body).toMatchObject({
      error: {
        name: FAILED_GETTING_ERROR,
        entity: OFFERS
      },
      message: errorInstance.message
    });
    expect(res.body.stack).toContain(FAILED_GETTING);
    expect(res.body.stack).toContain(TEST_OFFER_REPOSITORY_METHOD_GET_ALL);
    expect(res.body.stack).toContain(TEST_OFFER_SERVICE_METHOD_GET_ALL);
    expect(res.body.stack).toContain(TEST_OFFER_CONTROLLER_FILE_NAME);
  });
});
