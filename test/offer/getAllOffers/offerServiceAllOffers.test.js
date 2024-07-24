import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OfferRepository } from '../../../src/offer/offerRepository.js';
import { OfferService } from '../../../src/offer/offerService.js';
import { executeQueryExampleParse } from './executeQueryExample.js';

describe('offerServiceAllOffers', () => {
  let offerRepositoryMock;
  let offerService;

  beforeEach(() => {
    offerRepositoryMock = vi.spyOn(OfferRepository.prototype, 'getOffers');
    offerService = new OfferService({ offerRepository: new OfferRepository({ mySQLConnection: {} }) });
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should be able to return te complete array of the offers ', async () => {
    // ARRANGE
    offerRepositoryMock.mockResolvedValue(executeQueryExampleParse);

    // ACT
    const res = await offerService.getOffers('1');

    // ASSERT
    expect(res).toEqual(executeQueryExampleParse);
  });
});
