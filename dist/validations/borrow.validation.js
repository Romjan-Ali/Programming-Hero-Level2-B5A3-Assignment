"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowBookZodSchema = exports.createBorrowZodSchema = void 0;
const zod_1 = require("zod");
exports.createBorrowZodSchema = zod_1.z.object({
    book: zod_1.z.string({ required_error: 'Book ID is required' }),
    quantity: zod_1.z.number().int().min(1, 'Quantity must be at least 1'),
    dueDate: zod_1.z.coerce.date({ required_error: 'Due date is required' })
});
exports.borrowBookZodSchema = zod_1.z.object({
    book: zod_1.z.string({
        required_error: 'Book ID is required',
        invalid_type_error: 'Book ID must be a string',
    }).min(1, 'Book ID cannot be empty'),
    quantity: zod_1.z.number({
        required_error: 'Quantity is required',
        invalid_type_error: 'Quantity must be a number',
    })
        .int('Quantity must be an integer')
        .positive('Quantity must be a positive number'),
    dueDate: zod_1.z.string({
        required_error: 'Due date is required',
        invalid_type_error: 'Due date must be a string in ISO date format',
    }).refine((val) => !isNaN(Date.parse(val)), {
        message: 'Due date must be a valid ISO date string',
    }),
});
