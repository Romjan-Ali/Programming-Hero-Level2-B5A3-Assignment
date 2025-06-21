import { Request, Response } from 'express'
import mongoose from 'mongoose';
import Book from '../models/book.model'
import { 
    createBookZodSchema, 
    getAllBooksQuerySchema, 
    getBookByIdZodSchema, 
    updateBookZodSchema 
} from '../validations/book.validation'

export const getAllBooks = async (req: Request, res: Response): Promise<Response> => {
  try {
    const parsedQuery = getAllBooksQuerySchema.safeParse(req.query)

    if (!parsedQuery.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        error: parsedQuery.error.flatten()
      })
    }

    const { filter, sortBy, sort, limit } = parsedQuery.data

    const query = filter ? { genre: filter } : {}
    const sortOrder = sort === 'asc' ? 1 : -1

    const books = await Book.find(query)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })

    if (books.length === 0) {
      return res.status(404).json({
        success: true,
        message: 'No book found',
        data: []
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Books retrieved successfully',
      data: books
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error getting books'
    })
  }
}

export const getBookByUserIdParam = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Validate params using Zod
    const parsedParams = getBookByIdZodSchema.safeParse(req.params)

    if (!parsedParams.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing bookId parameter',
        error: parsedParams.error.flatten()
      })
    }

    const { bookId } = parsedParams.data

    const book = await Book.findById(bookId)

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Book retrieved successfully',
      data: book
    })
  } catch (err: any) {
    console.error(err)
    return res.status(500).json({
      success: false,
      message: 'Error getting book',
      error: err?.message || err
    })
  }
}

// Create Book
export const createBook = async (req: Request, res: Response): Promise<any> => {
    try {
        // Validate input using Zod
        const parsed = createBookZodSchema.safeParse(req.body)

        if (!parsed.success) {
            return res.status(400).json({
                message: 'Validation failed',
                success: false,
                error: parsed.error.flatten()
            })
        }

        // Create book with validated data
        const newBook = await Book.create(parsed.data)

        return res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: newBook
        })
    } catch (error: any) {
        return res.status(500).json({
            message: 'Error creating a book',
            success: false,
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
                ...(error.errors ? { validationErrors: error.errors } : {})
            }
        })
    }
}

export const bookUpdateById = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Validate the bookId param
    const parsedParams = getBookByIdZodSchema.safeParse(req.params)
    if (!parsedParams.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bookId',
        error: parsedParams.error.flatten()
      })
    }
    const { bookId } = parsedParams.data

    // Validate the update body
    const parsedBody = updateBookZodSchema.safeParse(req.body)
    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid update payload',
        error: parsedBody.error.flatten()
      })
    }

    const updatedBook = await Book.findByIdAndUpdate(bookId, parsedBody.data, {
      new: true,
      runValidators: true
    })

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook
    })
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Error updating a book',
      error: err?.message || err
    })
  }
}

export const bookDeleteById = async (req: Request, res: Response): Promise<any> => {
  try {
    // Validate bookId
    const parsedParams = getBookByIdZodSchema.safeParse(req.params)
    if (!parsedParams.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bookId',
        error: parsedParams.error.flatten()
      })
    }
    const { bookId } = parsedParams.data

    const deletedBook = await Book.findByIdAndDelete(bookId)

    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: null
    })
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting a book',
      error: err?.message || err
    })
  }
}