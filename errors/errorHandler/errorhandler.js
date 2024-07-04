import { INTERNAL_SERVER_ERROR } from '../../utils/textConstants.js';
import { errors } from './errorDictionary.js';

export const errorHandler = (error, req, res, next) => {
  const statusCode = errors[error.name] || 500;
  const message = statusCode >= 500 ? INTERNAL_SERVER_ERROR : error.message;
  console.log(error);
  return res.status(statusCode).json({ ...error, message });
};
