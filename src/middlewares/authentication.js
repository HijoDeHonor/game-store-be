import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { SECRET_TOKEN_KEY } from '../utils/textConstants.js';

dotenv.config();

const secret = process.env.SECRET_KEY || SECRET_TOKEN_KEY;

export const authenticateJWT = (req, res, next) => {
  const token = req.cookies.acces_token;

  if (token) {
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.userid = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
