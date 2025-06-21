import { Request, Response } from 'express'
import Book from '../models/book.model'
import Borrow from '../models/borrow.model'

export const borrowBook = async (req: Request, res: Response): Promise<any> => {
    try {
        const { book, quantity, dueDate } = req.body

        if (!book || !quantity || !dueDate) {
            return res.status(400).json({
                success: false,
                message: 'Invalid input, please send book, quantity and dueDate'
            })
        }

        const existsBook = await Book.findById(book)

        if (!existsBook) {
            return res.status(404).json({
                success: false,
                message: 'Book does not exist'
            })
        }

        if (existsBook.copies < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Requested quantity not available'
            })
        }

        // Update using id
        await Book.findByIdAndUpdate(
            book,
            {
                $inc: { copies: -quantity },
                $set: { available: existsBook.copies - quantity === 0 }
            },
            { new: true } // Return updated document
        )

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
        return res.status(500).json({
            success: false,
            message: 'Error borrowing a book'
        })
    }
}

export const borrowedBooks = async (req: Request, res: Response): Promise<any> => {
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
                    title: {$first: '$book.title'},
                    isbn: {$first: '$book.isbn'},
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
        return res.status(500).json({
            success: false,
            message: 'Error getting borrowed books summary'
        })
    }
}