import { ErrorRequestHandler } from 'express'

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    // If headers already sent, delegate to default Express handler
    return next(err)
  }

  let statusCode = 500
  let message = 'Something went wrong'

  if (err.name === 'ValidationError') {
    statusCode = 400
    message = 'Validation failed'
  }

  res.status(statusCode).json({
    message,
    success: false,
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack
    }
  })
}

export default globalErrorHandler
