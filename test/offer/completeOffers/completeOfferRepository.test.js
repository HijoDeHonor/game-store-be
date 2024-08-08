import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MySQLConnection } from '../../../src/utils/mySQL/mySQLConnection.js';
import { OfferRepository } from '../../../src/offer/offerRepository.js';
import { TEST_ID_OFFER, TEST_USERNAME } from '../../../src/utils/textConstants.js';

describe('offerRepositoryComplete', () => {
  let offerRepository;
  let mySQLConnection;

  beforeEach(() => {
    mySQLConnection = new MySQLConnection({ defaultConfig: {} });
    vi.spyOn(mySQLConnection, 'executeQuery');
    offerRepository = new OfferRepository({ mySQLConnection });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should throw an error if some of the querys fails ', async () => {
    // arrange
    const id = TEST_ID_OFFER;
    const userName = TEST_USERNAME
    mySQLConnection.executeQuery.mockImplementationOnce(()=> {
      throw new SQLError(new FailedCreatingError());
    })
    // act
    expect(offerRepository.complete(id, userName)).rejects.toThrow();
  });

  it('should complete the offer whiout throwing', async () => {
    // arrange
    const id = TEST_ID_OFFER;
    const userName = TEST_USERNAME;
    mySQLConnection.executeQuery.mockImplementationOnce(() => Promise.resolve());
    // act
    expect(offerRepository.complete(id, userName)).resolves.not.toThrow();
  })
});
