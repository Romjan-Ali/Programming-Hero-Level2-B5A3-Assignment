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
exports.bookDeleteById = exports.bookUpdateById = exports.getBookByUserIdParam = exports.getAllBooks = exports.createBook = void 0;
const book_model_1 = __importDefault(require("../models/book.model"));
const book_validation_1 = require("../validations/book.validation");
// Create a book
const createBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate input using Zod
        const parsed = book_validation_1.createBookZodSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: 'Validation failed',
                success: false,
                error: parsed.error.flatten()
            });
        }
        // Create book with validated data
        const newBook = yield book_model_1.default.create(parsed.data);
        return res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: newBook
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Error creating a book',
            success: false,
            error: Object.assign({ name: error.name, message: error.message, stack: error.stack }, (error.errors ? { validationErrors: error.errors } : {}))
        });
    }
});
exports.createBook = createBook;
// Get all books
const getAllBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedQuery = book_validation_1.getAllBooksQuerySchema.safeParse(req.query);
        if (!parsedQuery.success) {
            return res.status(400).json({
                success: false,
                message: 'Invalid query parameters',
                error: parsedQuery.error.flatten()
            });
        }
        const { filter, sortBy, sort, limit } = parsedQuery.data;
        const query = filter ? { genre: filter } : {};
        const sortOrder = sort === 'asc' ? 1 : -1;
        const books = yield book_model_1.default.find(query)
            .limit(limit)
            .sort({ [sortBy]: sortOrder });
        if (books.length === 0) {
            return res.status(404).json({
                success: true,
                message: 'No book found',
                data: []
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Books retrieved successfully',
            data: books
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error getting books'
        });
    }
});
exports.getAllBooks = getAllBooks;
// Get book by ID
const getBookByUserIdParam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate params using Zod
        const parsedParams = book_validation_1.getBookByIdZodSchema.safeParse(req.params);
        if (!parsedParams.success) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or missing bookId parameter',
                error: parsedParams.error.flatten()
            });
        }
        const { bookId } = parsedParams.data;
        const book = yield book_model_1.default.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Book retrieved successfully',
            data: book
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Error getting book',
            error: (err === null || err === void 0 ? void 0 : err.message) || err
        });
    }
});
exports.getBookByUserIdParam = getBookByUserIdParam;
// Update book
const bookUpdateById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the bookId param
        const parsedParams = book_validation_1.getBookByIdZodSchema.safeParse(req.params);
        if (!parsedParams.success) {
            return res.status(400).json({
                success: false,
                message: 'Invalid bookId',
                error: parsedParams.error.flatten()
            });
        }
        const { bookId } = parsedParams.data;
        // Validate the update body
        const parsedBody = book_validation_1.updateBookZodSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({
                success: false,
                message: 'Invalid update payload',
                error: parsedBody.error.flatten()
            });
        }
        const bookToUpdate = yield book_model_1.default.findById(bookId);
        if (!bookToUpdate) {
            return res.status(404).json({
                success: false,
                message: 'Book not found',
            });
        }
        // Apply the incoming update fields
        Object.assign(bookToUpdate, parsedBody.data);
        // Call the instance method to enforce business logic
        bookToUpdate.updateAvailability();
        // Save the document with validation
        const updatedBook = yield bookToUpdate.save();
        return res.status(200).json({
            success: true,
            message: 'Book updated successfully',
            data: updatedBook,
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error updating a book',
            error: (err === null || err === void 0 ? void 0 : err.message) || err
        });
    }
});
exports.bookUpdateById = bookUpdateById;
// Delete book
const bookDeleteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate bookId
        const parsedParams = book_validation_1.getBookByIdZodSchema.safeParse(req.params);
        if (!parsedParams.success) {
            return res.status(400).json({
                success: false,
                message: 'Invalid bookId',
                error: parsedParams.error.flatten()
            });
        }
        const { bookId } = parsedParams.data;
        const deletedBook = yield book_model_1.default.findByIdAndDelete(bookId);
        if (!deletedBook) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Book deleted successfully',
            data: null
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting a book',
            error: (err === null || err === void 0 ? void 0 : err.message) || err
        });
    }
});
exports.bookDeleteById = bookDeleteById;
