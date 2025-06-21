import { z } from 'zod'

export const createBorrowZodSchema = z.object({
  book: z.string({ required_error: 'Book ID is required' }),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  dueDate: z.coerce.date({ required_error: 'Due date is required' })
})

export const borrowBookZodSchema = z.object({
  book: z.string({
    required_error: 'Book ID is required',
    invalid_type_error: 'Book ID must be a string',
  }).min(1, 'Book ID cannot be empty'),
  
  quantity: z.number({
    required_error: 'Quantity is required',
    invalid_type_error: 'Quantity must be a number',
  })
  .int('Quantity must be an integer')
  .positive('Quantity must be a positive number'),
  
  dueDate: z.string({
    required_error: 'Due date is required',
    invalid_type_error: 'Due date must be a string in ISO date format',
  }).refine((val) => !isNaN(Date.parse(val)), {
    message: 'Due date must be a valid ISO date string',
  }),
})
