import { NextFunction, Request, Response } from 'express'
import Borrow from '../models/borrow.model'
import { borrowBookZodSchema } from '../validations/borrow.validation'

// Borrow a book
export const borrowBook = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const parsed = borrowBookZodSchema.safeParse(req.body)

        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                error: parsed.error.flatten()
            })
        }

        const { book, quantity, dueDate } = parsed.data

        if (!book || !quantity || !dueDate) {
            return res.status(400).json({
                success: false,
                message: 'Invalid input, please send book, quantity and dueDate',
                error: req.body.error.flatten()
            })
        }

        // Create borrow record
        const newBorrow = await Borrow.create({
            book,
            quantity,
            dueDate
        })

        return res.status(200).json({
            success: true,
            message: 'Book borrowed successfully',
            data: newBorrow
        })
    } catch (err: any) {
        next(err)
        return res.status(500).json({
            success: false,
            message: 'Error borrowing a book'
        })
    }
}

// Borrowed books summary (Using Aggregation)
export const borrowedBooks = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const borrowedBooks = await Borrow.aggregate([
            {
                $lookup: {
                    from: 'books',
                    localField: 'book',
                    foreignField: '_id',
                    as: 'book'
                }
            },
            {
                $unwind: '$book'
            },
            {
                $group: {
                    _id: '$book._id',
                    title: { $first: '$book.title' },
                    isbn: { $first: '$book.isbn' },
                    totalQuantity: {
                        $sum: '$quantity'
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: '$title',
                        isbn: '$isbn'
                    },
                    totalQuantity: 1
                }
            }
        ])
        return res.status(200).json({
            success: true,
            message: 'Borrowed books summary retrieved successfully',
            data: borrowedBooks
        })
    } catch (err: any) {
        next(err)
        return res.status(500).json({
            success: false,
            message: 'Error getting borrowed books summary'
        })
    }
}