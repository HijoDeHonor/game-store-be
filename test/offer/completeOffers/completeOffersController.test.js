import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import supertest from 'supertest';
import { OfferController } from '../../../src/offer/offerController.js';
import { HAS_BEEN_COMPLETE, TEST_ID_OFFER, TEST_USERNAME } from '../../../src/utils/textConstants.js';

const mockOfferService = {
  complete: vi.fn()
};

const app = express();
app.use(express.json());

describe('CompleteOfferController', () => {
  let controller;
  beforeEach(() => {
    mockOfferService.complete.mockReset();
    controller = new OfferController({ offerService: mockOfferService });

    app.patch('/offers/:id', controller.complete);
  });

  it('should be able to create a offer', async () => {
    // arrange
    mockOfferService.complete.mockImplementationOnce(() => Promise.resolve());
    // act
    const res = await supertest(app)
      .patch(`/offers/${TEST_ID_OFFER}`)
      .send({
        userName: TEST_USERNAME
      });

    // expect
    expect(res.status).toBe(200);
    expect(res.body).toBe(HAS_BEEN_COMPLETE);
    expect(mockOfferService.complete).toBeCalledWith(TEST_ID_OFFER, TEST_USERNAME);
  });
});
