export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500
  const message = statusCode >= 500 ? 'Internal Server Error' : error.message
  return res.status(statusCode).send(message)
}
