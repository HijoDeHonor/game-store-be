import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { app } from '../../../index.js';
import { HAS_BEEN_DELETE, TEST_ID_OFFER } from '../../../src/utils/textConstants.js';
import { MySQLConnection } from '../../../src/utils/mySQL/mySQLConnection.js';

describe('offerControllerDelete', () => {
  let executeQueryMock;
  const rows = {
    affectedRows: 1,
    success: true
  };

  beforeEach(() => {
    executeQueryMock = vi.spyOn(MySQLConnection.prototype, 'executeQuery');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should be able to delete the offer based on the id and return a success messagge', async () => {
    // arrange
    executeQueryMock.mockImplementationOnce(() => Promise.resolve(rows));
    // act
    const res = await request(app)
      .delete(`/offers/${TEST_ID_OFFER}`);
    // assert
    expect(res.status).toBe(200);
    expect(res.body).toBe(HAS_BEEN_DELETE);
  });
});
