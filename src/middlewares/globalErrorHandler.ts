import { ErrorRequestHandler } from 'express'

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500
  let message = 'Something went wrong'
  let error = err

  // Handle Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = 'Validation failed'
  }

  res.status(statusCode).json({
    message,
    success: false,
    error
  })

  return // Make sure function ends with `void`
}

export default globalErrorHandler
