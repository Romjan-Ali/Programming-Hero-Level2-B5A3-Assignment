import { z } from 'zod'

export const createBookZodSchema = z.object({
  title: z.string({
    required_error: 'Title is required'
  }),
  author: z.string({
    required_error: 'Author is required'
  }),
  genre: z.enum(
    ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'],
    { required_error: 'Genre is required and must be a valid value' }
  ),
  isbn: z.string({
    required_error: 'ISBN is required'
  }),
  description: z.string().optional(),
  copies: z
    .number({
      required_error: 'Copies is required'
    })
    .min(0, 'Copies must be a non-negative number'),
  available: z.boolean().optional()
})

export const getAllBooksQuerySchema = z.object({
  filter: z
    .string()
    .optional()
    .transform(val => val?.toUpperCase()),
  sortBy: z.string().optional().default('createdAt'),
  sort: z.enum(['asc', 'desc']).optional().default('desc'),
  limit: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val, 10) : 10))
    .refine(val => val > 0, { message: 'Limit must be a positive number' })
})

export const getBookByIdZodSchema = z.object({
  bookId: z
    .string({
      required_error: 'bookId is required'
    })
    .refine(val => /^[a-f\d]{24}$/i.test(val), {
      message: 'Invalid bookId format'
    })
})

export const updateBookZodSchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  genre: z.enum(
    ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY']
  ).optional(),
  isbn: z.string().optional(),
  description: z.string().optional(),
  copies: z
    .number()
    .min(0, 'Copies must be a non-negative number')
    .optional(),
  available: z.boolean().optional()
})