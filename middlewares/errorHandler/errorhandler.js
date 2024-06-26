

export const errorHandler = (error, req, res, next) => {
  const statusCode = Errors[error.name] || 500
  const message = statusCode >= 500 ? 'Internal Server Error' : error.message
  return res.status(statusCode).send(message)
}

const Errors = {
  ALREADY_EXIST_ERROR: 400,
  INVALID_DATA_ERROR: 400,
}