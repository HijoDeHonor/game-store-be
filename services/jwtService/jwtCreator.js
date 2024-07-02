import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.SECRET_KEY;
const tokenExpirationTimeSeconds = process.env.TOKEN_EXPIRATION_TIME_SECONDS;

export const jwtCreator = (payload) => {
  return jwt.sign(
    payload,
    secret,
    {
      expiresIn: tokenExpirationTimeSeconds
    }
  );
};