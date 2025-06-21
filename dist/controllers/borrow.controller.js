"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowedBooks = exports.borrowBook = void 0;
const book_model_1 = __importDefault(require("../models/book.model"));
const borrow_model_1 = __importDefault(require("../models/borrow.model"));
const borrowBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book, quantity, dueDate } = req.body;
        if (!book || !quantity || !dueDate) {
            return res.status(400).json({
                success: false,
                message: 'Invalid input, please send book, quantity and dueDate'
            });
        }
        const existsBook = yield book_model_1.default.findById(book);
        if (!existsBook) {
            return res.status(404).json({
                success: false,
                message: 'Book does not exist'
            });
        }
        if (existsBook.copies < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Requested quantity not available'
            });
        }
        // Update using id
        yield book_model_1.default.findByIdAndUpdate(book, {
            $inc: { copies: -quantity },
            $set: { available: existsBook.copies - quantity === 0 }
        }, { new: true } // Return updated document
        );
        // Create borrow record
        const newBorrow = yield borrow_model_1.default.create({
            book,
            quantity,
            dueDate
        });
        return res.status(200).json({
            success: true,
            message: 'Book borrowed successfully',
            data: newBorrow
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error borrowing a book'
        });
    }
});
exports.borrowBook = borrowBook;
const borrowedBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const borrowedBooks = yield borrow_model_1.default.aggregate([
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
        ]);
        return res.status(200).json({
            success: true,
            message: 'Borrowed books summary retrieved successfully',
            data: borrowedBooks
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error getting borrowed books summary'
        });
    }
});
exports.borrowedBooks = borrowedBooks;
