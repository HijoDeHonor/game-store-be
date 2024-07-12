import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.SECRET_KEY || 'iam-a-super-secure-secret-word';

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
