import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.SECRET_KEY || 'iam-a-super-secure-secret-word';
const tokenExpirationTimeSeconds = process.env.TOKEN_EXPIRATION_TIME_SECONDS || 3600;

export const jwtCreator = (payload) => {
  return jwt.sign(
    payload,
    secret,
    {
      expiresIn: tokenExpirationTimeSeconds
    }
  );
};
