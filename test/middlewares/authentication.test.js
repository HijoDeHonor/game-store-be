// authenticateJWT.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { authenticateJWT } from '../../middlewares/authentication.js';
import dotenv from 'dotenv';
import { TEST_AUTHENTICATION_SUCCESS, TEST_TOKEN_INVALID } from '../../utils/textConstants.js';
dotenv.config();

const app = express();
app.use(cookieParser());

app.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: TEST_AUTHENTICATION_SUCCESS, userId: req.userid });
});

const secret = process.env.SECRET_KEY || 'iam-a-super-secure-secret-word'; // Usa el mismo secreto que en tu archivo original

describe('authenticateJWT', () => {
  let token;

  beforeEach(() => {
    token = jwt.sign({ id: 123 }, secret, { expiresIn: '1h' });
  });

  it('debería permitir acceso a rutas protegidas con un token válido', async () => {
    const res = await supertest(app)
      .get('/protected')
      .set('Cookie', [`acces_token=${token}`])
      .expect(200);
    console.log(res.body);
    expect(res.body).toMatchObject({
      message: TEST_AUTHENTICATION_SUCCESS,
      userId: { id: 123 }
    });
  });

  it('debería denegar acceso a rutas protegidas con un token inválido', async () => {
    const invalidToken = TEST_TOKEN_INVALID;
    const res = await supertest(app)
      .get('/protected')
      .set('Cookie', [`acces_token=${invalidToken}`])
      .expect(403);

    expect(res.body).toEqual({});
  });

  it('debería denegar acceso a rutas protegidas sin token', async () => {
    const res = await supertest(app)
      .get('/protected')
      .expect(401);

    expect(res.body).toEqual({});
  });
});
