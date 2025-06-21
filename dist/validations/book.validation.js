"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookZodSchema = exports.getBookByIdZodSchema = exports.getAllBooksQuerySchema = exports.createBookZodSchema = void 0;
const zod_1 = require("zod");
exports.createBookZodSchema = zod_1.z.object({
    title: zod_1.z.string({
        required_error: 'Title is required'
    }),
    author: zod_1.z.string({
        required_error: 'Author is required'
    }),
    genre: zod_1.z.enum(['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'], { required_error: 'Genre is required and must be a valid value' }),
    isbn: zod_1.z.string({
        required_error: 'ISBN is required'
    }),
    description: zod_1.z.string().optional(),
    copies: zod_1.z
        .number({
        required_error: 'Copies is required'
    })
        .min(0, 'Copies must be a non-negative number'),
    available: zod_1.z.boolean().optional()
});
exports.getAllBooksQuerySchema = zod_1.z.object({
    filter: zod_1.z
        .string()
        .optional()
        .transform(val => val === null || val === void 0 ? void 0 : val.toUpperCase()),
    sortBy: zod_1.z.string().optional().default('createdAt'),
    sort: zod_1.z.enum(['asc', 'desc']).optional().default('desc'),
    limit: zod_1.z
        .string()
        .optional()
        .transform(val => (val ? parseInt(val, 10) : 10))
        .refine(val => val > 0, { message: 'Limit must be a positive number' })
});
exports.getBookByIdZodSchema = zod_1.z.object({
    bookId: zod_1.z
        .string({
        required_error: 'bookId is required'
    })
        .refine(val => /^[a-f\d]{24}$/i.test(val), {
        message: 'Invalid bookId format'
    })
});
exports.updateBookZodSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    author: zod_1.z.string().optional(),
    genre: zod_1.z.enum(['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY']).optional(),
    isbn: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    copies: zod_1.z
        .number()
        .min(0, 'Copies must be a non-negative number')
        .optional(),
    available: zod_1.z.boolean().optional()
});
