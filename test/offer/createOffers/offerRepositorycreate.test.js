import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MySQLConnection } from '../../../src/utils/mySQL/mySQLConnection.js';
import { OfferRepository } from '../../../src/offer/offerRepository.js';
import { SQLError } from '../../../src/errors/errorTypes/SQLError.js';
import { TEST_ITEM, TEST_ITEM2, TEST_USERNAME } from '../../../src/utils/textConstants.js';
import { FailedCreatingError } from '../../../src/errors/errorTypes/failedCreatingError.js';

const offer = [{
  name: TEST_ITEM,
  Quantity: 5
}];

const request = [{
  name: TEST_ITEM2,
  Quantity: 2
}];

describe('offerRepositoryCreate', () => {
  let offerRepository;
  let mySQLConnection;

  beforeEach(() => {
    mySQLConnection = new MySQLConnection({ defaultConfig: {} }); // Inicializa con la configuración necesaria
    vi.spyOn(mySQLConnection, 'executeTransaction'); // Espía el método en la instancia
    offerRepository = new OfferRepository({ mySQLConnection });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should reject with error if the SQL fails', async () => {
    // Arrange
    mySQLConnection.executeTransaction.mockImplementationOnce(() => {
      throw new SQLError(new FailedCreatingError());
    });

    // Act & assert
    await expect(offerRepository.create(TEST_USERNAME, offer, request)).rejects.toThrow(FailedCreatingError);
  });

  it('should return true on sql success', async () => {
    // arrange
    mySQLConnection.executeTransaction.mockImplementationOnce(() => Promise.resolve({ success: true }));
    // act
    const res = await offerRepository.create(TEST_USERNAME, offer, request);
    // assert
    expect(res).toBe(true);
  });
});
