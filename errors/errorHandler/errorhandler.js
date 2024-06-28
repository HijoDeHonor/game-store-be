import { ALREADY_EXIST_ERROR, INVALID_DATA_ERROR } from "../../utils/textConstants.js"

const errors = {
  [ALREADY_EXIST_ERROR]: 400,
  [INVALID_DATA_ERROR]: 400,
}

export const errorHandler = (error, req, res, next) => {
  const statusCode = errors[error.name] || 500
  const message = statusCode >= 500 ? 'Internal Server Error' : error.message
  return res.status(statusCode).json({ ...error, message })
}