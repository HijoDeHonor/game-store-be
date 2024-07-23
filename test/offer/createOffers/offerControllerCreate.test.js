import { beforeEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import supertest from 'supertest';
import { OfferController } from '../../../src/offer/offerController.js';
import { CREATE_SUCCESS, TEST_ID_OFFER, TEST_ITEM, TEST_ITEM2, TEST_USERNAME } from '../../../src/utils/textConstants.js';

const mockOfferService = {
  create: vi.fn()
};

const app = express();
app.use(express.json());

const offer = [{
  name: TEST_ITEM,
  Quantity: 5
}];

const request = [{
  name: TEST_ITEM2,
  Quantity: 1
}];

const id = TEST_ID_OFFER;

describe('OfferControllerCreate', () => {
  let controller;
  beforeEach(() => {
    mockOfferService.create.mockReset();
    controller = new OfferController({ offerService: mockOfferService });

    app.post('/offers', controller.create);
  });

  it('should be able to create a offer', async () => {
    // arrange
    mockOfferService.create.mockImplementationOnce(() => Promise.resolve());
    // act
    const res = await supertest(app)
      .post('/offers')
      .send({
        userName: TEST_USERNAME,
        offer,
        request,
        id
      });

    // expect
    expect(res.status).toBe(201);
    expect(res.body).toBe(CREATE_SUCCESS);
    expect(mockOfferService.create).toBeCalledWith(TEST_USERNAME, offer, request, id);
  });
});
