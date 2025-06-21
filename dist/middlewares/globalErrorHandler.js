"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Something went wrong';
    let error = err;
    // Handle Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation failed';
    }
    res.status(statusCode).json({
        message,
        success: false,
        error
    });
    return;
};
exports.default = globalErrorHandler;
